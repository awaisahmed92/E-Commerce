import { NextResponse } from "next/server";
import prisma from "./db";
import { getSession, hasPermission, type SessionUser } from "./auth";
import { getRedis } from "./redis";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data }, init);
}

export function fail(message: string, status = 400, extra?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, error: message, ...(extra || {}) }, { status });
}

/** Require a logged-in user. Returns the session or a ready-to-return NextResponse. */
export async function requireAuth(): Promise<{ session: SessionUser } | { response: NextResponse }> {
  const session = await getSession();
  if (!session) return { response: fail("Authentication required.", 401) };
  return { session };
}

/** Require a permission (super_admin bypasses). */
export async function requirePermission(
  key: string
): Promise<{ session: SessionUser } | { response: NextResponse }> {
  const session = await getSession();
  if (!session) return { response: fail("Authentication required.", 401) };
  if (session.role === "customer") return { response: fail("Forbidden.", 403) };
  if (!hasPermission(session, key)) return { response: fail(`Missing permission: ${key}`, 403) };
  return { session };
}

// ── rate limiter: Redis-backed when REDIS_URL is set (survives restarts, works across
// instances), falls back to an in-memory Map otherwise (dev-only, resets on restart). ──
const buckets = new Map<string, { count: number; resetAt: number }>();

function rateLimitMemory(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (b.count >= limit) return false;
  b.count += 1;
  return true;
}

// INCR + set expiry atomically only on the first hit in a window — a plain INCR-then-EXPIRE
// pair would race under concurrent requests (a key could end up with no TTL at all).
const RATE_LIMIT_SCRIPT = `
local count = redis.call("INCR", KEYS[1])
if count == 1 then
  redis.call("PEXPIRE", KEYS[1], ARGV[1])
end
return count
`;

export async function rateLimit(key: string, limit = 10, windowMs = 60_000): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return rateLimitMemory(key, limit, windowMs);
  try {
    const count = (await redis.eval(RATE_LIMIT_SCRIPT, 1, `ratelimit:${key}`, windowMs)) as number;
    return count <= limit;
  } catch (e) {
    console.error("[rateLimit] redis error, falling back to in-memory for this call", e);
    return rateLimitMemory(key, limit, windowMs);
  }
}

/**
 * X-Forwarded-For / X-Real-Ip are attacker-controlled unless a trusted reverse proxy overwrites
 * them before the request reaches this app. Only honor them when TRUST_PROXY=true is set (i.e.
 * you've actually deployed behind such a proxy — nginx/Caddy/etc — configured to strip
 * client-supplied values). Otherwise every request maps to the same bucket, which turns rate
 * limiting into a blunt global throttle instead of a spoofable per-IP one — safe default until a
 * real proxy is in front of this app.
 */
export function clientIp(req: Request): string {
  if (process.env.TRUST_PROXY === "true") {
    return (
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "unknown"
    );
  }
  return "unknown";
}

/** Audit trail for admin actions. */
export async function audit(
  userId: string | null,
  action: string,
  entity: string,
  entityId?: string | null,
  details?: string
) {
  try {
    await prisma.auditLog.create({
      data: { userId: userId ?? undefined, action, entity, entityId: entityId ?? undefined, details },
    });
  } catch (e) {
    console.error("audit failed", e);
  }
}

/** Robust wrapper for JSON route handlers. */
export function handle<T extends unknown[]>(
  fn: (...args: T) => Promise<NextResponse>
): (...args: T) => Promise<NextResponse> {
  return async (...args: T) => {
    try {
      return await fn(...args);
    } catch (e: any) {
      if (e?.name === "ZodError") {
        return fail(e.errors?.[0]?.message || "Validation failed.", 400, { issues: e.errors });
      }
      console.error("[api error]", e);
      return fail(e?.message || "Unexpected server error.", 500);
    }
  };
}

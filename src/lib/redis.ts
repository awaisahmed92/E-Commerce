import Redis from "ioredis";

const globalForRedis = globalThis as unknown as { redis?: Redis | null };

/** Lazily-created singleton. Returns null when REDIS_URL isn't configured — callers fall back. */
export function getRedis(): Redis | null {
  if (!process.env.REDIS_URL) return null;
  if (globalForRedis.redis === undefined) {
    globalForRedis.redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      lazyConnect: false,
    });
    globalForRedis.redis.on("error", (e) => console.error("[redis]", e.message));
  }
  return globalForRedis.redis;
}

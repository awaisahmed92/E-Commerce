/**
 * Cloudflare Turnstile. Inactive until both keys are set, so local checkout keeps working.
 * NEXT_PUBLIC_TURNSTILE_SITE_KEY is what the checkout widget renders.
 * TURNSTILE_SECRET_KEY is what this function checks the token against.
 */
export async function verifyTurnstile(token: string, ip: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim() || "";
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || "";
  if (!secret && !siteKey) return { ok: true };
  if (!secret || !siteKey) {
    console.error("[turnstile] Set both TURNSTILE_SECRET_KEY and NEXT_PUBLIC_TURNSTILE_SITE_KEY.");
    return { ok: false, error: "Checkout is temporarily unavailable. Please try again later." };
  }
  if (!token) return { ok: false, error: "Please confirm you are not a robot." };

  const body = new URLSearchParams({ secret, response: token });
  if (ip && ip !== "unknown") body.set("remoteip", ip);

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const json = (await res.json().catch(() => null)) as { success?: boolean } | null;
  if (!json?.success) return { ok: false, error: "Please confirm you are not a robot." };
  return { ok: true };
}

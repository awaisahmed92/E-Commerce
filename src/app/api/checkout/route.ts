import { handle, ok, fail, rateLimit, clientIp } from "@/lib/api";
import { placeOrder, CheckoutError } from "@/services/checkout.service";
import { CouponError } from "@/services/coupon.service";
import { generateOrderToken } from "@/lib/order-token";
import { verifyTurnstile } from "@/lib/turnstile";

export const POST = handle(async (req: Request) => {
  if (!(await rateLimit(`checkout:${clientIp(req)}`, 8, 60_000))) return fail("Too many attempts. Please wait a moment.", 429);
  const body = await req.json();
  const turnstileToken = typeof body?.turnstileToken === "string" ? body.turnstileToken : "";
  if (body && typeof body === "object") delete body.turnstileToken;
  const verdict = await verifyTurnstile(turnstileToken, clientIp(req));
  if (!verdict.ok) return fail(verdict.error, 400);
  try {
    const order = await placeOrder(body);
    const confirmationToken = order ? generateOrderToken(order.id) : null;
    return ok({ order, confirmationToken });
  } catch (e) {
    if (e instanceof CheckoutError || e instanceof CouponError) return fail(e.message, 400);
    throw e;
  }
});

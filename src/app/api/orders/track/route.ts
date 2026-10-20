import { z } from "zod";
import prisma from "@/lib/db";
import { clientIp, fail, handle, ok, rateLimit } from "@/lib/api";

const inputSchema = z.object({
  orderNumber: z.string().trim().min(5, "Enter a valid order number.").max(40),
  identifier: z.string().trim().min(5, "Enter the email or mobile used for the order.").max(160),
});

function phoneDigits(value: string) {
  return value.replace(/\D/g, "");
}

export const POST = handle(async (request: Request) => {
  if (!(await rateLimit(`order-track:${clientIp(request)}`, 10, 10 * 60_000))) {
    return fail("Too many tracking attempts. Please wait and try again.", 429);
  }

  const input = inputSchema.parse(await request.json());
  const order = await prisma.order.findUnique({
    where: { orderNumber: input.orderNumber.toUpperCase() },
    include: {
      items: {
        select: {
          id: true,
          productName: true,
          variantName: true,
          image: true,
          quantity: true,
        },
      },
      history: {
        select: { id: true, status: true, createdAt: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  const emailMatches = order?.email.toLowerCase() === input.identifier.toLowerCase();
  const submittedPhone = phoneDigits(input.identifier);
  const phoneMatches = submittedPhone.length >= 7 && phoneDigits(order?.phone ?? "") === submittedPhone;

  if (!order || (!emailMatches && !phoneMatches)) {
    return fail("We could not match that order number with the supplied email or mobile.", 404);
  }

  return ok({
    order: {
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      placedAt: order.placedAt,
      trackingNumber: order.trackingNumber,
      shippingMethodName: order.shippingMethodName,
      total: order.total,
      items: order.items,
      history: order.history,
    },
  });
});

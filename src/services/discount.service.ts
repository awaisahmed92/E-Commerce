import prisma from "@/lib/db";

/**
 * DiscountService — the single source of truth for pricing.
 * Every surface (PLP, PDP, cart, checkout, admin preview) resolves prices here.
 *
 * Resolution priority (no double-dipping by design):
 *   1. Product-targeted promotion  (PRODUCT / FLASH)
 *   2. Product's own salePrice
 *   3. Category promotion
 *   4. Store-wide promotion
 * Coupons apply afterwards at order level.
 *
 * The actual pure pricing math lives in `@/lib/pricing-engine` (no `prisma` import, safe to pull
 * into client bundles) — re-exported here so every existing (server-only) caller of this file
 * keeps working unchanged. `PurchasePanel.tsx` ("use client") imports directly from
 * `@/lib/pricing-engine` instead of here, since this file's `prisma` import is a real value
 * import that must never reach a client bundle — see that file for why.
 */
export {
  type ActivePromotion,
  type PriceResult,
  type PriceableProduct,
  type PriceableVariant,
  priceForProduct,
  freeUnitsForLine,
  freeShippingThreshold,
} from "@/lib/pricing-engine";
import type { ActivePromotion } from "@/lib/pricing-engine";

export async function getActivePromotions(): Promise<ActivePromotion[]> {
  const now = new Date();
  return prisma.promotion.findMany({
    where: {
      isActive: true,
      AND: [
        { OR: [{ startDate: null }, { startDate: { lte: now } }] },
        { OR: [{ endDate: null }, { endDate: { gte: now } }] },
      ],
    },
    include: { products: { select: { productId: true } }, categories: { select: { categoryId: true } } },
    orderBy: [{ priority: "desc" }, { createdAt: "asc" }],
  });
}

/**
 * Where needed outside the service layer. Derived from the actual (extended) `prisma` client's
 * own `$transaction` callback rather than the raw `Prisma.TransactionClient` — the extension in
 * `@/lib/db` (Decimal -> number conversion) changes the client's type, and the base type doesn't
 * know about that.
 */
export type Tx = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

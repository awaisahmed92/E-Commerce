import type { Product, Promotion } from "@prisma/client";

/**
 * Pure price-resolution logic — deliberately has NO import of `@/lib/db` or any other module with
 * a runtime dependency on `@prisma/client`'s value exports. `PurchasePanel.tsx` ("use client")
 * imports `priceForProduct` directly from here rather than from `discount.service.ts`, because
 * `discount.service.ts` imports the `prisma` client (a real value import with module-level side
 * effects), which — once transitively bundled into client JS — throws
 * "PrismaClient is unable to run in this browser environment" the moment the module evaluates.
 * `import type` (as used below) has zero runtime footprint and is always safe in client bundles;
 * only VALUE imports of `@/lib/db` are the actual hazard.
 *
 * `discount.service.ts` re-exports everything here for its existing (server-only) callers, so
 * this split is invisible to them.
 */

// `discountValue` is `Decimal` in the raw Prisma-generated type, but the `prisma` client in
// `@/lib/db` converts it to `number` at the extension boundary (see that file) — override the
// field here to match what actually comes back at runtime.
export type ActivePromotion = Omit<Promotion, "discountValue"> & {
  discountValue: number;
  products: { productId: string }[];
  categories: { categoryId: string }[];
};

export type PriceResult = {
  base: number; // catalog price (variant price or product originalPrice)
  final: number; // unit price after item-level discounts
  source: "NONE" | "SALE_PRICE" | "PRODUCT_PROMO" | "CATEGORY_PROMO" | "STORE_PROMO" | "FLASH";
  label: string | null;
  promotionId?: string;
  discountPercent: number;
};

// Same Decimal -> number override as ActivePromotion above.
export type PriceableProduct = Pick<Product, "categoryId"> & { id: string; originalPrice: number; salePrice: number | null };
export type PriceableVariant = { price: number | null; salePrice: number | null };

export function priceForProduct(
  product: PriceableProduct,
  promos: ActivePromotion[],
  variant?: PriceableVariant | null
): PriceResult {
  const base = Math.round(variant?.price ?? product.originalPrice);
  const variantSale = variant?.salePrice ?? null;

  const apply = (p: ActivePromotion): number => {
    if (p.discountType === "PERCENTAGE") return Math.max(0, Math.round(base * (1 - p.discountValue / 100)));
    if (p.discountType === "FIXED") return Math.max(0, Math.round(base - p.discountValue));
    return base;
  };

  const productPromo = promos.find(
    (p) => (p.type === "PRODUCT" || p.type === "FLASH") && p.products.some((x) => x.productId === product.id)
  );
  if (productPromo) {
    const final = apply(productPromo);
    if (final < base)
      return toResult(base, final, productPromo.type === "FLASH" ? "FLASH" : "PRODUCT_PROMO", productPromo.name, productPromo.id);
  }

  const productPromoId = productPromo?.id;
  const sale = variantSale ?? product.salePrice;
  if (sale != null && sale < base) return toResult(base, Math.round(sale), "SALE_PRICE", "Sale");

  const categoryPromo = promos.find(
    (p) => p.type === "CATEGORY" && p.categories.some((x) => x.categoryId === product.categoryId)
  );
  if (categoryPromo) {
    const final = apply(categoryPromo);
    if (final < base) return toResult(base, final, "CATEGORY_PROMO", categoryPromo.name, categoryPromo.id);
  }

  const storePromo = promos.find((p) => p.type === "STORE_WIDE");
  if (storePromo) {
    const final = apply(storePromo);
    if (final < base) return toResult(base, final, "STORE_PROMO", storePromo.name, storePromo.id);
  }

  void productPromoId;
  return toResult(base, base, "NONE", null);
}

function toResult(
  base: number,
  final: number,
  source: PriceResult["source"],
  label: string | null,
  promotionId?: string
): PriceResult {
  return {
    base,
    final,
    source,
    label: source === "NONE" ? null : label,
    promotionId: source === "NONE" ? undefined : promotionId,
    discountPercent: base > 0 ? Math.round(((base - final) / base) * 100) : 0,
  };
}

/** Buy X Get Y: returns number of free units for a cart line. */
export function freeUnitsForLine(
  productId: string,
  quantity: number,
  promos: ActivePromotion[]
): { freeUnits: number; promo?: ActivePromotion } {
  const promo = promos.find(
    (p) => p.type === "BUY_X_GET_Y" && p.products.some((x) => x.productId === productId)
  );
  if (!promo) return { freeUnits: 0 };
  let buy = 0,
    get = 0;
  try {
    const cfg = JSON.parse(promo.configJson || "{}");
    buy = Number(cfg.buy) || 0;
    get = Number(cfg.get) || 0;
  } catch {}
  if (buy <= 0 || get <= 0) return { freeUnits: 0, promo };
  const freeUnits = Math.floor(quantity / (buy + get)) * get;
  return { freeUnits, promo };
}

/** Store-wide FREE_SHIPPING promotion threshold (Rs.) if one is active. */
export function freeShippingThreshold(promos: ActivePromotion[]): number | null {
  const promo = promos.find((p) => p.type === "FREE_SHIPPING");
  if (!promo) return null;
  return promo.discountValue > 0 ? promo.discountValue : 0;
}

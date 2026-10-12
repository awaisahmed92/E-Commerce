// Cost + margin → suggested selling price. Used by admin Product/Category forms.
export type MarginType = "percent" | "flat";

export type MarginConfig = { marginType?: string | null; marginValue?: number | null };

export function computeSuggestedPrice(costPrice: number, marginType: MarginType, marginValue: number): number {
  const raw = marginType === "percent" ? costPrice * (1 + marginValue / 100) : costPrice + marginValue;
  return Math.max(0, Math.round(raw * 100) / 100);
}

// Product margin overrides category margin overrides the store-wide default.
export function resolveEffectiveMargin(
  product: MarginConfig,
  category: MarginConfig | null | undefined,
  storeDefault: { marginType: MarginType; marginValue: number }
): { marginType: MarginType; marginValue: number; source: "product" | "category" | "store" } {
  if (product.marginType && product.marginValue != null)
    return { marginType: product.marginType as MarginType, marginValue: product.marginValue, source: "product" };
  if (category?.marginType && category.marginValue != null)
    return { marginType: category.marginType as MarginType, marginValue: category.marginValue, source: "category" };
  return { ...storeDefault, source: "store" };
}

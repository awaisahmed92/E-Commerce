"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ImagePicker from "./ImagePicker";
import { Spinner } from "@/components/ui/primitives";
import { IconTrash } from "@/components/ui/icons";
import { computeSuggestedPrice, resolveEffectiveMargin, type MarginType } from "@/lib/pricing";

type Variant = {
  id?: string; size: string; color: string; sku: string; price: string; salePrice: string; stock: string; isActive: boolean;
};
type Props = {
  categories: { id: string; name: string; parent: { name: string } | null; marginType: string | null; marginValue: number | null }[];
  initial?: any;
  defaultMargin: { marginType: MarginType; marginValue: number };
};

const MARGIN_TYPE_OPTIONS = [
  { value: "", label: "Inherit from category / store default" },
  { value: "percent", label: "Percentage of cost" },
  { value: "flat", label: "Flat amount (Rs.)" },
];

const newVariant = (skuPrefix: string): Variant => ({ size: "", color: "", sku: `${skuPrefix}-`, price: "", salePrice: "", stock: "0", isActive: true });

export default function ProductForm({ categories, initial, defaultMargin }: Props) {
  const router = useRouter();
  const isEdit = !!initial?.id;

  const [f, setF] = useState({
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    shortDescription: initial?.shortDescription ?? "",
    description: initial?.description ?? "",
    sku: initial?.sku ?? "",
    barcode: initial?.barcode ?? "",
    brand: initial?.brand ?? "Khairpur Dates House",
    categoryId: initial?.categoryId ?? "",
    tags: initial?.tags ?? "",
    originalPrice: initial ? String(initial.originalPrice) : "",
    salePrice: initial?.salePrice != null ? String(initial.salePrice) : "",
    costPrice: initial?.costPrice != null ? String(initial.costPrice) : "",
    marginType: initial?.marginType ?? "",
    marginValue: initial?.marginValue != null ? String(initial.marginValue) : "",
    stock: initial ? String(initial.stock) : "0",
    lowStockThreshold: initial ? String(initial.lowStockThreshold) : "5",
    status: initial?.status ?? "ACTIVE",
    isFeatured: initial?.isFeatured ?? false,
    isNewArrival: initial?.isNewArrival ?? false,
    isBestSeller: initial?.isBestSeller ?? false,
    allowBackorder: initial?.allowBackorder ?? false,
    seoTitle: initial?.seoTitle ?? "",
    seoDescription: initial?.seoDescription ?? "",
  });
  const [images, setImages] = useState<string[]>(initial?.images?.map((i: any) => i.url) ?? []);
  const [variants, setVariants] = useState<Variant[]>(
    initial?.variants?.map((v: any) => ({
      id: v.id, size: v.size ?? "", color: v.color ?? "", sku: v.sku,
      price: v.price != null ? String(v.price) : "", salePrice: v.salePrice != null ? String(v.salePrice) : "",
      stock: String(v.stock), isActive: v.isActive,
    })) ?? []
  );
  const [state, setState] = useState<{ saving: boolean; error?: string }>({ saving: false });

  const set = (k: string, v: any) => setF((p) => ({ ...p, [k]: v }));

  const cats = categories.map((c) => ({ ...c, label: c.parent ? `${c.parent.name} → ${c.name}` : c.name }));
  const selectedCategory = cats.find((c) => c.id === f.categoryId) ?? null;
  const effectiveMargin = resolveEffectiveMargin(
    { marginType: f.marginType || null, marginValue: f.marginValue === "" ? null : Number(f.marginValue) },
    selectedCategory,
    defaultMargin
  );
  const costNum = Number(f.costPrice);
  const suggestedPrice = costNum > 0 ? computeSuggestedPrice(costNum, effectiveMargin.marginType, effectiveMargin.marginValue) : null;

  // Auto-fill Original Price from cost + effective margin whenever cost/margin/category change.
  // Skipped on mount so opening an existing product doesn't overwrite its saved price. Tracks the
  // last-processed dependency signature (not just a boolean) because React Strict Mode's dev-mode
  // double-invocation of effects would otherwise fire this on the *second* mount invocation (a
  // plain "have I run once" ref flips true after the first invocation, so the second one — same
  // deps, no real user change — incorrectly looks like a genuine update and silently overwrites
  // Original Price with the suggested price the instant the edit page loads).
  const lastMarginDeps = useRef<string | null>(null);
  useEffect(() => {
    const depsKey = `${f.costPrice}|${f.marginType}|${f.marginValue}|${f.categoryId}`;
    if (lastMarginDeps.current === null || lastMarginDeps.current === depsKey) {
      lastMarginDeps.current = depsKey;
      return;
    }
    lastMarginDeps.current = depsKey;
    if (suggestedPrice != null) set("originalPrice", String(suggestedPrice));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [f.costPrice, f.marginType, f.marginValue, f.categoryId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState({ saving: true });
    const payload = {
      ...f,
      slug: f.slug || null,
      shortDescription: f.shortDescription || null,
      description: f.description || null,
      barcode: f.barcode || null,
      brand: f.brand || null,
      tags: f.tags || null,
      originalPrice: Number(f.originalPrice),
      salePrice: f.salePrice === "" ? null : Number(f.salePrice),
      costPrice: f.costPrice === "" ? null : Number(f.costPrice),
      marginType: f.marginType || null,
      marginValue: f.marginValue === "" ? null : Number(f.marginValue),
      stock: Number(f.stock) || 0,
      lowStockThreshold: Number(f.lowStockThreshold) || 0,
      seoTitle: f.seoTitle || null,
      seoDescription: f.seoDescription || null,
      images: images.filter(Boolean).map((url, i) => ({ url, sortOrder: i })),
      variants: variants.map((v) => ({
        ...(v.id ? { id: v.id } : {}),
        size: v.size || null,
        color: v.color || null,
        sku: v.sku,
        price: v.price === "" ? null : Number(v.price),
        salePrice: v.salePrice === "" ? null : Number(v.salePrice),
        stock: Number(v.stock) || 0,
        isActive: v.isActive,
      })),
    };
    const res = await fetch(isEdit ? `/api/admin/products/${initial.id}` : "/api/admin/products", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!json.ok) {
      setState({ saving: false, error: json.error || "Validation failed." });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    router.push("/admin/products");
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      {state.error && <p className="border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm text-rose-700">{state.error}</p>}

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {/* basics */}
          <section className="admin-card space-y-4">
            <h2 className="font-serif text-lg">Basics</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="admin-label">Product Name *</label>
                <input required className="admin-input" value={f.name} onChange={(e) => set("name", e.target.value)} />
              </div>
              <div>
                <label className="admin-label">Slug (auto if empty)</label>
                <input className="admin-input" value={f.slug} onChange={(e) => set("slug", e.target.value)} placeholder="aseel-select-dates" />
              </div>
              <div>
                <label className="admin-label">Brand</label>
                <input className="admin-input" value={f.brand} onChange={(e) => set("brand", e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className="admin-label">Short Description</label>
                <input className="admin-input" value={f.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} placeholder="One-liner shown under the product name" />
              </div>
              <div className="sm:col-span-2">
                <label className="admin-label">Full Description</label>
                <textarea className="admin-input min-h-[140px]" value={f.description} onChange={(e) => set("description", e.target.value)} />
              </div>
              <div>
                <label className="admin-label">Category *</label>
                <select required className="admin-input" value={f.categoryId} onChange={(e) => set("categoryId", e.target.value)}>
                  <option value="">Select…</option>
                  {cats.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="admin-label">Tags (comma separated)</label>
                <input className="admin-input" value={f.tags} onChange={(e) => set("tags", e.target.value)} placeholder="aseel, select, semi-dry, khairpur" />
              </div>
            </div>
          </section>

          {/* images */}
          <section className="admin-card space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg">Images</h2>
              <button type="button" className="admin-btn-outline !px-3 !py-1.5" onClick={() => setImages([...images, ""])}>+ Add Image</button>
            </div>
            {images.length === 0 && <p className="text-sm text-ink/40">No images yet — add at least one.</p>}
            <div className="space-y-4">
              {images.map((url, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="pt-2 text-xs font-bold text-ink/30">{i + 1}</span>
                  <div className="flex-1">
                    <ImagePicker value={url} onChange={(u) => setImages(images.map((x, j) => (j === i ? u : x)))} folder="products" />
                  </div>
                  <div className="flex flex-col gap-1 pt-1">
                    <button type="button" aria-label="Move up" className="text-xs" disabled={i === 0} onClick={() => { const c = [...images]; [c[i - 1], c[i]] = [c[i], c[i - 1]]; setImages(c); }}>▲</button>
                    <button type="button" aria-label="Move down" className="text-xs" disabled={i === images.length - 1} onClick={() => { const c = [...images]; [c[i + 1], c[i]] = [c[i], c[i + 1]]; setImages(c); }}>▼</button>
                    <button type="button" aria-label="Remove image" className="text-rose-600" onClick={() => setImages(images.filter((_, j) => j !== i))}>
                      <IconTrash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* variants */}
          <section className="admin-card space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-serif text-lg">Variants</h2>
                <p className="text-xs text-ink/40">Use Size for pack size (500 g, 1 kg, 5 kg). Each pack has its own SKU, price and stock.</p>
              </div>
              <div className="flex gap-2">
                <button type="button" className="admin-btn-outline !px-3 !py-1.5" onClick={() => setVariants([...variants, newVariant(f.sku || "SKU")])}>+ Add Variant</button>
                <button
                  type="button"
                  className="admin-btn-outline !px-3 !py-1.5"
                  onClick={() => {
                    const sizes = ["S", "M", "L", "XL"];
                    const existing = new Set(variants.map((v) => v.size));
                    setVariants([...variants, ...sizes.filter((s) => !existing.has(s)).map((s) => ({ ...newVariant(f.sku || "SKU"), sku: `${f.sku || "SKU"}-${s}`, size: s, stock: "10" }))]);
                  }}
                >
                  + Sizes S–XL
                </button>
              </div>
            </div>
            {variants.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px]">
                  <thead>
                    <tr className="border-b border-line text-left">
                      <th className="admin-th">Pack Size</th><th className="admin-th">Option</th><th className="admin-th">SKU *</th>
                      <th className="admin-th">Price (opt)</th><th className="admin-th">Sale (opt)</th><th className="admin-th">Stock</th>
                      <th className="admin-th">Active</th><th className="admin-th"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {variants.map((v, i) => (
                      <tr key={i} className="border-b border-line/60">
                        {(["size", "color", "sku", "price", "salePrice", "stock"] as const).map((k) => (
                          <td key={k} className="p-1.5">
                            <input
                              className="admin-input !py-1.5"
                              value={v[k]}
                              type={k === "price" || k === "salePrice" || k === "stock" ? "number" : "text"}
                              required={k === "sku"}
                              onChange={(e) => setVariants(variants.map((x, j) => (j === i ? { ...x, [k]: e.target.value } : x)))}
                            />
                          </td>
                        ))}
                        <td className="p-1.5 text-center">
                          <input type="checkbox" className="h-4 w-4 accent-ink" checked={v.isActive} onChange={(e) => setVariants(variants.map((x, j) => (j === i ? { ...x, isActive: e.target.checked } : x)))} />
                        </td>
                        <td className="p-1.5">
                          <button type="button" aria-label="Remove variant" className="text-rose-600" onClick={() => setVariants(variants.filter((_, j) => j !== i))}>
                            <IconTrash className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* SEO */}
          <section className="admin-card space-y-4">
            <h2 className="font-serif text-lg">SEO</h2>
            <div>
              <label className="admin-label">SEO Title</label>
              <input className="admin-input" value={f.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} />
            </div>
            <div>
              <label className="admin-label">SEO Description</label>
              <textarea className="admin-input" rows={2} value={f.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} />
            </div>
          </section>
        </div>

        {/* right rail */}
        <div className="space-y-6">
          <section className="admin-card space-y-4">
            <h2 className="font-serif text-lg">Pricing</h2>
            <div><label className="admin-label">Cost Price (Rs.)</label><input type="number" min="0" className="admin-input" value={f.costPrice} onChange={(e) => set("costPrice", e.target.value)} placeholder="What this item costs you" /></div>
            <div>
              <label className="admin-label">Margin Override</label>
              <select className="admin-input" value={f.marginType} onChange={(e) => set("marginType", e.target.value)}>
                {MARGIN_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            {f.marginType && (
              <div><label className="admin-label">Margin Value {f.marginType === "flat" ? "(Rs.)" : "(%)"}</label><input type="number" min="0" className="admin-input" value={f.marginValue} onChange={(e) => set("marginValue", e.target.value)} /></div>
            )}
            {suggestedPrice != null && (
              <p className="text-xs text-ink/50">
                Suggested from cost + {effectiveMargin.marginType === "flat" ? `Rs. ${effectiveMargin.marginValue}` : `${effectiveMargin.marginValue}%`} margin
                {effectiveMargin.source !== "product" && ` (${effectiveMargin.source} default)`}: <strong>Rs. {suggestedPrice.toLocaleString()}</strong>
              </p>
            )}
            <div><label className="admin-label">Original Price (Rs.) *</label><input required type="number" min="1" className="admin-input" value={f.originalPrice} onChange={(e) => set("originalPrice", e.target.value)} /><p className="mt-1 text-xs text-ink/40">Auto-filled from cost + margin above; edit freely — it re-fills only when cost or margin changes.</p></div>
            <div><label className="admin-label">Sale Price (Rs.)</label><input type="number" min="0" className="admin-input" value={f.salePrice} onChange={(e) => set("salePrice", e.target.value)} placeholder="Optional" /></div>
            {Number(f.salePrice) > 0 && Number(f.salePrice) < Number(f.originalPrice) && (
              <p className="text-xs font-semibold text-emerald-700">Customer saves Rs. {(Number(f.originalPrice) - Number(f.salePrice)).toLocaleString()} ({Math.round((1 - Number(f.salePrice) / Number(f.originalPrice)) * 100)}%)</p>
            )}
          </section>

          <section className="admin-card space-y-4">
            <h2 className="font-serif text-lg">Inventory</h2>
            <div><label className="admin-label">SKU *</label><input required className="admin-input" value={f.sku} onChange={(e) => set("sku", e.target.value)} /></div>
            <div><label className="admin-label">Barcode</label><input className="admin-input" value={f.barcode} onChange={(e) => set("barcode", e.target.value)} /></div>
            {variants.length === 0 && (
              <div><label className="admin-label">Stock Quantity</label><input type="number" min="0" className="admin-input" value={f.stock} onChange={(e) => set("stock", e.target.value)} /></div>
            )}
            <div><label className="admin-label">Low Stock Threshold</label><input type="number" min="0" className="admin-input" value={f.lowStockThreshold} onChange={(e) => set("lowStockThreshold", e.target.value)} /></div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="h-4 w-4 accent-ink" checked={f.allowBackorder} onChange={(e) => set("allowBackorder", e.target.checked)} /> Allow backorders</label>
          </section>

          <section className="admin-card space-y-3">
            <h2 className="font-serif text-lg">Visibility</h2>
            <div>
              <label className="admin-label">Status</label>
              <select className="admin-input" value={f.status} onChange={(e) => set("status", e.target.value)}>
                <option value="ACTIVE">Active</option>
                <option value="DRAFT">Draft</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
            {[
              ["isFeatured", "Featured product"],
              ["isNewArrival", "New arrival"],
              ["isBestSeller", "Best seller (manual override)"],
            ].map(([k, label]) => (
              <label key={k} className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="h-4 w-4 accent-ink" checked={(f as any)[k]} onChange={(e) => set(k, e.target.checked)} /> {label}
              </label>
            ))}
          </section>

          <div className="admin-card sticky top-20 space-y-3">
            <button disabled={state.saving} className="admin-btn w-full justify-center">
              {state.saving ? <Spinner /> : isEdit ? "Save Changes" : "Create Product"}
            </button>
            <button type="button" className="admin-btn-outline w-full justify-center" onClick={() => router.push("/admin/products")}>Cancel</button>
            {isEdit && (
              <a href={`/product/${initial.slug}`} target="_blank" className="block text-center text-[11px] font-bold uppercase tracking-[0.14em] text-claydark hover:underline">
                View on storefront ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}

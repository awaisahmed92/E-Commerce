import { requireAuth } from "@/lib/auth-helpers";
import { listAllFlat } from "@/services/category.service";
import { getSetting } from "@/services/settings.service";
import ProductForm from "@/components/admin/ProductForm";
import type { MarginType } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  await requireAuth();
  const [categories, defaultMarginType, defaultMarginValue] = await Promise.all([
    listAllFlat(true),
    getSetting("defaultMarginType", "percent"),
    getSetting("defaultMarginValue", "0"),
  ]);
  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl">New Product</h1>
      <ProductForm
        categories={JSON.parse(JSON.stringify(categories))}
        defaultMargin={{ marginType: defaultMarginType as MarginType, marginValue: Number(defaultMarginValue) || 0 }}
      />
    </div>
  );
}

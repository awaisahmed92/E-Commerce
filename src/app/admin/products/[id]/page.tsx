import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth-helpers";
import { listAllFlat } from "@/services/category.service";
import { getSetting } from "@/services/settings.service";
import prisma from "@/lib/db";
import ProductForm from "@/components/admin/ProductForm";
import type { MarginType } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export default async function EditProductPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  await requireAuth();
  const [product, categories, defaultMarginType, defaultMarginValue] = await Promise.all([
    prisma.product.findUnique({ where: { id: params.id }, include: { images: { orderBy: { sortOrder: "asc" } }, variants: true } }),
    listAllFlat(true),
    getSetting("defaultMarginType", "percent"),
    getSetting("defaultMarginValue", "0"),
  ]);
  if (!product) notFound();
  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl">Edit: {product.name}</h1>
      <ProductForm
        categories={JSON.parse(JSON.stringify(categories))}
        initial={JSON.parse(JSON.stringify(product))}
        defaultMargin={{ marginType: defaultMarginType as MarginType, marginValue: Number(defaultMarginValue) || 0 }}
      />
    </div>
  );
}

import { requireAuth } from "@/lib/auth-helpers";
import { listSections } from "@/services/cms.service";
import prisma from "@/lib/db";
import HomepageClient from "@/components/admin/HomepageClient";

export const dynamic = "force-dynamic";

export default async function AdminHomepagePage() {
  await requireAuth();
  const hero = await prisma.homepageSection.findFirst({ where: { type: "HERO" } });
  if (!hero) {
    await prisma.homepageSection.create({
      data: {
        type: "HERO",
        title: "Premium khajoor,\npacked at the source.",
        subtitle: "Aseel and selected dates, hand sorted by variety and grade, then delivered across Pakistan.",
        buttonText: "Shop dates",
        buttonLink: "/shop",
        configJson: JSON.stringify({
          eyebrow: "Khairpur Mirs · Sindh",
          button2Text: "Wholesale inquiry",
          button2Link: "/buyers",
          slides: [],
          heroReady: false,
        }),
        displayOrder: 0,
        isActive: true,
      },
    });
  }

  const [sections, products, categories] = await Promise.all([
    listSections(),
    prisma.product.findMany({ where: { status: "ACTIVE" }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.category.findMany({ where: { isActive: true, parentId: null }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);
  return (
    <HomepageClient
      sections={JSON.parse(JSON.stringify(sections))}
      products={products}
      categories={categories}
    />
  );
}

import type { MetadataRoute } from "next";
import prisma from "@/lib/db";
import { varieties } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const [products, categories] = await Promise.all([
    prisma.product.findMany({ where: { status: "ACTIVE" }, select: { slug: true, updatedAt: true } }),
    prisma.category.findMany({ where: { isActive: true }, select: { slug: true } }),
  ]);
  return [
    { url: base, lastModified: new Date(), priority: 1 },
    { url: `${base}/shop`, lastModified: new Date(), priority: 0.9 },
    { url: `${base}/varieties`, lastModified: new Date(), priority: 0.8 },
    { url: `${base}/quality`, lastModified: new Date(), priority: 0.7 },
    { url: `${base}/house`, lastModified: new Date(), priority: 0.6 },
    { url: `${base}/catalog`, lastModified: new Date(), priority: 0.7 },
    { url: `${base}/buyers`, lastModified: new Date(), priority: 0.7 },
    { url: `${base}/contact`, lastModified: new Date(), priority: 0.5 },
    ...varieties.map((variety) => ({ url: `${base}/varieties/${variety.slug}`, lastModified: new Date(), priority: 0.7 })),
    ...categories.map((c) => ({ url: `${base}/shop?category=${c.slug}`, lastModified: new Date(), priority: 0.7 })),
    ...products.map((p) => ({ url: `${base}/product/${p.slug}`, lastModified: p.updatedAt, priority: 0.8 })),
  ];
}

import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { CatalogGrid } from "@/components/catalog-grid";

export const metadata: Metadata = {
  title: "Catalog",
  description:
    "Whole, pitted, chopped, paste, and powder from Khairpur Dates House. Every pack is quoted per lot.",
};

export default function CatalogPage() {
  return (
    <>
      <PageHero
        kicker="Catalog"
        title="The pack list."
        lede="Whole fruit, pitted fruit, and the forms a factory asks for. There is no shelf price. A lot is quoted for the grade and the season in front of us."
        image="/images/hero-dates.jpg"
        imageAlt="Dates prepared for packing"
      />
      <section className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 lg:py-24">
        <CatalogGrid />
      </section>
    </>
  );
}

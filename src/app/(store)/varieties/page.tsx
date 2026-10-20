import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { PassportCard } from "@/components/passport-card";
import { varieties } from "@/lib/content";

export const metadata: Metadata = {
  title: "Varieties",
  description:
    "Aseel, Begum Jangi, Turbat Mix, Organic Aseel, and dry dates. Each fruit keeps its origin and its grade.",
};

export default function VarietiesPage() {
  return (
    <>
      <PageHero
        kicker="Varieties"
        title="The atlas of the house."
        lede="Five fruits. Aseel is ours by district. The soft dates are named for Turbat, because that is where they grow."
        image="/images/hero-dates.jpg"
        imageAlt="A bowl of dates"
      />
      <section className="mx-auto grid max-w-[1440px] gap-6 px-5 py-16 md:grid-cols-2 md:px-10 lg:py-24 xl:grid-cols-3">
        {varieties.map((variety) => (
          <PassportCard key={variety.slug} variety={variety} href={`/varieties/${variety.slug}`} />
        ))}
      </section>
    </>
  );
}

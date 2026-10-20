import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { grades, lotFields, protocols } from "@/lib/content";

export const metadata: Metadata = {
  title: "Quality",
  description:
    "The Khairpur Dates House standard: hand sort, moisture on the lot card, one grade per carton, and a code you can read later.",
};

export default function QualityPage() {
  return (
    <>
      <PageHero
        kicker="Quality"
        title="A standard you can read."
        lede="Certifications are files, not decorations. Until a certificate can be sent with its scope and its year, this page describes the packing standard we control on every lot."
        image="/images/sorting.jpg"
        imageAlt="Fruit sorted by hand before it is packed"
      />
      <section className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 lg:py-24">
        <h2 className="font-display text-5xl leading-none">The protocol</h2>
        <ul className="mt-10 divide-y divide-night/10 border-y border-night/10">
          {protocols.map((protocol) => (
            <li key={protocol.code} className="grid gap-3 py-6 md:grid-cols-12 md:items-baseline">
              <p className="font-mono text-sm tracking-[0.18em] text-clay md:col-span-2">{protocol.code}</p>
              <h3 className="font-display text-3xl md:col-span-3">{protocol.name}</h3>
              <p className="text-night/75 md:col-span-7">{protocol.record}</p>
            </li>
          ))}
        </ul>
      </section>
      <section className="bg-sand text-night">
        <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 lg:py-24">
          <p className="font-mono text-[11px] tracking-[0.28em] text-leaf uppercase">Grades</p>
          <h2 className="mt-3 max-w-2xl font-display text-5xl leading-[0.92]">Four words. They do not share a carton.</h2>
          <ul className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {grades.map((grade) => (
              <li key={grade.name} className="bg-paper p-6">
                <h3 className="font-display text-4xl">{grade.name}</h3>
                <p className="mt-4 text-sm leading-6 text-night/70">{grade.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="mx-auto grid max-w-[1440px] gap-10 px-5 py-16 md:px-10 lg:grid-cols-2 lg:py-24">
        <div>
          <h2 className="font-display text-5xl leading-[0.92]">What a lot card holds</h2>
          <p className="mt-4 max-w-md text-night/75">
            If a field is missing, the shipment is not ready. The card is the thing a buyer can
            check against the sample six weeks later.
          </p>
        </div>
        <ul className="divide-y divide-night/10 border-y border-night/10">
          {lotFields.map((field, index) => (
            <li key={field} className="flex items-center justify-between py-4">
              <span className="font-display text-3xl">{field}</span>
              <span className="font-mono text-[11px] tracking-[0.16em] text-clay">0{index + 1}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { processSteps } from "@/lib/content";

export const metadata: Metadata = {
  title: "The House",
  description:
    "Khairpur Dates House is a packing house in Khairpur Mirs. The work is the grade, the lot, and the fruit that matches the sample.",
};

export default function HousePage() {
  return (
    <div className="bg-paper">
      <section className="container-x py-8 sm:py-12">
        <div className="grid min-h-[620px] overflow-hidden bg-night lg:grid-cols-[.88fr_1.12fr]">
          <div className="flex flex-col justify-between px-7 py-10 text-paper sm:px-12 sm:py-14 lg:px-16">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-paper/55">Our story · Khairpur Mirs</p>
            <div className="my-16">
              <h1 className="max-w-xl font-display text-5xl leading-[.94] tracking-tight sm:text-7xl">
                Rooted in the date country.
              </h1>
              <p className="mt-7 max-w-md text-base leading-7 text-paper/68">
                We work close to the palms, where Aseel is grown. Every pack begins with a named fruit, a clear grade and the people who sort it.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="/shop" className="btn bg-amber text-white hover:bg-clay">Shop our dates</Link>
                <Link href="/quality" className="btn border border-paper/35 text-paper hover:bg-paper hover:text-night">Our quality standard</Link>
              </div>
            </div>
            <p className="font-display text-xl italic text-paper/55">From Sindh, packed with a record.</p>
          </div>
          <div className="relative min-h-[420px]">
            <Image src="/images/palms.jpg" alt="Date palms in Khairpur" fill priority className="object-cover" sizes="(min-width: 1024px) 55vw, 100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-night/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 grid grid-cols-3 gap-px bg-paper/30 text-center backdrop-blur sm:bottom-10 sm:left-10 sm:right-10">
              {[
                ["Khairpur", "Home district"],
                ["Aseel", "Signature fruit"],
                ["Hand sorted", "Packing standard"],
              ].map(([value, label]) => (
                <div key={value} className="bg-night/75 px-3 py-5 text-paper">
                  <p className="font-display text-xl sm:text-2xl">{value}</p>
                  <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.18em] text-paper/55">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-x grid gap-12 py-16 sm:py-24 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-leaf">Why this house exists</p>
          <h2 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">Good fruit should not lose its name inside a box.</h2>
        </div>
        <div className="space-y-6 text-base leading-8 text-night/68 lg:col-span-6 lg:col-start-7">
          <p>
            Khairpur is one of Pakistan&apos;s great date-growing districts. Our work is to carry that origin forward—through sorting, grading, packing and dispatch—without turning it into an empty claim.
          </p>
          <p>
            Aseel is at the centre of the house: semi-dry, naturally sweet and built to travel. Alongside it, we offer selected soft and dry dates with their true origin stated clearly.
          </p>
          <p className="border-l-2 border-amber pl-6 font-display text-2xl leading-snug text-night">
            The sample and the shipment should tell the same story.
          </p>
        </div>
      </section>

      <section className="bg-sand/65 py-16 sm:py-24">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-clay">Palm to pack</p>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl">Five careful steps.</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-night/60">A simple process, repeated for every lot that leaves the house.</p>
          </div>
          <ol className="mt-10 grid gap-4 md:grid-cols-5">
            {processSteps.map((step, index) => (
              <li key={step.id} className="group relative min-h-[270px] overflow-hidden bg-paper p-6">
                <span className="font-mono text-[10px] tracking-[0.2em] text-clay">{step.id}</span>
                <h3 className="mt-12 font-display text-3xl">{step.title}</h3>
                <p className="mt-4 text-sm leading-6 text-night/60">{step.body}</p>
                <span className="absolute bottom-0 left-0 h-1 w-0 bg-leaf transition-all duration-500 group-hover:w-full" />
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-x py-16 sm:py-24">
        <div className="grid gap-5 lg:grid-cols-12">
          <div className="relative min-h-[420px] overflow-hidden lg:col-span-7">
            <Image src="/images/sorting.jpg" alt="Dates being hand sorted" fill className="object-cover" sizes="(min-width: 1024px) 58vw, 100vw" />
          </div>
          <div className="flex flex-col justify-center bg-leaf px-8 py-12 text-white sm:px-12 lg:col-span-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/55">Visit or buy from the source</p>
            <h2 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">There is a person behind every carton.</h2>
            <p className="mt-5 leading-7 text-white/70">Ask about a retail pack, a bulk order, or the grade that fits your use. We answer plainly.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="btn bg-paper text-night hover:bg-sand">Contact the house</Link>
              <Link href="/buyers" className="btn border border-white/35 text-white hover:bg-white hover:text-leaf">Bulk orders</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

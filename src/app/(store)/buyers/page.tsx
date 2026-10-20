import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ContactForm from "@/components/store/ContactForm";

export const metadata: Metadata = {
  title: "Bulk & Business Orders",
  description: "Bulk Aseel dates, retail cartons, gifting and ingredient packs from Khairpur Dates House.",
};

const programs = [
  { title: "Retail cartons", body: "Whole and pitted dates in repeatable consumer packs.", image: "/images/film-boxes.jpg" },
  { title: "Corporate gifting", body: "Presentation boxes for Ramadan, events and teams.", image: "/images/gift-still.jpg" },
  { title: "Food ingredients", body: "Pitted fruit, chopped dates and paste for production.", image: "/images/film-bowls.jpg" },
];

const steps = [
  ["01", "Share your need", "Product, pack, quantity and destination."],
  ["02", "Confirm the lot", "We confirm grade, availability and pricing."],
  ["03", "Sample or artwork", "Approve the fruit and any private-label packaging."],
  ["04", "Pack and dispatch", "Your confirmed lot is packed and tracked."],
];

export default function BuyersPage() {
  return (
    <div className="bg-paper">
      <section className="container-x py-8 sm:py-12">
        <div className="relative min-h-[570px] overflow-hidden">
          <Image src="/images/shipment.jpg" alt="Date cartons prepared for dispatch" fill priority className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-night/90 via-night/55 to-night/10" />
          <div className="relative flex min-h-[570px] items-center px-7 py-16 sm:px-12 lg:px-16">
            <div className="max-w-2xl text-white">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/60">Bulk & business orders</p>
              <h1 className="mt-5 font-display text-5xl leading-[.94] tracking-tight sm:text-7xl">Dates for your shelf, kitchen or occasion.</h1>
              <p className="mt-7 max-w-xl text-base leading-7 text-white/72">
                Clear grades, practical pack sizes and one point of contact—from sample to dispatch.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <a href="#inquiry" className="btn bg-amber text-white hover:bg-clay">Request pricing</a>
                <Link href="/catalog" className="btn border border-white/40 text-white hover:bg-white hover:text-night">View pack catalog</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-x py-16 sm:py-24">
        <div className="max-w-2xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-leaf">Choose your program</p>
          <h2 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">Built around what you need to sell or make.</h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {programs.map((program) => (
            <article key={program.title} className="group overflow-hidden border border-night/10 bg-white">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src={program.image} alt="" fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(min-width: 768px) 33vw, 100vw" />
              </div>
              <div className="p-6">
                <h3 className="font-display text-3xl">{program.title}</h3>
                <p className="mt-3 text-sm leading-6 text-night/60">{program.body}</p>
                <a href="#inquiry" className="mt-6 inline-block border-b border-clay/40 pb-1 text-xs font-semibold uppercase tracking-[0.15em] text-clay">Discuss this program</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-night py-16 text-paper sm:py-24">
        <div className="container-x">
          <div className="grid gap-10 lg:grid-cols-[.65fr_1.35fr]">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-paper/45">How it works</p>
              <h2 className="mt-4 font-display text-4xl sm:text-5xl">A clear route to dispatch.</h2>
              <p className="mt-5 max-w-sm text-sm leading-7 text-paper/58">No vague promises. Each stage ends with something you can approve.</p>
            </div>
            <ol className="grid gap-px bg-paper/10 sm:grid-cols-2">
              {steps.map(([number, title, body]) => (
                <li key={number} className="bg-night p-6 sm:p-8">
                  <p className="font-mono text-[10px] tracking-[0.2em] text-amber">{number}</p>
                  <h3 className="mt-5 font-display text-3xl">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-paper/58">{body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section id="inquiry" className="container-x py-16 sm:py-24">
        <div className="grid overflow-hidden border border-night/10 bg-white lg:grid-cols-[.72fr_1.28fr]">
          <div className="relative min-h-[420px] bg-sand">
            <Image src="/images/film-close.jpg" alt="Aseel dates ready for packing" fill className="object-cover" sizes="(min-width: 1024px) 40vw, 100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-night/75 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8 text-white sm:p-10">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/60">Useful details</p>
              <p className="mt-3 font-display text-3xl">Product · grade · quantity · destination</p>
            </div>
          </div>
          <div className="p-7 sm:p-10 lg:p-12">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-leaf">Business inquiry</p>
            <h2 className="mt-3 font-display text-4xl">Tell us what you need.</h2>
            <p className="mt-3 mb-8 max-w-xl text-sm leading-6 text-night/58">We will respond with availability, pack options and the next practical step.</p>
            <ContactForm wholesale />
          </div>
        </div>
      </section>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import ContactForm from "@/components/store/ContactForm";
import { IconArrowRight } from "@/components/ui/icons";
import { getAllSettings } from "@/services/settings.service";

export const metadata = { title: "Contact Us" };

export default async function ContactPage() {
  const settings = await getAllSettings();
  return (
    <main>
      <section className="bg-sand/35 px-4 py-5 sm:px-6 sm:py-8">
        <div className="mx-auto grid max-w-[1380px] overflow-hidden rounded-[2rem] bg-night lg:min-h-[590px] lg:grid-cols-[.9fr_1.1fr]">
          <div className="flex flex-col justify-center px-7 py-14 text-paper sm:px-12 lg:px-16 lg:py-20">
            <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-sand">Contact the house</p>
            <h1 className="mt-6 max-w-xl font-display text-5xl leading-[.98] sm:text-6xl lg:text-7xl">
              Let&apos;s talk <span className="italic text-sand">dates.</span>
            </h1>
            <p className="mt-7 max-w-lg text-base leading-8 text-paper/65">
              Product questions, order support or a serious wholesale enquiry—speak directly with the people packing your dates in Khairpur.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="tel:+923163686663" className="inline-flex items-center gap-3 rounded-full bg-clay px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-clay/85">
                Call Farhat
                <IconArrowRight className="h-4 w-4" />
              </a>
              <a
                href="https://wa.me/923163686663"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-paper/25 px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] transition-colors hover:border-paper/60"
              >
                WhatsApp
              </a>
            </div>
          </div>
          <div className="relative min-h-[380px] lg:min-h-full">
            <Image
              src="/images/orchard.jpg"
              alt="Date palms at the Khairpur orchard"
              fill
              priority
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-night/45 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between rounded-2xl border border-white/20 bg-night/55 p-5 text-paper backdrop-blur-md sm:bottom-8 sm:left-8 sm:right-8">
              <div>
                <p className="text-[9px] uppercase tracking-[0.25em] text-paper/55">Our home</p>
                <p className="mt-1 font-display text-2xl">Khairpur Mirs, Sindh</p>
              </div>
              <p className="hidden text-right font-mono text-[9px] uppercase leading-5 tracking-[0.18em] text-paper/60 sm:block">
                Source direct<br />Pack at origin
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-x py-16 sm:py-24">
        <div className="grid overflow-hidden rounded-3xl border border-night/10 bg-paper shadow-[0_24px_70px_rgba(49,31,20,.08)] md:grid-cols-3">
          <div className="border-b border-night/10 p-7 md:border-b-0 md:border-r sm:p-8">
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-clay">Owner &amp; sales</p>
            <h2 className="mt-3 font-display text-3xl">Farhat</h2>
            <a href="tel:+923163686663" className="mt-4 block text-sm text-night/60 hover:text-clay">0316 3686663</a>
          </div>
          <div className="border-b border-night/10 p-7 md:border-b-0 md:border-r sm:p-8">
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-clay">Email us</p>
            <h2 className="mt-3 font-display text-3xl">Customer care</h2>
            <a href={`mailto:${settings.storeEmail}`} className="mt-4 block break-all text-sm text-night/60 hover:text-clay">
              {settings.storeEmail || "hello@khairpurdateshouse.com"}
            </a>
          </div>
          <div className="p-7 sm:p-8">
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-clay">Find us</p>
            <h2 className="mt-3 font-display text-3xl">The date house</h2>
            <p className="mt-4 text-sm leading-6 text-night/60">{settings.storeAddress || "Khairpur Mirs, Sindh, Pakistan"}</p>
          </div>
        </div>
      </section>

      <section className="bg-sand/45">
        <div className="container-x grid gap-12 py-16 sm:py-24 lg:grid-cols-[.75fr_1.25fr] lg:gap-20">
          <div className="lg:py-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-leaf">Send a message</p>
            <h2 className="mt-4 max-w-md font-display text-4xl leading-tight sm:text-5xl">Tell us what you need.</h2>
            <p className="mt-5 max-w-md text-[15px] leading-7 text-night/60">
              For bulk orders, share the variety, grade, pack size, quantity and delivery city. It helps us quote the right lot the first time.
            </p>
            <div className="mt-9 border-l-2 border-clay pl-5">
              <p className="text-sm font-semibold text-night">Already placed an order?</p>
              <Link href="/track-order" className="mt-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-clay">
                Track your order <IconArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="rounded-3xl bg-paper p-6 shadow-[0_24px_70px_rgba(49,31,20,.08)] sm:p-10">
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}

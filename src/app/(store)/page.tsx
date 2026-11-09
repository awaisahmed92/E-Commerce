import Link from "next/link";
import ProductGrid from "@/components/store/ProductGrid";
import NewsletterForm from "@/components/store/NewsletterForm";
import HeroSlider, { type HeroCopy, type HeroSlide } from "@/components/store/HeroSlider";
import { listProducts } from "@/services/product.service";
import prisma from "@/lib/db";
import { varieties } from "@/lib/content";

export const dynamic = "force-dynamic";

const benefits = ["Naturally sweet", "Hand sorted", "Grades kept apart", "From Khairpur"];

const DEFAULT_HERO: HeroCopy = {
  eyebrow: "Khairpur Mirs · Sindh",
  title: "Premium khajoor,\npacked at the source.",
  subtitle: "Aseel and selected dates, hand sorted by variety and grade, then delivered across Pakistan.",
  buttonText: "Shop dates",
  buttonLink: "/shop",
  button2Text: "Wholesale inquiry",
  button2Link: "/buyers",
};

export default async function HomePage() {
  const [featured, bestSellers, heroSection] = await Promise.all([
    listProducts({ isFeatured: true, limit: 8 }),
    listProducts({ bestSelling: true, limit: 4 }),
    prisma.homepageSection.findFirst({ where: { type: "HERO", isActive: true }, orderBy: { displayOrder: "asc" } }),
  ]);

  let saved: Partial<HeroCopy> & { heroReady?: boolean; slides?: Array<Partial<HeroSlide> & { image?: string }> } = {};
  try {
    saved = JSON.parse(heroSection?.configJson || "{}");
  } catch {
    saved = {};
  }
  const copy: HeroCopy = saved.heroReady
    ? {
        eyebrow: saved.eyebrow ?? DEFAULT_HERO.eyebrow,
        title: heroSection?.title || DEFAULT_HERO.title,
        subtitle: heroSection?.subtitle || DEFAULT_HERO.subtitle,
        buttonText: heroSection?.buttonText || DEFAULT_HERO.buttonText,
        buttonLink: heroSection?.buttonLink || DEFAULT_HERO.buttonLink,
        button2Text: saved.button2Text ?? DEFAULT_HERO.button2Text,
        button2Link: saved.button2Link ?? DEFAULT_HERO.button2Link,
      }
    : DEFAULT_HERO;

  const savedSlides: HeroSlide[] = saved.heroReady && Array.isArray(saved.slides)
    ? saved.slides
        .filter((slide) => slide?.image?.trim())
        .map((slide) => ({
          image: slide.image!.trim(),
          title: slide.title,
          subtitle: slide.subtitle,
          buttonText: slide.buttonText,
          buttonLink: slide.buttonLink,
        }))
    : [];

  const slides: HeroSlide[] = savedSlides;

  return (
    <div className="fade-in">
      <HeroSlider slides={slides} copy={copy} />

      <section className="border-b border-night/10 bg-off">
        <ul className="container-x grid grid-cols-2 gap-6 py-8 md:grid-cols-4">
          {benefits.map((benefit) => (
            <li key={benefit} className="text-center text-sm font-medium text-night/75">{benefit}</li>
          ))}
        </ul>
      </section>

      <section className="container-x py-16 sm:py-24">
        <div className="mb-9 flex items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-leaf">The fruit</p>
            <h2 className="mt-2 font-display text-4xl sm:text-5xl">Shop by variety</h2>
          </div>
          <Link href="/varieties" className="hidden border-b border-night/30 pb-1 text-sm sm:block">Explore the atlas</Link>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          {varieties.map((variety) => (
            <Link key={variety.slug} href={`/shop?q=${encodeURIComponent(variety.name)}`} className="group">
              <div className="aspect-[4/5] overflow-hidden bg-sand">
                <img src={variety.image} alt={`${variety.name} dates`} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <p className="mt-3 font-display text-xl">{variety.name}</p>
              <p className="mt-1 text-xs text-mist">{variety.origin}</p>
            </Link>
          ))}
        </div>
      </section>

      {featured.items.length > 0 && (
        <section className="bg-white py-16 sm:py-24">
          <div className="container-x">
            <div className="mb-9 flex items-end justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-leaf">Packed for your table</p>
                <h2 className="mt-2 font-display text-4xl sm:text-5xl">Featured dates</h2>
              </div>
              <Link href="/shop" className="border-b border-night/30 pb-1 text-sm">Shop all</Link>
            </div>
            <ProductGrid products={featured.items} />
          </div>
        </section>
      )}

      <section className="container-x py-16 sm:py-24">
        <div className="grid overflow-hidden bg-sand lg:grid-cols-2">
          <div className="min-h-[360px]">
            <img src="/images/gift-still.jpg" alt="A gift box of Aseel dates" className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-col justify-center p-8 sm:p-14">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-clay">Dates for gifting</p>
            <h2 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">Aseel, packed for the table.</h2>
            <p className="mt-5 max-w-md leading-7 text-night/70">A thoughtful gift from Sindh, prepared in premium packs without hiding the variety or grade.</p>
            <Link href="/shop?category=gift-boxes" className="btn-primary mt-7 w-fit">View gift packs</Link>
          </div>
        </div>
      </section>

      {bestSellers.items.length > 0 && (
        <section className="container-x pb-16 sm:pb-24">
          <h2 className="mb-8 font-display text-4xl">Most ordered</h2>
          <ProductGrid products={bestSellers.items} />
        </section>
      )}

      <section className="bg-leaf py-16 text-white">
        <div className="container-x grid items-center gap-8 md:grid-cols-2">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/65">Importers · retailers · factories</p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl">Buying by the carton?</h2>
            <p className="mt-4 max-w-lg text-white/75">Ask for a sample, a grade, or a private-label quote from a lot we can actually ship.</p>
          </div>
          <div className="md:text-right">
            <Link href="/buyers" className="btn bg-white text-leaf hover:bg-paper">Open the wholesale desk</Link>
          </div>
        </div>
      </section>

      <section className="container-x py-16 text-center sm:py-20">
        <h2 className="font-display text-4xl">Harvest notes and offers</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-night/60">New packs, seasonal availability, and dates from the house.</p>
        <div className="mx-auto mt-7 max-w-md"><NewsletterForm /></div>
      </section>
    </div>
  );
}

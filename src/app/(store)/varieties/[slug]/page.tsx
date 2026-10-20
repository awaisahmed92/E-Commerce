import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getVariety, varieties } from "@/lib/content";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return varieties.map((variety) => ({ slug: variety.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const variety = getVariety(slug);
  if (!variety) return { title: "Variety" };
  return {
    title: variety.name,
    description: variety.summary,
  };
}

export default async function VarietyPage({ params }: Props) {
  const { slug } = await params;
  const variety = getVariety(slug);
  if (!variety) notFound();

  return (
    <article className="bg-paper pt-10 text-night md:pt-14">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-10 md:px-10 lg:grid-cols-12 lg:py-16">
        <div className="lg:col-span-6">
          <p className="font-mono text-[11px] tracking-[0.28em] text-leaf uppercase">{variety.code}</p>
          <h1 className="mt-4 font-display text-[clamp(3.4rem,7vw,6.4rem)] leading-[0.88] tracking-tight">
            {variety.name}
          </h1>
          <p className="mt-4 font-arabic text-3xl text-clay" dir="rtl">{variety.arabic}</p>
          <p className="mt-6 max-w-xl text-lg leading-8 text-night/75">{variety.summary}</p>
        </div>
        <div className="lg:col-span-6">
          <div className="relative h-80 overflow-hidden rounded-[1.25rem] md:h-[460px]">
            <Image
              src={variety.image}
              alt={`${variety.name} dates`}
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
          <p className="mt-4 font-mono text-[10px] tracking-[0.2em] text-mist uppercase">{variety.keep}</p>
          <dl className="mt-4 space-y-4 border-t border-night/10 pt-4 font-mono text-[11px] tracking-[0.12em] uppercase">
            {[
              ["Grade on the card", variety.grade],
              ["Form", variety.form],
              ["Texture", variety.texture],
              ["Origin", variety.origin],
            ].map(([label, value]) => (
              <div key={label} className="flex items-start justify-between gap-6">
                <dt className="text-mist">{label}</dt>
                <dd className="text-right text-night normal-case tracking-normal">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="bg-paper text-night">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-16 md:px-10 lg:grid-cols-12">
          <div className="space-y-6 text-lg leading-8 text-night/80 lg:col-span-7">
            {variety.story.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <Link
              href={`/shop?q=${encodeURIComponent(variety.name)}`}
              className="inline-flex bg-leaf px-5 py-3 font-mono text-[11px] tracking-[0.18em] text-white uppercase"
            >
              Shop this fruit
            </Link>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="font-mono text-[11px] tracking-[0.22em] text-clay uppercase">Grades we separate</p>
            <ul className="mt-5 space-y-5">
              {variety.grades.map((grade) => (
                <li key={grade.name} className="border-t border-night/10 pt-4">
                  <h2 className="font-display text-3xl">{grade.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-night/70">{grade.note}</p>
                </li>
              ))}
            </ul>
            <p className="mt-8 font-mono text-[11px] tracking-[0.22em] text-clay uppercase">Best for</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {variety.uses.map((use) => (
                <li key={use} className="bg-sand px-3 py-2 text-sm">
                  {use}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
}

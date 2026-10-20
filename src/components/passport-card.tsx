import Image from "next/image";
import Link from "next/link";
import type { Variety } from "@/lib/content";

export function PassportCard({
  variety,
  href,
}: {
  variety: Variety;
  href?: string;
}) {
  const body = (
    <article className="flex h-full flex-col overflow-hidden bg-white text-night shadow-[0_16px_40px_rgba(60,36,22,0.08)]">
      <div className="relative aspect-[4/3]">
        <Image
          src={variety.image}
          alt={`${variety.name} dates`}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 30vw, 80vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.18em] text-mist uppercase">
          <span>{variety.origin}</span>
          <span>{variety.code}</span>
        </div>
        <h3 className="mt-3 font-display text-4xl leading-none tracking-tight">{variety.name}</h3>
        <p className="mt-2 font-arabic text-xl text-clay" dir="rtl">
          {variety.arabic}
        </p>
        <p className="mt-3 text-sm leading-6 text-night/75">{variety.summary}</p>
        <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-night/10 pt-4 font-mono text-[11px] tracking-[0.08em] uppercase">
          <div>
            <dt className="text-mist">Grade</dt>
            <dd className="mt-1">{variety.grade}</dd>
          </div>
          <div>
            <dt className="text-mist">Form</dt>
            <dd className="mt-1">{variety.form}</dd>
          </div>
        </dl>
        {href ? (
          <p className="mt-5 font-mono text-[10px] tracking-[0.2em] text-leaf uppercase">See this fruit</p>
        ) : null}
      </div>
    </article>
  );

  if (!href) return body;

  return (
    <Link href={href} className="block h-full transition-transform duration-300 hover:-translate-y-1">
      {body}
    </Link>
  );
}

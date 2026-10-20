import Image from "next/image";

export function PageHero({
  kicker,
  title,
  lede,
  image = "/images/orchard.jpg",
  imageAlt = "Date palms in Khairpur",
}: {
  kicker: string;
  title: string;
  lede: string;
  image?: string;
  imageAlt?: string;
}) {
  return (
    <header className="bg-paper pt-10 text-night md:pt-14">
      <div className="mx-auto grid max-w-[1440px] items-end gap-8 px-5 pb-8 md:px-10 lg:grid-cols-2">
        <div>
          <p className="rise font-mono text-[11px] tracking-[0.28em] text-leaf uppercase">{kicker}</p>
          <h1 className="rise rise-delay-1 mt-4 font-display text-[clamp(3rem,6vw,5.6rem)] leading-[0.9] tracking-tight">
            {title}
          </h1>
          <p className="rise rise-delay-2 mt-6 max-w-xl text-lg leading-8 text-night/75">{lede}</p>
        </div>
        <div className="rise rise-delay-3 relative h-64 overflow-hidden rounded-[1.25rem] md:h-80">
          <Image src={image} alt={imageAlt} fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
        </div>
      </div>
    </header>
  );
}

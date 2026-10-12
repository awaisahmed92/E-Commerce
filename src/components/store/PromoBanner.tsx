import Link from "next/link";

export default function PromoBanner({ banner }: { banner: any }) {
  if (!banner) return null;
  return (
    <div className="relative overflow-hidden bg-sand">
      <img
        src={banner.desktopImage}
        alt={banner.title || ""}
        loading="lazy"
        className="hidden h-[280px] w-full object-cover sm:block"
      />
      <img
        src={banner.mobileImage || banner.desktopImage}
        alt={banner.title || ""}
        loading="lazy"
        className="h-[220px] w-full object-cover sm:hidden"
      />
      {(banner.title || banner.subtitle || banner.buttonText) && (
        <div className="absolute inset-0 flex items-center bg-ink/30">
          <div className="container-x">
            <div className="max-w-lg text-cream">
              {banner.title && <h2 className="font-serif text-3xl font-medium sm:text-4xl">{banner.title}</h2>}
              {banner.subtitle && <p className="mt-2 text-sm text-cream/85">{banner.subtitle}</p>}
              {banner.buttonText && (
                <Link href={banner.linkUrl || "#"} className="btn mt-5 bg-cream text-ink hover:bg-sand">
                  {banner.buttonText}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

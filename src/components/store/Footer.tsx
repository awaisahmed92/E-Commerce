import Link from "next/link";
import NewsletterForm from "./NewsletterForm";
import { IconShield, IconTruck, IconRefresh } from "@/components/ui/icons";
import { BrandLogo } from "@/components/brand-logo";
import { STORE_NAME } from "@/lib/utils";

export default function Footer({ settings }: { settings: Record<string, string> }) {
  const storeName = settings.storeName || STORE_NAME;
  const whatsapp = settings.whatsappNumber?.replace(/[^0-9]/g, "");
  return (
    <footer className="mt-20">
      <div className="border-y border-night/10 bg-sand/55">
        <div className="container-x grid grid-cols-1 gap-6 py-9 sm:grid-cols-3">
          {[
            { icon: <IconTruck className="h-6 w-6" />, t: "Nationwide Delivery", s: "Packed carefully in Khairpur" },
            { icon: <IconShield className="h-6 w-6" />, t: "Grade Kept Apart", s: "Variety and grade named clearly" },
            { icon: <IconRefresh className="h-6 w-6" />, t: "Order Updates", s: "Track every stage of your order" },
          ].map((f) => (
            <div key={f.t} className="flex items-center gap-4">
              <span className="grid h-11 w-11 place-items-center rounded-full border border-clay/20 bg-paper text-clay">{f.icon}</span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.19em]">{f.t}</p>
                <p className="mt-1 text-sm text-night/55">{f.s}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative overflow-hidden bg-night text-paper/80">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border border-paper/5" />
        <div className="pointer-events-none absolute -bottom-48 right-24 h-96 w-96 rounded-full border border-paper/5" />

        <div className="container-x grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.15fr_.8fr_1fr_1.1fr]">
          <div>
            <BrandLogo light />
            <p className="mt-6 max-w-sm text-sm leading-7 text-paper/60">
              Premium Aseel and selected dates, sorted by hand and packed at the source in Khairpur Mirs, Sindh.
            </p>
            <p className="mt-6 font-mono text-[9px] uppercase tracking-[0.24em] text-paper/40">
              Variety · Grade · Origin · Pack
            </p>
            {(settings.facebookUrl || settings.instagramUrl || settings.whatsappNumber) && (
              <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.13em]">
                {settings.facebookUrl && (
                  <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="border border-paper/20 px-3 py-2 hover:border-paper/60">
                    Facebook
                  </a>
                )}
                {settings.instagramUrl && (
                  <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="border border-paper/20 px-3 py-2 hover:border-paper/60">
                    Instagram
                  </a>
                )}
                {whatsapp && (
                  <a
                    href={`https://wa.me/${whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-paper/20 px-3 py-2 hover:border-paper/60"
                  >
                    WhatsApp
                  </a>
                )}
              </div>
            )}
          </div>

          <div>
            <h2 className="font-display text-2xl text-paper">Quick links</h2>
            <ul className="mt-6 space-y-3 text-sm text-paper/65">
              <li><Link href="/shop" className="hover:text-paper">Shop all dates</Link></li>
              <li><Link href="/house" className="hover:text-paper">Our story</Link></li>
              <li><Link href="/quality" className="hover:text-paper">Quality & grades</Link></li>
              <li><Link href="/buyers" className="hover:text-paper">Bulk orders</Link></li>
              <li><Link href="/contact" className="hover:text-paper">Contact us</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl text-paper">Customer care</h2>
            <ul className="mt-6 space-y-3 text-sm text-paper/65">
              <li><Link href="/track-order" className="hover:text-paper">Track your order</Link></li>
              <li><Link href="/account/orders" className="hover:text-paper">Order history</Link></li>
              <li><Link href="/account/addresses" className="hover:text-paper">Address book</Link></li>
              <li><Link href="/wishlist" className="hover:text-paper">Wishlist</Link></li>
              <li><Link href="/login" className="hover:text-paper">Login / register</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl text-paper">Contact the house</h2>
            <div className="mt-6 space-y-4 text-sm leading-6 text-paper/65">
              <p>{settings.storeAddress || "Khairpur Mirs, Sindh, Pakistan"}</p>
              {settings.storeEmail && <a href={`mailto:${settings.storeEmail}`} className="block hover:text-paper">{settings.storeEmail}</a>}
              {settings.storePhone && <a href={`tel:${settings.storePhone}`} className="block hover:text-paper">{settings.storePhone}</a>}
            </div>
            <div className="mt-7">
              <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.22em] text-paper/45">Harvest notes & offers</p>
              <NewsletterForm dark />
            </div>
          </div>
        </div>

        <div className="border-t border-paper/10 py-5">
          <div className="container-x flex flex-col items-center justify-between gap-3 text-center text-[10px] uppercase tracking-[0.18em] text-paper/35 lg:flex-row">
            <p>© {new Date().getFullYear()} {storeName}. All rights reserved.</p>
            <p className="normal-case tracking-[0.12em]">
              Designed &amp; developed by <span className="text-paper/55">Makhdoom Awais Ahmed</span>
              <span className="mx-2 text-paper/20">|</span>
              <a href="tel:+923133165018" className="transition-colors hover:text-paper">Contact 0313 3165018</a>
            </p>
            <p>Grown in Sindh · Packed in Khairpur</p>
          </div>
        </div>

        {whatsapp && (
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-leaf text-white shadow-xl transition-transform hover:scale-105"
          >
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4A8 8 0 1 1 20 11.5Z" />
              <path d="M9 8.5c.5 3 2 4.5 5 5" strokeLinecap="round" />
            </svg>
          </a>
        )}
      </div>
    </footer>
  );
}

import type { Metadata, Viewport } from "next";
import { Amiri, Fraunces, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import { getAllSettings } from "@/services/settings.service";
import { STORE_NAME } from "@/lib/utils";

const sans = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });
const display = Fraunces({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const arabic = Amiri({ subsets: ["arabic", "latin"], weight: ["400", "700"], variable: "--font-arabic", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getAllSettings();
  const storeName = settings.storeName || STORE_NAME;
  return {
    title: {
      default: `${storeName} — Premium Dates from Khairpur`,
      template: `%s — ${storeName}`,
    },
    description:
      "Khairpur Dates House packs premium Aseel and selected dates from Sindh and Balochistan, delivered across Pakistan.",
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    openGraph: {
      siteName: storeName,
      type: "website",
      locale: "en_PK",
      images: ["/images/hero-dates.jpg"],
    },
  };
}

export const viewport: Viewport = { themeColor: "#3c2416", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${display.variable} ${arabic.variable}`}>
      <body className="min-h-screen bg-paper font-sans text-night antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

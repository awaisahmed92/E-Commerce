import type { ReactNode } from "react";

const iconClass = "h-4 w-4";

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} aria-hidden="true" fill="currentColor">
      <path d="M14.5 8.5V6.8c0-.7.5-1 1.2-1H17V3h-2.1C12.2 3 11 4.4 11 6.6v1.9H9v2.8h2V21h3.5v-9.7h2.3l.4-2.8h-2.7Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} aria-hidden="true" fill="currentColor">
      <path d="M6.7 9.3H4V20h2.7V9.3ZM5.3 4A1.6 1.6 0 1 0 5.3 7.2 1.6 1.6 0 0 0 5.3 4ZM20 20h-2.7v-5.5c0-1.6-.6-2.6-2-2.6-1 0-1.6.7-1.9 1.4-.1.2-.1.6-.1.9V20H10.6V9.3h2.6v1.5c.4-.7 1.3-1.8 3.2-1.8 2.3 0 4 1.5 4 4.8V20Z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4A8 8 0 1 1 20 11.5Z" />
      <path d="M9 8.5c.5 3 2 4.5 5 5" strokeLinecap="round" />
    </svg>
  );
}

export function SocialLinks({
  facebookUrl,
  instagramUrl,
  linkedinUrl,
  whatsappNumber,
  tone = "dark",
  className = "",
}: {
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  whatsappNumber?: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const whatsapp = whatsappNumber?.replace(/[^0-9]/g, "");
  const links: { href: string; label: string; icon: ReactNode }[] = [];
  if (facebookUrl) links.push({ href: facebookUrl, label: "Facebook", icon: <FacebookIcon /> });
  if (instagramUrl) links.push({ href: instagramUrl, label: "Instagram", icon: <InstagramIcon /> });
  if (linkedinUrl) links.push({ href: linkedinUrl, label: "LinkedIn", icon: <LinkedInIcon /> });
  if (whatsapp) links.push({ href: `https://wa.me/${whatsapp}`, label: "WhatsApp", icon: <WhatsAppIcon /> });

  if (!links.length) return null;

  const button = tone === "light"
    ? "border-paper/25 text-paper hover:border-paper hover:bg-paper hover:text-brand"
    : "border-night/15 text-night hover:border-brand hover:bg-brand hover:text-paper";

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          title={link.label}
          className={`grid h-9 w-9 place-items-center border transition-colors ${button}`}
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
}

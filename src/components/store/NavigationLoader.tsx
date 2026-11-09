"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";

export default function NavigationLoader({ logoUrl }: { logoUrl?: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target as Element | null;
      const anchor = target?.closest("a");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || url.href === window.location.href || url.hash) return;
      setLoading(true);
    };
    // Back/forward restores a page that is already open. Treating that as a
    // new visit leaves this overlay up, because the route often does not
    // change again after the browser has moved.
    const onPopState = () => setLoading(false);
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) setLoading(false);
    };
    document.addEventListener("click", onClick);
    window.addEventListener("popstate", onPopState);
    window.addEventListener("pageshow", onPageShow);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-paper/92 backdrop-blur-sm" role="status" aria-live="polite">
      <div className="flex flex-col items-center">
        <span className="loader-pulse"><BrandLogo compact logoUrl={logoUrl} /></span>
        <span className="mt-5 font-mono text-[10px] uppercase tracking-[0.28em] text-mist">Opening the house</span>
        <span className="mt-4 h-px w-32 overflow-hidden bg-line">
          <span className="loader-line block h-full w-1/2 bg-leaf" />
        </span>
      </div>
    </div>
  );
}

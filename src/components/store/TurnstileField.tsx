"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      getResponse: (id?: string) => string | undefined;
      remove: (id: string) => void;
    };
  }
}

export type TurnstileHandle = {
  getToken: () => string;
  reset: () => void;
};

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || "";

export function turnstileEnabled() {
  return Boolean(SITE_KEY);
}

const TurnstileField = forwardRef<TurnstileHandle>(function TurnstileField(_, ref) {
  const host = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  useImperativeHandle(ref, () => ({
    getToken: () => {
      if (!widgetId.current || !window.turnstile) return "";
      return window.turnstile.getResponse(widgetId.current) || "";
    },
    reset: () => {
      if (widgetId.current) window.turnstile?.reset(widgetId.current);
    },
  }));

  useEffect(() => {
    if (!SITE_KEY || !host.current) return;
    let cancelled = false;

    const render = () => {
      if (cancelled || !host.current || !window.turnstile || widgetId.current) return;
      widgetId.current = window.turnstile.render(host.current, { sitekey: SITE_KEY });
    };

    if (window.turnstile) {
      render();
    } else {
      const existing = document.querySelector<HTMLScriptElement>("script[data-turnstile]");
      if (existing) existing.addEventListener("load", render);
      else {
        const script = document.createElement("script");
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script.dataset.turnstile = "1";
        script.onload = render;
        document.head.appendChild(script);
      }
    }

    return () => {
      cancelled = true;
      if (widgetId.current && window.turnstile) {
        window.turnstile.remove(widgetId.current);
        widgetId.current = null;
      }
    };
  }, []);

  if (!SITE_KEY) return null;
  return <div ref={host} className="mt-5" />;
});

export default TurnstileField;

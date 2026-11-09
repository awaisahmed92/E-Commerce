"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export type HeroCopy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  button2Text: string;
  button2Link: string;
};

export type HeroSlide = {
  image: string;
  mobileImage?: string | null;
  eyebrow?: string | null;
  title?: string | null;
  subtitle?: string | null;
  buttonText?: string | null;
  buttonLink?: string | null;
};

function filled(value?: string | null) {
  return value?.trim() ? value : "";
}

export default function HeroSlider({ slides, copy }: { slides: HeroSlide[]; copy: HeroCopy }) {
  const [index, setIndex] = useState(0);
  const count = slides.length;

  useEffect(() => {
    if (count < 2) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % count), 6000);
    return () => window.clearInterval(timer);
  }, [count]);

  const slide = slides[index];
  const eyebrow = filled(slide?.eyebrow) || copy.eyebrow;
  const title = filled(slide?.title) || copy.title;
  const subtitle = filled(slide?.subtitle) || copy.subtitle;
  const buttonText = filled(slide?.buttonText) || copy.buttonText;
  const buttonLink = filled(slide?.buttonLink) || copy.buttonLink;

  return (
    <section className="relative min-h-[560px] overflow-hidden bg-brand text-white sm:min-h-[680px]">
      {count === 0 ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="/images/film-boxes.jpg"
          aria-hidden="true"
        >
          <source src="/video/khajoor.mp4" type="video/mp4" />
        </video>
      ) : (
        slides.map((item, itemIndex) => (
          <picture key={`${item.image}-${itemIndex}`} className={`absolute inset-0 transition-opacity duration-700 ${itemIndex === index ? "opacity-100" : "opacity-0"}`}>
            {item.mobileImage ? <source media="(max-width: 639px)" srcSet={item.mobileImage} /> : null}
            <img src={item.image} alt="" className="h-full w-full object-cover" />
          </picture>
        ))
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
      <div className="container-x relative flex min-h-[560px] items-center sm:min-h-[680px]">
        <div className="max-w-2xl py-20">
          {eyebrow ? <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-white/75">{eyebrow}</p> : null}
          <h1 className="mt-5 whitespace-pre-line font-display text-5xl leading-[0.95] tracking-tight sm:text-7xl">{title}</h1>
          {subtitle ? <p className="mt-6 max-w-lg text-base leading-7 text-white/80">{subtitle}</p> : null}
          <div className="mt-9 flex flex-wrap gap-3">
            {buttonText ? <Link href={buttonLink || "/shop"} className="btn bg-amber text-white hover:bg-clay">{buttonText}</Link> : null}
            {copy.button2Text ? (
              <Link href={copy.button2Link || "/buyers"} className="btn border border-white/60 text-white hover:bg-white hover:text-night">
                {copy.button2Text}
              </Link>
            ) : null}
          </div>
          {count > 1 ? (
            <div className="mt-8 flex gap-2">
              {slides.map((item, itemIndex) => (
                <button
                  key={`${item.image}-dot-${itemIndex}`}
                  type="button"
                  aria-label={`Show slide ${itemIndex + 1}`}
                  onClick={() => setIndex(itemIndex)}
                  className={`h-2.5 w-2.5 rounded-full ${itemIndex === index ? "bg-white" : "bg-white/40"}`}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

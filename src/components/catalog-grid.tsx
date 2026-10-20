"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getVariety, productCategories, products, type ProductCategory } from "@/lib/content";

export function CatalogGrid() {
  const [category, setCategory] = useState<ProductCategory | "All">("All");
  const visible = useMemo(
    () => (category === "All" ? products : products.filter((product) => product.category === category)),
    [category],
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Pack filter">
        {productCategories.map((item) => {
          const active = item === category;
          return (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setCategory(item)}
              className={`px-4 py-2 font-mono text-[11px] tracking-[0.16em] uppercase ${
                active ? "bg-leaf text-white" : "bg-sand text-night hover:bg-leaf/10"
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>

      <ul className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((product) => {
          const variety = getVariety(product.varietySlug);
          const photo =
            product.category === "Processed" ? "/images/sorting.jpg" : (variety?.image ?? "/images/aseel.jpg");
          return (
            <li key={product.slug} className="flex flex-col overflow-hidden bg-white shadow-[0_12px_30px_rgba(60,36,22,0.06)]">
              <div className="relative aspect-[4/3]">
                <Image src={photo} alt="" fill className="object-cover" sizes="(min-width: 1280px) 30vw, 100vw" />
                <p className="absolute top-3 right-3 bg-paper/95 px-2 py-1 font-mono text-[10px] tracking-[0.16em] text-leaf uppercase">
                  {product.category}
                </p>
              </div>
              <div className="flex flex-1 flex-col px-5 py-5">
                <h2 className="font-display text-3xl leading-none">{product.name}</h2>
                <p className="mt-3 text-sm leading-6 text-night/75">{product.note}</p>
                <dl className="mt-5 grid grid-cols-2 gap-3 font-mono text-[10px] tracking-[0.12em] uppercase">
                  <div>
                    <dt className="text-mist">Grade</dt>
                    <dd className="mt-1 text-night">{product.grade}</dd>
                  </div>
                  <div>
                    <dt className="text-mist">Pack</dt>
                    <dd className="mt-1 text-night normal-case tracking-normal">{product.pack}</dd>
                  </div>
                </dl>
                <p className="mt-4 text-sm text-night/70">{product.bestFor}</p>
                <Link
                  href={`/contact?intent=quote&variety=${product.varietySlug}`}
                  className="mt-6 font-mono text-[10px] tracking-[0.2em] text-clay uppercase"
                >
                  Ask for this pack
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

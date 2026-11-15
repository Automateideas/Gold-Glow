"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Droplets } from "lucide-react";
import type { Product } from "@/lib/products";
import { BLOB_PATH_PHOTO, BLOB_PATH_RING } from "@/lib/blob";
import { cn } from "@/lib/utils";

/**
 * The hero product visual: each product sits inside a soft "liquid drop" with a
 * halo in that product's own colour. Only the halo changes shape (cheap to paint);
 * the photo keeps a fixed drop-shaped mask. HeroStage drives the slide state.
 */
export function HeroCarousel({
  products,
  index,
  onSelect,
  onPause,
  ringRef,
}: {
  products: Product[];
  index: number;
  onSelect: (i: number) => void;
  onPause: (paused: boolean) => void;
  ringRef: React.RefObject<SVGPathElement | null>;
}) {
  const count = products.length;
  const go = (to: number) => onSelect(((to % count) + count) % count);
  if (count === 0) return null;
  const current = products[Math.min(index, count - 1)];

  return (
    <div
      className="relative"
      data-ripple-source
      onMouseEnter={() => onPause(true)}
      onMouseLeave={() => onPause(false)}
      onFocusCapture={() => onPause(true)}
      onBlurCapture={() => onPause(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured products"
    >
      <div className="relative mx-auto aspect-square w-full max-w-md">
        {/* Mask for the photo (objectBoundingBox = the shape scales with the box). */}
        <svg width="0" height="0" className="absolute" aria-hidden focusable="false">
          <defs>
            <clipPath id="gg-blob-clip" clipPathUnits="objectBoundingBox">
              <path d={BLOB_PATH_PHOTO} />
            </clipPath>
          </defs>
        </svg>

        {/* Soft coloured glow (static, so the browser paints it once) */}
        <div
          aria-hidden
          className="absolute inset-[10%] rounded-full blur-3xl transition-colors duration-[900ms]"
          style={{ backgroundColor: "hsl(var(--tint) / 0.35)" }}
        />

        {/* Tinted halo: a second, offset blob in the product's colour */}
        <svg
          viewBox="0 0 1 1"
          className="absolute inset-0 h-full w-full overflow-visible"
          aria-hidden
          focusable="false"
        >
          <defs>
            <linearGradient id="gg-ring" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" style={{ stopColor: "hsl(var(--tint))" }} />
              <stop offset="1" style={{ stopColor: "hsl(var(--tint) / 0.55)" }} />
            </linearGradient>
          </defs>
          <path ref={ringRef} d={BLOB_PATH_RING} fill="url(#gg-ring)" />
        </svg>

        {/* The product photo, cut into the drop shape */}
        <div className="absolute inset-[7%] bg-white" style={{ clipPath: "url(#gg-blob-clip)" }}>
          {products.map((p, i) => (
            <Link
              key={p.id}
              href={`/product/${p.slug}`}
              aria-hidden={i !== index}
              tabIndex={i === index ? 0 : -1}
              aria-label={`${p.name} — view product`}
              className={cn(
                "absolute inset-0 transition-all duration-700 ease-out",
                i === index ? "scale-100 opacity-100" : "pointer-events-none scale-110 opacity-0",
              )}
            >
              <Image
                src={p.images[0]}
                alt={`Gold & Glow ${p.name}`}
                fill
                loading="eager"
                fetchPriority={i === 0 ? "high" : undefined}
                sizes="(max-width: 1024px) 90vw, 40vw"
                className="object-contain p-10"
              />
            </Link>
          ))}
        </div>

        {/* Floating cards follow the visible product */}
        <div className="pointer-events-none absolute -left-3 top-10 rounded-2xl bg-background/95 p-3 shadow-lg sm:-left-6">
          <div key={current.id} className="flex animate-fade-up items-center gap-2">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10">
              <Droplets className="h-4 w-4 text-primary" />
            </div>
            <div className="max-w-[9.5rem]">
              <p className="truncate text-xs font-semibold">{current.category}</p>
              <p className="truncate text-[0.65rem] text-muted-foreground">{current.tagline}</p>
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-2 bottom-12 rounded-2xl bg-background/95 p-3 shadow-lg sm:-right-6">
          <div key={current.id} className="animate-fade-up">
            {current.bestSeller ? (
              <>
                <p className="text-xs font-semibold text-primary">★ Bestseller</p>
                <p className="text-[0.65rem] text-muted-foreground">Loved by 2k+</p>
              </>
            ) : (
              <>
                <p className="text-xs font-semibold text-primary">★ {current.rating.toFixed(1)} rated</p>
                <p className="text-[0.65rem] text-muted-foreground">
                  {current.reviews.toLocaleString("en-IN")}+ reviews
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {count > 1 && (
        <div className="mx-auto mt-6 flex max-w-md items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous product"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border bg-background transition-colors hover:bg-accent"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex min-w-0 flex-col items-center gap-2">
            <p className="max-w-full truncate text-sm font-medium" aria-live="polite">
              {current.name}
            </p>
            <div className="flex items-center gap-1.5">
              {products.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Show ${p.name}`}
                  aria-current={i === index}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === index ? "w-6 bg-primary" : "w-1.5 bg-primary/25 hover:bg-primary/50",
                  )}
                />
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next product"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border bg-background transition-colors hover:bg-accent"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

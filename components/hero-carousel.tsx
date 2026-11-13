"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Droplets } from "lucide-react";
import type { Product } from "@/lib/products";
import { cn } from "@/lib/utils";

const INTERVAL_MS = 5000;

/**
 * Homepage hero visual: the same gradient frame as before, but it slides through
 * a few products. Which products appear is controlled from the admin panel
 * ("Home carousel" toggle on each product).
 */
export function HeroCarousel({ products }: { products: Product[] }) {
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const count = products.length;

  const go = React.useCallback(
    (to: number) => setIndex(((to % count) + count) % count),
    [count]
  );

  React.useEffect(() => {
    if (count < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL_MS);
    return () => clearInterval(t);
  }, [count, paused]);

  if (count === 0) return null;
  const current = products[Math.min(index, count - 1)];

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured products"
    >
      <div className="relative mx-auto aspect-square w-full max-w-md">
        <div className="absolute inset-0 rounded-[2.5rem] brand-gradient opacity-90" />
        <div className="absolute inset-3 rounded-[2rem] bg-background/10 backdrop-blur-sm" />

        {products.map((p, i) => (
          <Link
            key={p.id}
            href={`/product/${p.slug}`}
            aria-hidden={i !== index}
            tabIndex={i === index ? 0 : -1}
            aria-label={`${p.name} — view product`}
            className={cn(
              "absolute inset-0 transition-all duration-700 ease-out",
              i === index ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
            )}
          >
            <Image
              src={p.images[0]}
              alt={`Gold & Glow ${p.name}`}
              fill
              priority={i === 0}
              loading={i === 0 ? undefined : "eager"}
              sizes="(max-width: 1024px) 90vw, 40vw"
              className="object-contain p-8 drop-shadow-2xl"
            />
          </Link>
        ))}

        {/* Floating cards — follow the visible product */}
        <div className="pointer-events-none absolute -left-3 top-10 rounded-2xl bg-background/95 p-3 shadow-lg backdrop-blur sm:-left-6">
          <div key={current.id} className="flex animate-fade-up items-center gap-2">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10">
              <Droplets className="h-4 w-4 text-primary" />
            </div>
            <div className="max-w-[9.5rem]">
              <p className="truncate text-xs font-semibold">{current.category}</p>
              <p className="truncate text-[0.65rem] text-muted-foreground">
                {current.tagline}
              </p>
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-2 bottom-12 rounded-2xl bg-background/95 p-3 shadow-lg backdrop-blur sm:-right-6">
          <div key={current.id} className="animate-fade-up">
            {current.bestSeller ? (
              <>
                <p className="text-xs font-semibold text-primary">★ Bestseller</p>
                <p className="text-[0.65rem] text-muted-foreground">Loved by 2k+</p>
              </>
            ) : (
              <>
                <p className="text-xs font-semibold text-primary">
                  ★ {current.rating.toFixed(1)} rated
                </p>
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
                    i === index ? "w-6 bg-primary" : "w-1.5 bg-primary/25 hover:bg-primary/50"
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

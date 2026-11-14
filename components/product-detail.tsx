"use client";

import * as React from "react";
import Image from "next/image";
import { Check, Truck, Store, ShieldCheck } from "lucide-react";
import { type Product } from "@/lib/products";
import { formatINR, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/star-rating";
import { MarketplaceButtons } from "@/components/marketplace-buttons";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export function ProductDetail({ product }: { product: Product }) {
  const [active, setActive] = React.useState(0);

  const off =
    product.compareAt && product.compareAt > product.price
      ? Math.round((1 - product.price / product.compareAt) * 100)
      : 0;

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      {/* Gallery */}
      <div className="flex flex-col-reverse gap-4 sm:flex-row">
        {product.images.length > 1 && (
          <div className="flex gap-3 sm:flex-col">
            {product.images.map((img, i) => (
              <button
                key={img}
                onClick={() => setActive(i)}
                className={cn(
                  "relative h-20 w-20 overflow-hidden rounded-xl border bg-secondary/40 transition-all",
                  active === i
                    ? "border-primary ring-2 ring-primary/30"
                    : "hover:border-primary/40"
                )}
                aria-label={`View image ${i + 1}`}
              >
                <Image
                  src={img}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-contain p-1.5"
                />
              </button>
            ))}
          </div>
        )}
        <div
          className="relative aspect-square flex-1 overflow-hidden rounded-3xl border"
          style={{
            background: `radial-gradient(120% 120% at 50% 0%, hsl(${product.shade} / 0.16), transparent 70%)`,
          }}
        >
          <Image
            src={product.images[active]}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-contain p-8"
          />
          {off > 0 && (
            <Badge className="absolute left-4 top-4">{off}% off</Badge>
          )}
        </div>
      </div>

      {/* Info */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            {product.category}
          </span>
          {product.bestSeller && <Badge variant="soft">Bestseller</Badge>}
          {product.new && <Badge variant="gold">New</Badge>}
        </div>
        <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          {product.name}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{product.tagline}</p>

        <div className="mt-3 flex items-center gap-2">
          <StarRating rating={product.rating} size={16} />
          <span className="text-sm font-medium">{product.rating}</span>
          <span className="text-sm text-muted-foreground">
            · {product.reviews} reviews
          </span>
        </div>

        <div className="mt-5 flex items-end gap-3">
          <span className="text-3xl font-bold">{formatINR(product.price)}</span>
          {product.compareAt && (
            <span className="pb-1 text-base text-muted-foreground line-through">
              {formatINR(product.compareAt)}
            </span>
          )}
          {off > 0 && (
            <span className="pb-1 text-sm font-semibold text-emerald-600">
              Save {off}%
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {product.size} · Indicative MRP — final price on the marketplace
        </p>

        <p className="mt-5 text-sm leading-relaxed text-foreground/90">
          {product.short}
        </p>

        {/* Benefits */}
        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {product.benefits.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        {/* Where to buy */}
        <div className="mt-7">
          <p className="mb-3 text-sm font-semibold">
            Where to buy
            <span className="ml-2 font-normal text-muted-foreground">
              — shop from your favourite app
            </span>
          </p>
          <MarketplaceButtons product={product} />
        </div>

        {/* Trust badges */}
        <div className="mt-6 grid grid-cols-3 gap-2 rounded-2xl border bg-secondary/30 p-4 text-center">
          {[
            { icon: ShieldCheck, label: "100% Authentic" },
            { icon: Store, label: "Trusted Sellers" },
            { icon: Truck, label: "Pan-India Delivery" },
          ].map((t) => (
            <div key={t.label} className="flex flex-col items-center gap-1.5">
              <t.icon className="h-5 w-5 text-primary" />
              <span className="text-[0.7rem] font-medium text-muted-foreground">
                {t.label}
              </span>
            </div>
          ))}
        </div>

        {/* Accordions */}
        <Accordion type="single" collapsible className="mt-6" defaultValue="desc">
          <AccordionItem value="desc">
            <AccordionTrigger>Description</AccordionTrigger>
            <AccordionContent forceMount>{product.description}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="ingredients">
            <AccordionTrigger>Key ingredients</AccordionTrigger>
            <AccordionContent forceMount>
              <div className="flex flex-wrap gap-2">
                {product.keyIngredients.map((i) => (
                  <span
                    key={i}
                    className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                  >
                    {i}
                  </span>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="how">
            <AccordionTrigger>How to use</AccordionTrigger>
            <AccordionContent forceMount>{product.howToUse}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="suit">
            <AccordionTrigger>Suitable for</AccordionTrigger>
            <AccordionContent forceMount>{product.skinType}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

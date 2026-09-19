"use client";

import * as React from "react";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, Check, Truck, RefreshCw, ShieldCheck, Heart } from "lucide-react";
import { toast } from "sonner";
import { type Product } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import { formatINR, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/star-rating";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export function ProductDetail({ product }: { product: Product }) {
  const { add, setOpen } = useCart();
  const [active, setActive] = React.useState(0);
  const [qty, setQty] = React.useState(1);

  const off =
    product.compareAt && product.compareAt > product.price
      ? Math.round((1 - product.price / product.compareAt) * 100)
      : 0;

  function handleAdd(buyNow = false) {
    add(product.id, qty);
    if (buyNow) {
      setOpen(true);
    } else {
      toast.success(`${product.name} added to bag`, {
        description: `Qty ${qty} · ${formatINR(product.price * qty)}`,
        action: { label: "View bag", onClick: () => setOpen(true) },
      });
    }
  }

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

      {/* Buy box */}
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
          {product.size} · Inclusive of all taxes
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

        {/* Qty + actions */}
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-full border">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="grid h-11 w-11 place-items-center rounded-l-full transition-colors hover:bg-accent"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-10 text-center font-medium">{qty}</span>
            <button
              onClick={() => setQty((q) => Math.min(99, q + 1))}
              className="grid h-11 w-11 place-items-center rounded-r-full transition-colors hover:bg-accent"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <Button size="lg" className="flex-1" onClick={() => handleAdd(false)}>
            <ShoppingBag className="h-4 w-4" /> Add to bag
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="h-12 w-12"
            aria-label="Add to wishlist"
          >
            <Heart className="h-5 w-5" />
          </Button>
        </div>
        <Button
          size="lg"
          variant="gold"
          className="mt-3 w-full"
          onClick={() => handleAdd(true)}
        >
          Buy it now
        </Button>

        {/* Trust badges */}
        <div className="mt-6 grid grid-cols-3 gap-2 rounded-2xl border bg-secondary/30 p-4 text-center">
          {[
            { icon: Truck, label: "Free ship ₹599+" },
            { icon: RefreshCw, label: "Easy returns" },
            { icon: ShieldCheck, label: "100% authentic" },
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
            <AccordionContent>{product.description}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="ingredients">
            <AccordionTrigger>Key ingredients</AccordionTrigger>
            <AccordionContent>
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
            <AccordionContent>{product.howToUse}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="suit">
            <AccordionTrigger>Suitable for</AccordionTrigger>
            <AccordionContent>{product.skinType}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

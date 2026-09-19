"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function CartPage() {
  const { detailed, subtotal, savings, setQty, remove, count } = useCart();
  const shipping = subtotal >= 599 || subtotal === 0 ? 0 : 49;
  const total = subtotal + shipping;

  return (
    <div className="container py-10 sm:py-14">
      <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
        Your Bag
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {count} {count === 1 ? "item" : "items"} in your bag
      </p>

      {detailed.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <div className="grid h-24 w-24 place-items-center rounded-full bg-secondary">
            <ShoppingBag className="h-10 w-10 text-primary" />
          </div>
          <div>
            <p className="text-lg font-semibold">Your bag is empty</p>
            <p className="text-sm text-muted-foreground">
              Discover products made to make you glow.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/shop">Start shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          {/* Items */}
          <div className="space-y-4">
            {detailed.map(({ product, qty, lineTotal }) => (
              <Card key={product.id} className="flex gap-4 p-4">
                <Link
                  href={`/product/${product.slug}`}
                  className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl border bg-secondary/40"
                >
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="112px"
                    className="object-contain p-2"
                  />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                        {product.category}
                      </p>
                      <Link
                        href={`/product/${product.slug}`}
                        className="font-medium leading-snug hover:text-primary"
                      >
                        {product.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">{product.size}</p>
                    </div>
                    <button
                      onClick={() => remove(product.id)}
                      className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      aria-label={`Remove ${product.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center rounded-full border">
                      <button
                        onClick={() => setQty(product.id, qty - 1)}
                        className="grid h-9 w-9 place-items-center rounded-l-full hover:bg-accent"
                        aria-label="Decrease"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-9 text-center text-sm font-medium">{qty}</span>
                      <button
                        onClick={() => setQty(product.id, qty + 1)}
                        className="grid h-9 w-9 place-items-center rounded-r-full hover:bg-accent"
                        aria-label="Increase"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatINR(lineTotal)}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatINR(product.price)} each
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            <Button variant="ghost" asChild>
              <Link href="/shop">
                <ArrowLeft className="h-4 w-4" /> Continue shopping
              </Link>
            </Button>
          </div>

          {/* Summary */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Card className="p-6">
              <h2 className="text-lg font-semibold">Order summary</h2>
              <Separator className="my-4" />
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatINR(subtotal)}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Savings</span>
                    <span className="font-medium">-{formatINR(savings)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? "Free" : formatINR(shipping)}
                  </span>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold">{formatINR(total)}</span>
              </div>
              <Button size="lg" className="mt-5 w-full" asChild>
                <Link href="/checkout">
                  Proceed to checkout <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Secure checkout · GLOW20 for 20% off first order
              </p>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

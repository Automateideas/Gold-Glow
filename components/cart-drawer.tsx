"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

const FREE_SHIP_THRESHOLD = 599;

export function CartDrawer() {
  const { isOpen, setOpen, detailed, subtotal, savings, setQty, remove, count } =
    useCart();

  const remaining = Math.max(0, FREE_SHIP_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIP_THRESHOLD) * 100);

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-xl">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Your Bag
            <span className="text-sm font-normal text-muted-foreground">
              ({count} {count === 1 ? "item" : "items"})
            </span>
          </SheetTitle>
        </SheetHeader>

        {detailed.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-secondary">
              <ShoppingBag className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="font-semibold">Your bag is empty</p>
              <p className="text-sm text-muted-foreground">
                Add a little glow to get started.
              </p>
            </div>
            <Button onClick={() => setOpen(false)} asChild>
              <Link href="/shop">Shop the collection</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="px-6">
              {remaining > 0 ? (
                <p className="text-xs text-muted-foreground">
                  Add{" "}
                  <span className="font-semibold text-primary">
                    {formatINR(remaining)}
                  </span>{" "}
                  more for free shipping
                </p>
              ) : (
                <p className="text-xs font-medium text-emerald-600">
                  🎉 You&apos;ve unlocked free shipping!
                </p>
              )}
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full brand-gradient transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="mt-4 flex-1 space-y-4 overflow-y-auto px-6 no-scrollbar">
              {detailed.map(({ product, qty, lineTotal }) => (
                <div key={product.id} className="flex gap-3">
                  <Link
                    href={`/product/${product.slug}`}
                    onClick={() => setOpen(false)}
                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border bg-secondary/40"
                  >
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="80px"
                      className="object-contain p-1.5"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium leading-snug line-clamp-2">
                          {product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {product.size}
                        </p>
                      </div>
                      <button
                        onClick={() => remove(product.id)}
                        className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        aria-label={`Remove ${product.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center rounded-full border">
                        <button
                          onClick={() => setQty(product.id, qty - 1)}
                          className="grid h-8 w-8 place-items-center rounded-l-full transition-colors hover:bg-accent"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {qty}
                        </span>
                        <button
                          onClick={() => setQty(product.id, qty + 1)}
                          className="grid h-8 w-8 place-items-center rounded-r-full transition-colors hover:bg-accent"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-semibold">
                        {formatINR(lineTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <SheetFooter>
              <Separator className="mb-2" />
              {savings > 0 && (
                <div className="flex items-center justify-between text-sm text-emerald-600">
                  <span>Total savings</span>
                  <span className="font-medium">-{formatINR(savings)}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-lg font-bold">{formatINR(subtotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Shipping &amp; taxes calculated at checkout.
              </p>
              <Button size="lg" className="w-full" asChild>
                <Link href="/checkout" onClick={() => setOpen(false)}>
                  Checkout <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setOpen(false)}
              >
                Continue shopping
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

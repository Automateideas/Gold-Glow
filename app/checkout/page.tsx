"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Lock, Tag, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart-context";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function CheckoutPage() {
  const { detailed, subtotal, savings, clear, count } = useCart();
  const router = useRouter();
  const [coupon, setCoupon] = React.useState("");
  const [applied, setApplied] = React.useState(false);
  const [placing, setPlacing] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [orderId, setOrderId] = React.useState("");

  const discount = applied ? Math.round(subtotal * 0.2) : 0;
  const shipping = subtotal - discount >= 599 || subtotal === 0 ? 0 : 49;
  const total = Math.max(0, subtotal - discount + shipping);

  function applyCoupon() {
    if (coupon.trim().toUpperCase() === "GLOW20") {
      setApplied(true);
      toast.success("Coupon applied! 20% off your order.");
    } else {
      toast.error("Invalid coupon code");
    }
  }

  function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    setPlacing(true);
    // Simulated order placement (demo — no real payment is processed)
    setTimeout(() => {
      setOrderId("GG" + Math.random().toString().slice(2, 8));
      setPlacing(false);
      setDone(true);
      clear();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1400);
  }

  if (done) {
    return (
      <div className="container flex flex-col items-center py-20 text-center">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-emerald-100">
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        </div>
        <h1 className="mt-6 font-serif text-3xl font-bold">Order confirmed!</h1>
        <p className="mt-2 max-w-md text-muted-foreground">
          Thank you for shopping with Gold &amp; Glow. Your order{" "}
          <span className="font-semibold text-foreground">#{orderId}</span> is being
          prepared with love. A confirmation email is on its way.
        </p>
        <div className="mt-8 flex gap-3">
          <Button asChild>
            <Link href="/shop">Continue shopping</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Back home</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (count === 0) {
    return (
      <div className="container flex flex-col items-center py-24 text-center">
        <h1 className="font-serif text-2xl font-bold">Your bag is empty</h1>
        <p className="mt-2 text-muted-foreground">
          Add some products before checking out.
        </p>
        <Button className="mt-6" asChild>
          <Link href="/shop">Shop now</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-10 sm:py-14">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/cart">
          <ArrowLeft className="h-4 w-4" /> Back to bag
        </Link>
      </Button>
      <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
        Checkout
      </h1>

      <form
        onSubmit={placeOrder}
        className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]"
      >
        {/* Details */}
        <div className="space-y-8">
          <Card className="p-6">
            <h2 className="text-lg font-semibold">Contact</h2>
            <div className="mt-4 grid gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required placeholder="you@email.com" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" required placeholder="+91 90000 00000" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold">Shipping address</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="first">First name</Label>
                <Input id="first" required placeholder="First name" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="last">Last name</Label>
                <Input id="last" required placeholder="Last name" />
              </div>
              <div className="grid gap-1.5 sm:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" required placeholder="House no, street, area" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="city">City</Label>
                <Input id="city" required placeholder="City" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="state">State</Label>
                <Input id="state" required placeholder="State" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="pin">PIN code</Label>
                <Input id="pin" required placeholder="000000" inputMode="numeric" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="country">Country</Label>
                <Input id="country" defaultValue="India" required />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold">Payment</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              This is a demo store — no real payment is processed. Cash on delivery is
              selected by default.
            </p>
            <div className="mt-4 flex items-center gap-2 rounded-xl border bg-secondary/40 p-4 text-sm">
              <Lock className="h-4 w-4 text-primary" />
              Cash on Delivery / UPI on delivery
            </div>
          </Card>
        </div>

        {/* Summary */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Card className="p-6">
            <h2 className="text-lg font-semibold">Order summary</h2>
            <div className="mt-4 max-h-64 space-y-3 overflow-y-auto no-scrollbar">
              {detailed.map(({ product, qty, lineTotal }) => (
                <div key={product.id} className="flex items-center gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border bg-secondary/40">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="56px"
                      className="object-contain p-1"
                    />
                    <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-primary text-[0.65rem] font-bold text-primary-foreground">
                      {qty}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-tight line-clamp-1">
                      {product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{product.size}</p>
                  </div>
                  <span className="text-sm font-medium">{formatINR(lineTotal)}</span>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            {/* Coupon */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="GLOW20"
                  className="pl-9"
                  disabled={applied}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={applyCoupon}
                disabled={applied}
              >
                {applied ? "Applied" : "Apply"}
              </Button>
            </div>

            <Separator className="my-4" />

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatINR(subtotal)}</span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Product savings</span>
                  <span>-{formatINR(savings)}</span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Coupon GLOW20</span>
                  <span>-{formatINR(discount)}</span>
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
              <span className="text-2xl font-bold">{formatINR(total)}</span>
            </div>

            <Button
              type="submit"
              size="lg"
              className="mt-5 w-full"
              disabled={placing}
            >
              {placing ? "Placing order…" : `Place order · ${formatINR(total)}`}
            </Button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
              <Lock className="h-3 w-3" /> Your information is safe & secure
            </p>
          </Card>
        </div>
      </form>
    </div>
  );
}

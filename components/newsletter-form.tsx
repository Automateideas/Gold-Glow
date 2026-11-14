"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { subscribeAction } from "@/app/actions";

/** Footer "Join the Glow Club" form. Saves the email (Admin → Subscribers). */
export function NewsletterForm() {
  const [pending, setPending] = React.useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setPending(true);
    const res = await subscribeAction(new FormData(form));
    setPending(false);
    if (res.ok) {
      toast.success(res.message);
      form.reset();
    } else {
      toast.error(res.error);
    }
  }

  return (
    <div className="w-full">
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-3 sm:flex-row">
      <Input
        type="email"
        name="email"
        required
        autoComplete="email"
        placeholder="Enter your email"
        aria-label="Email address"
        className="h-12 border-white/30 bg-white/95 text-foreground placeholder:text-muted-foreground"
      />
      {/* Honeypot — hidden from people, bots fill it in */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />
      <Button type="submit" size="lg" disabled={pending} className="shrink-0 whitespace-nowrap">
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
      </Button>
    </form>
    <p className="mt-2 text-xs text-primary-foreground/80">
      We only email about launches and where to buy. Unsubscribe any time. See our{" "}
      <Link href="/privacy" className="underline">
        Privacy Policy
      </Link>
      .
    </p>
    </div>
  );
}

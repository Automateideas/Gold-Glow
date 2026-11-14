"use client";

import * as React from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { submitContactAction } from "@/app/actions";

/** Contact form. Messages are saved and show up in Admin → Messages. */
export function ContactForm() {
  const [sending, setSending] = React.useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setSending(true);
    const res = await submitContactAction(new FormData(form));
    setSending(false);
    if (res.ok) {
      toast.success("Message sent!", { description: res.message });
      form.reset();
    } else {
      toast.error(res.error);
    }
  }

  return (
    <Card className="p-6 sm:p-8">
      <h2 className="text-lg font-semibold">Send us a message</h2>
      <form onSubmit={onSubmit} className="mt-5 grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required maxLength={120} placeholder="Your name" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="cemail">Email</Label>
            <Input
              id="cemail"
              name="email"
              type="email"
              required
              maxLength={254}
              placeholder="you@email.com"
            />
          </div>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" name="subject" required maxLength={200} placeholder="How can we help?" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            name="message"
            required
            maxLength={4000}
            placeholder="Write your message…"
          />
        </div>
        {/* Honeypot — hidden from people, bots fill it in */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />
        <Button type="submit" size="lg" disabled={sending}>
          {sending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Sending…
            </>
          ) : (
            <>
              Send message <Send className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>
      <p className="mt-4 text-xs text-muted-foreground">
        We use your details only to reply to you. See our{" "}
        <Link href="/privacy" className="text-primary underline">
          Privacy Policy
        </Link>
        .
      </p>
    </Card>
  );
}

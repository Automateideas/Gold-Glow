"use client";

import * as React from "react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { BRAND } from "@/lib/products";

const faqs = [
  {
    q: "How long does shipping take?",
    a: "Orders are dispatched within 24–48 hours and typically arrive in 3–6 business days across India. You'll receive tracking details by email.",
  },
  {
    q: "Do you offer free shipping?",
    a: "Yes! Shipping is free on all orders above ₹599. Orders below that carry a flat ₹49 shipping fee.",
  },
  {
    q: "What is your return policy?",
    a: "Unopened products can be returned within 7 days of delivery for a full refund. Reach out to our care team to start a return.",
  },
  {
    q: "Are your products cruelty-free?",
    a: "Absolutely. Every Gold & Glow product is cruelty-free, paraben-free and dermatologically tested.",
  },
];

export default function ContactPage() {
  const [sending, setSending] = React.useState(false);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success("Message sent!", {
        description: "Our care team will get back to you within 24 hours.",
      });
      (e.target as HTMLFormElement).reset();
    }, 1200);
  }

  return (
    <div className="container py-10 sm:py-14">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          We&apos;re here to help
        </p>
        <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight sm:text-5xl">
          Get in touch
        </h1>
        <p className="mt-3 text-muted-foreground">
          Questions about products, orders or ingredients? Our care team would love
          to hear from you.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        {/* Info */}
        <div className="space-y-4">
          {[
            { icon: Mail, label: "Email", value: BRAND.supportEmail },
            { icon: Phone, label: "Phone", value: BRAND.phone },
            { icon: MapPin, label: "Address", value: BRAND.address },
            { icon: Clock, label: "Hours", value: "Mon–Sat · 10am – 7pm IST" },
          ].map((item) => (
            <Card key={item.label} className="flex items-start gap-4 p-5">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.value}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Form */}
        <Card className="p-6 sm:p-8">
          <h2 className="text-lg font-semibold">Send us a message</h2>
          <form onSubmit={submit} className="mt-5 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" required placeholder="Your name" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="cemail">Email</Label>
                <Input id="cemail" type="email" required placeholder="you@email.com" />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" required placeholder="How can we help?" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" required placeholder="Write your message…" />
            </div>
            <Button type="submit" size="lg" disabled={sending}>
              {sending ? "Sending…" : (<>Send message <Send className="h-4 w-4" /></>)}
            </Button>
          </form>
        </Card>
      </div>

      {/* FAQ */}
      <section className="mx-auto mt-16 max-w-3xl">
        <h2 className="text-center font-serif text-2xl font-bold sm:text-3xl">
          Frequently asked questions
        </h2>
        <Accordion type="single" collapsible className="mt-6">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-left text-base">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ContactForm } from "@/components/contact-form";
import { getSettings } from "@/lib/site-data";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export const metadata: Metadata = { title: "Contact" };
export const dynamic = "force-dynamic";

const faqs = [
  {
    q: "Where can I buy Gold & Glow products?",
    a: "Our full range is available on Amazon, Flipkart and Meesho. Just open any product on this site and tap the 'Buy on…' button for your preferred app.",
  },
  {
    q: "How do shipping and returns work?",
    a: "Shipping, delivery timelines and returns are handled by the marketplace you order from (Amazon, Flipkart or Meesho) under their standard policies.",
  },
  {
    q: "Are the products on the marketplaces genuine?",
    a: "Yes — always buy from our official Gold & Glow listings on Amazon, Flipkart and Meesho to be sure you're getting 100% authentic products.",
  },
  {
    q: "Are your products cruelty-free?",
    a: "Absolutely. Every Gold & Glow product is cruelty-free, paraben-free and dermatologically tested.",
  },
];

export default async function ContactPage() {
  const s = await getSettings();

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
            { icon: Mail, label: "Email", value: s.email },
            { icon: Phone, label: "Phone", value: s.phone },
            { icon: MapPin, label: "Address", value: s.address },
            { icon: Clock, label: "Hours", value: s.hours },
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
        <ContactForm />
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

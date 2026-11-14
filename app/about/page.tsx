import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Leaf, Heart, FlaskConical, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "The story behind Gold & Glow: herbal-inspired face, body and talc care with clean formulas, made for precise care and a poetic, golden glow.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    icon: Leaf,
    title: "Nature-first",
    text: "We formulate with recognisable botanicals — vitamin-C, aloe, honey, rose and jojoba — chosen for what they truly do for skin.",
  },
  {
    icon: FlaskConical,
    title: "Backed by science",
    text: "Every product is dermatologically tested and pH-balanced, so effective care always feels gentle.",
  },
  {
    icon: Heart,
    title: "Kind by design",
    text: "Cruelty-free and paraben-free, made thoughtfully in India for real, everyday skin.",
  },
  {
    icon: Sparkles,
    title: "Made to glow",
    text: "Because skincare should feel like a little ritual of joy — precise care with a poetic finish.",
  },
];

const ingredients = [
  {
    name: "Vitamin-C",
    use: "Brightens & evens tone",
    img: "/products/vitamin-c-facewash.jpg",
  },
  {
    name: "Aloe Vera",
    use: "Soothes & hydrates",
    img: "/products/aloe-gel.jpg",
  },
  {
    name: "Honey & Almond",
    use: "Nourishes & repairs",
    img: "/products/honey-almond-cream.jpg",
  },
  {
    name: "Rose Water",
    use: "Tones & refreshes",
    img: "/products/rose-water.jpg",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="pointer-events-none absolute -right-20 -top-10 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="container grid items-center gap-10 py-16 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              Our story
            </p>
            <h1 className="mt-3 font-serif text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Precised care, <span className="gold-text">poetic glow.</span>
            </h1>
            <p className="mt-5 text-muted-foreground">
              Gold &amp; Glow began with a simple belief — that skincare can be
              both effective and beautiful. We blend time-honoured herbal
              ingredients with modern, skin-friendly formulations to create
              everyday essentials that care for your skin precisely, and leave
              it glowing poetically.
            </p>
            <p className="mt-4 text-muted-foreground">
              From our brightening Vitamin-C face wash to cooling Blossom talc
              and pure rose water, each product is crafted to fit effortlessly
              into your routine — clean, considered and kind.
            </p>
            <Button className="mt-8" asChild>
              <Link href="/shop">
                Explore the range <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="relative aspect-4/3 overflow-hidden rounded-3xl border">
            <Image
              src="/products/talc-trio-banner.jpg"
              alt="Gold & Glow collection"
              loading="eager"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="container py-16">
        <SectionHeading
          center
          eyebrow="What we stand for"
          title="Our promise to your skin"
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl border bg-card p-6 shadow-sm"
            >
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10">
                <v.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ingredients */}
      <section className="container py-8" id="ingredients">
        <SectionHeading
          center
          eyebrow="Hero ingredients"
          title="Powered by botanicals"
          description="Real, recognisable ingredients — nothing hidden, nothing harsh."
        />
        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {ingredients.map((ing) => (
            <div
              key={ing.name}
              className="group flex flex-col items-center gap-3 rounded-2xl border bg-card p-5 text-center shadow-sm"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-secondary/40">
                <Image
                  src={ing.img}
                  alt={ing.name}
                  loading="eager"
                  fill
                  sizes="200px"
                  className="object-contain p-3 transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div>
                <p className="font-semibold">{ing.name}</p>
                <p className="text-xs text-muted-foreground">{ing.use}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container py-16">
        <div className="rounded-3xl brand-gradient p-10 text-center text-primary-foreground sm:p-16">
          <h2 className="font-serif text-3xl font-bold sm:text-4xl">
            Ready to glow?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-primary-foreground/90">
            Join thousands who&apos;ve made Gold &amp; Glow part of their daily
            ritual.
          </p>
          <Button
            size="lg"
            className="mt-8"
            asChild
          >
            <Link href="/shop">Shop the collection</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

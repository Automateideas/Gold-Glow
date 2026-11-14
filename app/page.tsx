import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Quote,
  Droplets,
  Sun,
  Wind,
} from "lucide-react";
import { CATEGORIES } from "@/lib/products";
import { categoryHref } from "@/lib/categories";
import { getAllProducts } from "@/lib/catalog";
import { getPublishedReviews, getSettings } from "@/lib/site-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { MarqueeStrip } from "@/components/marquee-strip";
import { StarRating } from "@/components/star-rating";
import { HeroCarousel } from "@/components/hero-carousel";
import { absoluteUrl, SITE_URL } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default async function HomePage() {
  const [all, settings, reviews] = await Promise.all([
    getAllProducts(),
    getSettings(),
    getPublishedReviews(),
  ]);
  const bestsellers = all.filter((p) => p.bestSeller).slice(0, 4);
  const newIn = all.filter((p) => p.new || p.rating >= 4.7).slice(0, 8);
  // Hero carousel: products flagged "Home carousel" in the admin (falls back to bestsellers).
  const flagged = all.filter((p) => p.hero);
  const heroProducts = (
    flagged.length ? flagged : bestsellers.length ? bestsellers : all
  ).slice(0, 6);

  // Brand + website structured data (helps Google show the brand name and logo).
  const orgLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Gold & Glow",
        url: SITE_URL,
        logo: absoluteUrl("/products/logo-wordmark.jpg"),
        email: settings.email || undefined,
        telephone: settings.phone || undefined,
        sameAs: [
          settings.instagram,
          settings.facebook,
          settings.youtube,
        ].filter(Boolean),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "Gold & Glow",
        url: SITE_URL,
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(orgLd).split("<").join("\\u003c"),
        }}
      />
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-gold/20 blur-3xl" />
        <div className="container grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
          <div className="animate-fade-up">
            <Badge variant="soft" className="mb-5 gap-1.5 px-3 py-1.5">
              <Sparkles className="h-3.5 w-3.5" /> {settings.heroBadge}
            </Badge>
            <h1 className="font-serif text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {settings.heroLine1}{" "}
              <span className="gold-text">{settings.heroGold}</span>{" "}
              <span className="text-primary">{settings.heroAccent}</span>
            </h1>
            <p className="mt-5 max-w-md text-base text-muted-foreground sm:text-lg">
              {settings.heroDescription}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button size="lg" asChild>
                <Link href="/shop">
                  Shop the collection <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/shop/face-wash">Explore face care</Link>
              </Button>
            </div>
            <p className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
              <span>Available on</span>
              <span className="font-semibold text-foreground">Amazon</span>
              <span className="text-border">·</span>
              <span className="font-semibold text-foreground">Flipkart</span>
              <span className="text-border">·</span>
              <span className="font-semibold text-foreground">Meesho</span>
            </p>
            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-3">
                {heroProducts.slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    className="h-11 w-11 overflow-hidden rounded-full border-2 border-background bg-secondary"
                  >
                    <Image
                      src={p.images[0]}
                      loading="eager"
                      alt=""
                      width={44}
                      height={44}
                      className="h-full w-full object-contain p-0.5"
                    />
                  </div>
                ))}
              </div>
              {settings.showRating && (
                <div>
                  <StarRating rating={5} />
                  <p className="text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {settings.ratingScore}
                    </span>{" "}
                    {settings.ratingText}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Hero visual — product carousel (managed from /admin) */}
          <HeroCarousel products={heroProducts} />
        </div>
      </section>

      <MarqueeStrip />

      {/* CATEGORIES */}
      <section className="container py-16">
        <SectionHeading
          center
          eyebrow="Shop by category"
          title="Find your daily ritual"
          description="From brightening cleansers to cooling talc, every Gold & Glow essential is made to fit effortlessly into your routine."
        />
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={categoryHref(cat.name)}
              className="group flex flex-col items-center gap-3 rounded-2xl border bg-card p-4 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-secondary/40">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="160px"
                  className="object-contain p-3 transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight">
                  {cat.name}
                </p>
                <p className="text-[0.7rem] text-muted-foreground">
                  {cat.blurb}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="container py-8" id="bestsellers">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Loved by many"
            title="Bestsellers"
            description="The cult favourites our community keeps coming back for."
          />
          <Button
            variant="ghost"
            asChild
            className="hidden shrink-0 sm:inline-flex"
          >
            <Link href="/shop">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {bestsellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* FEATURE BANNER (editable in Admin → Settings) */}
      {settings.bannerEnabled && (
        <section className="container py-16">
          <div className="relative overflow-hidden rounded-3xl border bg-linear-to-br from-secondary via-background to-accent">
            <div className="grid items-center gap-6 lg:grid-cols-2">
              <div className="p-8 sm:p-12">
                {settings.bannerBadge && (
                  <Badge variant="gold" className="mb-4">
                    {settings.bannerBadge}
                  </Badge>
                )}
                <h3 className="font-serif text-3xl font-bold sm:text-4xl">
                  {settings.bannerTitle}
                </h3>
                <p className="mt-3 max-w-md text-muted-foreground">
                  {settings.bannerText}
                </p>
                {settings.bannerFeatures.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-4">
                    {settings.bannerFeatures.slice(0, 3).map((label, i) => {
                      const Icon = [Wind, Sun, Sparkles][i % 3];
                      return (
                        <div
                          key={label}
                          className="flex items-center gap-2 text-sm font-medium"
                        >
                          <Icon className="h-4 w-4 text-primary" />
                          {label}
                        </div>
                      );
                    })}
                  </div>
                )}
                {settings.bannerButtonLabel && settings.bannerButtonLink && (
                  <Button className="mt-8" asChild>
                    <Link href={settings.bannerButtonLink}>
                      {settings.bannerButtonLabel}{" "}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
              {settings.bannerImage && (
                <div className="relative h-64 lg:h-full lg:min-h-95">
                  <Image
                    src={settings.bannerImage}
                    alt={settings.bannerTitle}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    unoptimized={/^https?:/i.test(settings.bannerImage)}
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* NEW / CURATED GRID */}
      <section className="container py-8">
        <SectionHeading
          center
          eyebrow="Fresh & top-rated"
          title="New in & trending"
          description="Just-dropped launches and the pieces climbing our charts right now."
        />
        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {newIn.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button size="lg" variant="outline" asChild>
            <Link href="/shop">
              Browse all products <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* INGREDIENT PROMISE */}
      <section className="container py-16" id="promise">
        <div className="grid gap-8 rounded-3xl border bg-card p-8 shadow-sm sm:p-12 lg:grid-cols-3">
          {[
            {
              icon: Droplets,
              title: "Powered by nature",
              text: "Vitamin-C, aloe, honey, rose and jojoba — real botanicals that your skin recognises and loves.",
            },
            {
              icon: Sparkles,
              title: "Clean & conscious",
              text: "Paraben-free, cruelty-free and dermatologically tested. Kind formulas for every skin type.",
            },
            {
              icon: Sun,
              title: "Visible glow",
              text: "48-hour hydration, brighter tone and a healthy radiance you can actually see and feel.",
            },
          ].map((f) => (
            <div key={f.title}>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      {reviews.length > 0 && (
        <section className="container py-8" id="reviews">
          <SectionHeading
            center
            eyebrow="Glow stories"
            title="What our community says"
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="flex flex-col rounded-2xl border bg-card p-6 shadow-sm"
              >
                <Quote className="h-7 w-7 text-primary/30" />
                <StarRating rating={r.rating} className="mt-3" />
                <p className="mt-3 flex-1 text-sm text-foreground/90">
                  &ldquo;{r.text}&rdquo;
                </p>
                <div className="mt-5 border-t pt-4">
                  <p className="text-sm font-semibold">{r.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {[r.city, r.product && `verified buyer of ${r.product}`]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

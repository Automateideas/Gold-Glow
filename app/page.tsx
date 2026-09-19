import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Star, Quote, Droplets, Sun, Wind } from "lucide-react";
import { products, CATEGORIES } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { MarqueeStrip } from "@/components/marquee-strip";
import { StarRating } from "@/components/star-rating";

const bestsellers = products.filter((p) => p.bestSeller).slice(0, 4);
const newIn = products.filter((p) => p.new || p.rating >= 4.7).slice(0, 8);

const reviews = [
  {
    name: "Ananya R.",
    city: "Mumbai",
    text: "The Vitamin-C face wash gave my dull skin a proper glow in two weeks. It doesn't dry me out at all.",
    product: "Vitamin-C Face Wash",
  },
  {
    name: "Priya S.",
    city: "Bengaluru",
    text: "Honey & almond lotion is the softest thing ever — non-sticky and smells divine. My whole family uses it now.",
    product: "Honey & Almond Lotion",
  },
  {
    name: "Meera K.",
    city: "Delhi",
    text: "Rose water toner is a staple in my bag. Instantly refreshing and 100% pure. Repurchased 3 times!",
    product: "Premium Rose Water",
  },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-gold/20 blur-3xl" />
        <div className="container grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
          <div className="animate-fade-up">
            <Badge variant="soft" className="mb-5 gap-1.5 px-3 py-1.5">
              <Sparkles className="h-3.5 w-3.5" /> New season glow drop
            </Badge>
            <h1 className="font-serif text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Precised care,{" "}
              <span className="gold-text">poetic</span>{" "}
              <span className="text-primary">glow.</span>
            </h1>
            <p className="mt-5 max-w-md text-base text-muted-foreground sm:text-lg">
              Herbal-inspired skincare and body care that treats your skin gently
              and lights it up beautifully. Clean formulas, radiant results.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button size="lg" asChild>
                <Link href="/shop">
                  Shop the collection <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/shop?category=Face+Wash">Explore face care</Link>
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-3">
                {["aloe-cream", "rose-water", "honey-almond-cream", "vitamin-c-facewash"].map(
                  (img) => (
                    <div
                      key={img}
                      className="h-11 w-11 overflow-hidden rounded-full border-2 border-background bg-secondary"
                    >
                      <Image
                        src={`/products/${img}.jpg`}
                        alt=""
                        width={44}
                        height={44}
                        className="h-full w-full object-contain p-0.5"
                      />
                    </div>
                  )
                )}
              </div>
              <div>
                <StarRating rating={5} />
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">4.8/5</span> from
                  2,300+ happy customers
                </p>
              </div>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative">
            <div className="relative mx-auto aspect-square w-full max-w-md">
              <div className="absolute inset-0 rounded-[2.5rem] brand-gradient opacity-90" />
              <div className="absolute inset-3 rounded-[2rem] bg-background/10 backdrop-blur-sm" />
              <Image
                src="/products/vitamin-c-facewash.jpg"
                alt="Gold & Glow Vitamin-C Face Wash"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 40vw"
                className="object-contain p-8 drop-shadow-2xl"
              />
              {/* Floating cards */}
              <div className="absolute -left-3 top-10 rounded-2xl bg-background/95 p-3 shadow-lg backdrop-blur sm:-left-6">
                <div className="flex items-center gap-2">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/10">
                    <Droplets className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">Brightening</p>
                    <p className="text-[0.65rem] text-muted-foreground">Vitamin-C rich</p>
                  </div>
                </div>
              </div>
              <div className="absolute -right-2 bottom-12 rounded-2xl bg-background/95 p-3 shadow-lg backdrop-blur sm:-right-6">
                <p className="text-xs font-semibold text-primary">★ Bestseller</p>
                <p className="text-[0.65rem] text-muted-foreground">Loved by 2k+</p>
              </div>
            </div>
          </div>
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
              href={`/shop?category=${encodeURIComponent(cat.name)}`}
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
                <p className="text-sm font-semibold leading-tight">{cat.name}</p>
                <p className="text-[0.7rem] text-muted-foreground">{cat.blurb}</p>
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
          <Button variant="ghost" asChild className="hidden shrink-0 sm:inline-flex">
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

      {/* FEATURE BANNER — TALC */}
      <section className="container py-16">
        <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-secondary via-background to-accent">
          <div className="grid items-center gap-6 lg:grid-cols-2">
            <div className="p-8 sm:p-12">
              <Badge variant="gold" className="mb-4">Icy-touch collection</Badge>
              <h3 className="font-serif text-3xl font-bold sm:text-4xl">
                Stay fresh, all day long
              </h3>
              <p className="mt-3 max-w-md text-muted-foreground">
                Our Blossom talc range cools on contact and keeps you feeling
                confident — with rose, fresh floral and long-lasting deo freshness.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                {[
                  { icon: Wind, label: "Icy cooling" },
                  { icon: Sun, label: "All-day dry" },
                  { icon: Sparkles, label: "Floral scent" },
                ].map((f) => (
                  <div key={f.label} className="flex items-center gap-2 text-sm font-medium">
                    <f.icon className="h-4 w-4 text-primary" />
                    {f.label}
                  </div>
                ))}
              </div>
              <Button className="mt-8" asChild>
                <Link href="/shop?category=Talc+%26+Powder">
                  Shop talc range <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="relative h-64 lg:h-full lg:min-h-[380px]">
              <Image
                src="/products/talc-trio-banner.jpg"
                alt="Gold & Glow Blossom talc range"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

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
      <section className="container py-8" id="reviews">
        <SectionHeading
          center
          eyebrow="Glow stories"
          title="What our community says"
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {reviews.map((r) => (
            <div
              key={r.name}
              className="flex flex-col rounded-2xl border bg-card p-6 shadow-sm"
            >
              <Quote className="h-7 w-7 text-primary/30" />
              <StarRating rating={5} className="mt-3" />
              <p className="mt-3 flex-1 text-sm text-foreground/90">&ldquo;{r.text}&rdquo;</p>
              <div className="mt-5 border-t pt-4">
                <p className="text-sm font-semibold">{r.name}</p>
                <p className="text-xs text-muted-foreground">
                  {r.city} · verified buyer of {r.product}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

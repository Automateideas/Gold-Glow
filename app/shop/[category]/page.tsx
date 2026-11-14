import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight } from "lucide-react";
import { getAllProducts } from "@/lib/catalog";
import { CATEGORY_PAGES, categoryHref, categoryMeta } from "@/lib/categories";
import { getCategoryPage } from "@/lib/site-data";
import { absoluteUrl } from "@/lib/site-url";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { category } = await params;
  const page = await getCategoryPage(category);
  if (!page) return { title: "Category not found", robots: { index: false, follow: false } };
  const image = categoryMeta(page.name)?.image;
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: `/shop/${page.slug}` },
    openGraph: {
      title: `${page.metaTitle} · Gold & Glow`,
      description: page.metaDescription,
      type: "website",
      images: image ? [{ url: image, alt: page.h1 }] : undefined,
    },
  };
}

export default async function CategoryPage({ params }: Params) {
  const { category } = await params;
  const page = await getCategoryPage(category);
  if (!page) notFound();

  const all = await getAllProducts();
  const items = all.filter((p) => p.category === page.name);
  const others = CATEGORY_PAGES.filter((c) => c.slug !== page.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: page.h1,
        description: page.metaDescription,
        url: absoluteUrl(`/shop/${page.slug}`),
        mainEntity: {
          "@type": "ItemList",
          itemListElement: items.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: absoluteUrl(`/product/${p.slug}`),
            name: p.name,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Shop", item: absoluteUrl("/shop") },
          { "@type": "ListItem", position: 3, name: page.name },
        ],
      },
    ],
  };

  return (
    <div className="container py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).split("<").join("\\u003c") }}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/shop" className="hover:text-primary">
          Shop
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">{page.name}</span>
      </nav>

      {/* Heading + intro */}
      <header className="mt-6 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          {categoryMeta(page.name)?.blurb ?? "Gold & Glow"}
        </p>
        <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight sm:text-5xl">
          {page.h1}
        </h1>
        <div className="mt-4 space-y-3 text-muted-foreground">
          {page.intro.map((para) => (
            <p key={para}>{para}</p>
          ))}
        </div>
      </header>

      {/* Products */}
      <section className="mt-10" aria-label={`${page.name} products`}>
        {items.length === 0 ? (
          <div className="rounded-2xl border bg-card p-10 text-center">
            <p className="font-semibold">New products coming soon</p>
            <p className="mt-1 text-sm text-muted-foreground">
              We are adding products to this category. Meanwhile, browse the full range.
            </p>
            <Button className="mt-5" asChild>
              <Link href="/shop">
                Shop all products <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              {items.length} {items.length === 1 ? "product" : "products"}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
              {items.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Quick guide — built from the live product data */}
      {items.length > 0 && (
        <section className="mt-16 grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-2xl font-bold sm:text-3xl">
              Which {page.name.toLowerCase()} is right for you?
            </h2>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              {page.tips.map((t) => (
                <li key={t} className="flex gap-3">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="overflow-hidden rounded-2xl border bg-card">
            <p className="border-b px-5 py-3 text-sm font-semibold">Quick guide</p>
            <ul className="divide-y">
              {items.map((p) => (
                <li key={p.id} className="flex items-start justify-between gap-4 px-5 py-3 text-sm">
                  <Link href={`/product/${p.slug}`} className="font-medium hover:text-primary">
                    {p.name}
                  </Link>
                  <span className="shrink-0 text-right text-xs text-muted-foreground">
                    {[p.skinType, p.size].filter(Boolean).join(" · ")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Where to buy */}
      <section className="mt-16 rounded-3xl border bg-secondary/40 p-8 text-center sm:p-10">
        <h2 className="font-serif text-2xl font-bold">Where to buy {page.name.toLowerCase()}</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
          Open any product above and tap Buy on Amazon, Flipkart or Meesho. Orders, delivery and
          returns are handled by the marketplace you choose.
        </p>
      </section>

      {/* Other categories (internal links) */}
      <section className="mt-16">
        <SectionHeading eyebrow="Keep exploring" title="Shop other categories" />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {others.map((c) => {
            const meta = categoryMeta(c.name);
            return (
              <Link
                key={c.slug}
                href={categoryHref(c.name)}
                className="group flex flex-col items-center gap-3 rounded-2xl border bg-card p-4 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
              >
                {meta && (
                  <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-secondary/40">
                    <Image
                      src={meta.image}
                      alt=""
                      fill
                      sizes="160px"
                      className="object-contain p-3 transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                )}
                <span className="text-sm font-semibold leading-tight">{c.name}</span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

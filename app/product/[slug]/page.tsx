import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getProductBySlug, getRelatedProducts } from "@/lib/catalog";
import { ProductDetail } from "@/components/product-detail";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { BRAND } from "@/lib/products";
import { absoluteUrl } from "@/lib/site-url";
import { categoryHref } from "@/lib/categories";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  const base = (product.short || product.description).split(/\s+/).join(" ").trim();
  const description = `${base} ${product.category}, ${product.size}. Buy Gold & Glow on Amazon, Flipkart or Meesho.`.slice(0, 160);
  return {
    title: product.name,
    description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: `${product.name} · Gold & Glow`,
      description,
      images: [product.images[0]],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.slug, product.category);

  // Structured data so Google can show the product. (No price/rating on purpose:
  // we don't sell directly and the numbers aren't verified reviews.)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    url: absoluteUrl(`/product/${product.slug}`),
    name: product.name,
    description: product.short || product.description,
    image: product.images.map(absoluteUrl),
    sku: product.id,
    category: product.category,
    brand: { "@type": "Brand", name: BRAND.name },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Shop", item: absoluteUrl("/shop") },
      {
        "@type": "ListItem",
        position: 3,
        name: product.category,
        item: absoluteUrl(categoryHref(product.category)),
      },
      { "@type": "ListItem", position: 4, name: product.name },
    ],
  };

  return (
    <div className="container py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd).split("<").join("\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/shop" className="hover:text-primary">Shop</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link
          href={categoryHref(product.category)}
          className="hover:text-primary"
        >
          {product.category}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="truncate text-foreground">{product.name}</span>
      </nav>

      <div className="mt-8">
        <ProductDetail product={product} />
      </div>

      {/* Related */}
      <section className="mt-20">
        <SectionHeading eyebrow="You may also love" title="Complete your ritual" />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}

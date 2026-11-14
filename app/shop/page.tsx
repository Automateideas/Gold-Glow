import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { ShopClient } from "@/components/shop-client";
import { getAllProducts } from "@/lib/catalog";
import { CATEGORY_PAGES } from "@/lib/categories";

export const metadata: Metadata = {
  title: "Shop All Products",
  description:
    "Shop the full Gold & Glow herbal range: face wash, body lotions, creams, talc, toners and aloe gel. Buy on Amazon, Flipkart or Meesho.",
  alternates: { canonical: "/shop" },
};

export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const sp = await searchParams;
  // Old filter links (/shop?category=Face+Wash) now live at their own page.
  const target = CATEGORY_PAGES.find((c) => c.name === sp.category);
  if (target) permanentRedirect(`/shop/${target.slug}`);
  const allProducts = await getAllProducts();
  return (
    <div className="container py-10 sm:py-14">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
          The collection
        </p>
        <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight sm:text-5xl">
          Shop Gold &amp; Glow
        </h1>
        <p className="mt-3 text-muted-foreground">
          Clean, herbal-inspired essentials for face and body. Find your perfect
          match and build a ritual that glows.
        </p>
      </div>
      <div className="mt-10">
        <ShopClient initialCategory={sp.category} allProducts={allProducts} />
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { ShopClient } from "@/components/shop-client";
import { getAllProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Shop All Products",
  description:
    "Browse the full Gold & Glow collection — face wash, lotions, creams, talc, toners and aloe gel.",
};

export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const sp = await searchParams;
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

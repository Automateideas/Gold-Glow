import type { Category, Product } from "@/lib/products";

/** Pure (client-safe) helpers for mapping between DB rows and Product objects. */

export const TABLE = "gg_products";

/** A raw row from the gg_products table. */
export type ProductRow = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  category: string;
  price: number;
  compare_at: number | null;
  size: string | null;
  rating: number | null;
  reviews: number | null;
  best_seller: boolean | null;
  is_new: boolean | null;
  in_hero: boolean | null;
  images: string[] | null;
  shade: string | null;
  short: string | null;
  description: string | null;
  key_ingredients: string[] | null;
  benefits: string[] | null;
  how_to_use: string | null;
  skin_type: string | null;
  links: Record<string, string> | null;
  sort_order: number | null;
};

export function rowToProduct(r: ProductRow): Product {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    tagline: r.tagline ?? "",
    category: r.category as Category,
    price: r.price ?? 0,
    compareAt: r.compare_at ?? undefined,
    size: r.size ?? "",
    rating: Number(r.rating ?? 4.5),
    reviews: r.reviews ?? 0,
    bestSeller: r.best_seller ?? false,
    new: r.is_new ?? false,
    hero: r.in_hero ?? false,
    images: r.images && r.images.length ? r.images : ["/products/logo-wordmark.jpg"],
    shade: r.shade ?? "335 82% 46%",
    short: r.short ?? "",
    description: r.description ?? "",
    keyIngredients: r.key_ingredients ?? [],
    benefits: r.benefits ?? [],
    howToUse: r.how_to_use ?? "",
    skinType: r.skin_type ?? "",
    links: r.links ?? undefined,
  };
}

/** Product → DB row shape (for admin inserts/updates). */
export function productToRow(p: Product, sortOrder = 0): ProductRow {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    category: p.category,
    price: p.price,
    compare_at: p.compareAt ?? null,
    size: p.size,
    rating: p.rating,
    reviews: p.reviews,
    best_seller: p.bestSeller ?? false,
    is_new: p.new ?? false,
    in_hero: p.hero ?? false,
    images: p.images,
    shade: p.shade,
    short: p.short,
    description: p.description,
    key_ingredients: p.keyIngredients,
    benefits: p.benefits,
    how_to_use: p.howToUse,
    skin_type: p.skinType,
    links: p.links ?? {},
    sort_order: sortOrder,
  };
}

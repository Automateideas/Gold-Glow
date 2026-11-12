import "server-only";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { supabaseConfigured } from "@/lib/supabase/env";
import { products as seedProducts, type Category, type Product } from "@/lib/products";
import { TABLE, rowToProduct, type ProductRow } from "@/lib/catalog-map";

async function fetchRows(): Promise<{ rows: ProductRow[]; error?: string }> {
  if (!supabaseConfigured()) {
    return { rows: [], error: "Supabase isn't configured yet (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)." };
  }
  try {
    const sb = createAdminSupabase();
    const { data, error } = await sb
      .from(TABLE)
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) {
      const missing =
        error.code === "PGRST205" ||
        error.code === "42P01" ||
        /does not exist|schema cache/i.test(error.message);
      return {
        rows: [],
        error: missing
          ? "The gg_products table doesn't exist yet — run supabase/setup.sql in the Supabase SQL Editor."
          : error.message,
      };
    }
    return { rows: (data ?? []) as ProductRow[] };
  } catch (e) {
    return { rows: [], error: e instanceof Error ? e.message : "Could not reach Supabase." };
  }
}

/**
 * All products for the storefront. Reads from Supabase when configured; if it
 * isn't reachable, the table isn't created yet, or it's still empty, it falls
 * back to the built-in seed so the site always renders.
 */
export async function getAllProducts(): Promise<Product[]> {
  const { rows, error } = await fetchRows();
  if (error || rows.length === 0) return seedProducts;
  return rows.map(rowToProduct);
}

/** Products for the admin dashboard (no seed fallback, surfaces errors). */
export async function getAdminProducts(): Promise<{ items: Product[]; error?: string }> {
  const { rows, error } = await fetchRows();
  return { items: rows.map(rowToProduct), error };
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const all = await getAllProducts();
  return all.find((p) => p.slug === slug);
}

export async function getRelatedProducts(
  slug: string,
  category: Category,
  limit = 4
): Promise<Product[]> {
  const all = await getAllProducts();
  const same = all.filter((p) => p.category === category && p.slug !== slug);
  const others = all.filter((p) => p.category !== category && p.slug !== slug);
  return [...same, ...others].slice(0, limit);
}

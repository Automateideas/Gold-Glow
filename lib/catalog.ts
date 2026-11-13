import "server-only";
import { cache } from "react";
import { asc } from "drizzle-orm";
import { dbConfigured, getDb } from "@/db";
import { ggProducts } from "@/db/schema";
import { products as seedProducts, type Category, type Product } from "@/lib/products";
import { rowToProduct, type ProductRow } from "@/lib/catalog-map";

/** Pull the Postgres error code/message out of a Drizzle/postgres.js error. */
export function pgError(e: unknown): { code?: string; message: string } {
  const err = e as { code?: string; message?: string; cause?: { code?: string; message?: string } };
  return {
    code: err?.cause?.code ?? err?.code,
    message: err?.cause?.message ?? err?.message ?? "Database error.",
  };
}

/** Runs a DB call, retrying once on a transient network/timeout error (e.g. a cold pooler). */
export async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    const { code, message } = pgError(e);
    const transient =
      code === "57014" || // statement timeout / cancelled
      code === "ETIMEDOUT" ||
      code === "ECONNRESET" ||
      code === "CONNECTION_CLOSED" ||
      /timeout|ECONNRESET/i.test(message);
    if (!transient) throw e;
    await new Promise((r) => setTimeout(r, 400));
    return await fn();
  }
}

export function friendlyDbError(e: unknown): string {
  const { code, message } = pgError(e);
  if (code === "23505") return "Another product already uses that URL slug. Change the slug.";
  if (code === "42P01")
    return "The gg_products table doesn't exist yet — run `npm run db:migrate` once to create it.";
  if (code === "28P01" || /password authentication failed/i.test(message))
    return "Database login failed — check the password inside DATABASE_URL.";
  if (/ENOTFOUND|ECONNREFUSED|ETIMEDOUT|CONNECT_TIMEOUT/i.test(message + (code ?? "")))
    return "Can't reach the database — check DATABASE_URL (use the Supabase pooler connection string).";
  return message;
}

/** Cached per request, so one page render hits the database only once. */
const fetchRows = cache(async (): Promise<{ rows: ProductRow[]; error?: string }> => {
  if (!dbConfigured()) {
    return { rows: [], error: "Database isn't configured yet (set DATABASE_URL in .env.local)." };
  }
  try {
    const rows = await withRetry(() =>
      getDb()
        .select()
        .from(ggProducts)
        .orderBy(asc(ggProducts.sort_order), asc(ggProducts.created_at))
    );
    return { rows };
  } catch (e) {
    console.error("[catalog] database error:", pgError(e));
    return { rows: [], error: friendlyDbError(e) };
  }
});

/**
 * All products for the storefront. Reads from the database when configured; if
 * it isn't reachable, the table isn't created yet, or it's still empty, it falls
 * back to the built-in seed so the site always renders.
 */
export async function getAllProducts(): Promise<Product[]> {
  const { rows, error } = await fetchRows();
  if (error || rows.length === 0) return seedProducts;
  return rows.map(rowToProduct).filter((p) => p.published !== false);
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

"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  checkCredentials,
  clearFailures,
  endAdminSession,
  isAdminSession,
  isLockedOut,
  recordFailure,
  startAdminSession,
} from "@/lib/admin/auth";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { supabaseConfigured } from "@/lib/supabase/env";
import { TABLE, productToRow, type ProductRow } from "@/lib/catalog-map";
import { CATEGORIES, products as seedProducts } from "@/lib/products";

export type LoginState = { error?: string };
export type ActionResult = { ok: true } | { ok: false; error: string };

/* ------------------------------ auth ------------------------------ */

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";

  if (isLockedOut(ip)) {
    return { error: "Too many wrong attempts. Please try again in 15 minutes." };
  }

  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!checkCredentials(username, password)) {
    recordFailure(ip);
    await new Promise((r) => setTimeout(r, 700)); // slow down guessing
    return { error: "Wrong ID or password." };
  }

  clearFailures(ip);
  await startAdminSession();
  redirect("/admin");
}

export async function logoutAction() {
  await endAdminSession();
  redirect("/admin");
}

/* --------------------------- validation --------------------------- */

const str = (v: unknown, max = 2000) =>
  (typeof v === "string" ? v : "").trim().slice(0, max);
const int = (v: unknown, fallback = 0) => {
  const n = Math.round(Number(v));
  return Number.isFinite(n) ? n : fallback;
};
const list = (v: unknown, max = 30) =>
  (Array.isArray(v) ? v : [])
    .map((x) => str(x, 500))
    .filter(Boolean)
    .slice(0, max);
const isHttpUrl = (s: string) => /^https?:\/\/\S+$/i.test(s);

function cleanRow(input: unknown, id: string): ProductRow | string {
  const r = (input ?? {}) as Record<string, unknown>;
  const name = str(r.name, 200);
  if (!name) return "Product name is required.";

  const slug =
    str(r.slug, 200)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") ||
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  if (!slug) return "Could not make a URL slug from the name.";

  const images = list(r.images, 12).filter((u) => isHttpUrl(u) || u.startsWith("/"));
  if (images.length === 0) return "Add at least one product image.";

  const category = str(r.category, 100);
  if (!CATEGORIES.some((c) => c.name === category)) return "Pick a valid category.";

  const links: Record<string, string> = {};
  const rawLinks = (r.links ?? {}) as Record<string, unknown>;
  for (const key of ["amazon", "flipkart", "meesho"]) {
    const u = str(rawLinks[key], 1000);
    if (u) {
      if (!isHttpUrl(u)) return `The ${key} link must start with http:// or https://`;
      links[key] = u;
    }
  }

  const compare = r.compare_at == null || r.compare_at === "" ? null : int(r.compare_at, 0);

  return {
    id,
    slug,
    name,
    tagline: str(r.tagline, 300),
    category,
    price: Math.max(0, int(r.price)),
    compare_at: compare && compare > 0 ? compare : null,
    size: str(r.size, 100),
    rating: Math.min(5, Math.max(0, Number(r.rating) || 0)),
    reviews: Math.max(0, int(r.reviews)),
    best_seller: r.best_seller === true,
    is_new: r.is_new === true,
    images,
    shade: str(r.shade, 50) || "335 82% 46%",
    short: str(r.short, 600),
    description: str(r.description, 5000),
    key_ingredients: list(r.key_ingredients),
    benefits: list(r.benefits),
    how_to_use: str(r.how_to_use, 2000),
    skin_type: str(r.skin_type, 300),
    links,
    sort_order: int(r.sort_order),
  };
}

/* ---------------------------- products ---------------------------- */

async function guard(): Promise<string | null> {
  if (!(await isAdminSession())) return "Your session expired. Please sign in again.";
  if (!supabaseConfigured()) return "Supabase isn't configured yet.";
  return null;
}

function friendly(error: { code?: string; message: string }) {
  if (error.code === "23505") return "Another product already uses that URL slug. Change the slug.";
  if (error.code === "PGRST205" || error.code === "42P01")
    return "The gg_products table doesn't exist — run supabase/setup.sql in Supabase first.";
  return error.message;
}

export async function saveProductAction(payload: {
  id?: string;
  row: unknown;
}): Promise<ActionResult> {
  const denied = await guard();
  if (denied) return { ok: false, error: denied };

  const editing = typeof payload.id === "string" && payload.id.length > 0;
  const id = editing ? payload.id! : `gg-${Date.now().toString(36)}`;
  const row = cleanRow(payload.row, id);
  if (typeof row === "string") return { ok: false, error: row };

  const sb = createAdminSupabase();
  const { error } = editing
    ? await sb.from(TABLE).update(row).eq("id", id)
    : await sb.from(TABLE).insert(row);
  if (error) return { ok: false, error: friendly(error) };
  return { ok: true };
}

export async function deleteProductAction(id: string): Promise<ActionResult> {
  const denied = await guard();
  if (denied) return { ok: false, error: denied };
  const { error } = await createAdminSupabase().from(TABLE).delete().eq("id", String(id));
  if (error) return { ok: false, error: friendly(error) };
  return { ok: true };
}

export async function importStarterAction(): Promise<ActionResult> {
  const denied = await guard();
  if (denied) return { ok: false, error: denied };
  const rows = seedProducts.map((p, i) => productToRow(p, i));
  const { error } = await createAdminSupabase()
    .from(TABLE)
    .upsert(rows, { onConflict: "id" });
  if (error) return { ok: false, error: friendly(error) };
  return { ok: true };
}

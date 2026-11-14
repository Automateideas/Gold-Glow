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
import { eq, sql } from "drizzle-orm";
import { dbConfigured, getDb } from "@/db";
import {
  ggMessages,
  ggProducts,
  ggReviews,
  ggSettings,
  ggSubscribers,
  type GgProductInsert,
} from "@/db/schema";
import { DEFAULT_REVIEWS, mergeSettings } from "@/lib/settings";
import { CATEGORY_PAGES, type CategoryOverride } from "@/lib/categories";
import { POLICY_PAGES, type PolicyOverride } from "@/lib/pages";
import { friendlyDbError } from "@/lib/catalog";
import { productToRow } from "@/lib/catalog-map";
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

function cleanRow(input: unknown, id: string): GgProductInsert | string {
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
    in_hero: r.in_hero === true,
    published: r.published !== false,
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
  if (!dbConfigured()) return "Database isn't configured yet (set DATABASE_URL).";
  return null;
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

  try {
    const db = getDb();
    if (editing) {
      const { id: _id, ...changes } = row;
      const done = await db
        .update(ggProducts)
        .set(changes)
        .where(eq(ggProducts.id, id))
        .returning({ id: ggProducts.id });
      if (done.length === 0) return { ok: false, error: "That product no longer exists." };
    } else {
      await db.insert(ggProducts).values(row);
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: friendlyDbError(e) };
  }
}

export async function deleteProductAction(id: string): Promise<ActionResult> {
  const denied = await guard();
  if (denied) return { ok: false, error: denied };
  try {
    await getDb().delete(ggProducts).where(eq(ggProducts.id, String(id)));
    return { ok: true };
  } catch (e) {
    return { ok: false, error: friendlyDbError(e) };
  }
}

export async function importStarterAction(): Promise<ActionResult> {
  const denied = await guard();
  if (denied) return { ok: false, error: denied };
  // productToRow always fills every column (only compare_at may be null).
  const rows = seedProducts.map((p, i) => productToRow(p, i) as GgProductInsert);
  try {
    await getDb()
      .insert(ggProducts)
      .values(rows)
      .onConflictDoUpdate({
        target: ggProducts.id,
        set: Object.fromEntries(
          Object.keys(rows[0])
            .filter((k) => k !== "id")
            .map((k) => [k, sql.raw(`excluded."${k}"`)])
            .concat([["updated_at", sql`now()`]])
        ),
      });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: friendlyDbError(e) };
  }
}

/* --------------------- more product actions --------------------- */

export async function duplicateProductAction(id: string): Promise<ActionResult> {
  const denied = await guard();
  if (denied) return { ok: false, error: denied };
  try {
    const db = getDb();
    const [src] = await db.select().from(ggProducts).where(eq(ggProducts.id, String(id))).limit(1);
    if (!src) return { ok: false, error: "That product no longer exists." };
    const stamp = Date.now().toString(36);
    await db.insert(ggProducts).values({
      ...src,
      id: `gg-${stamp}`,
      slug: `${src.slug}-copy-${stamp.slice(-4)}`,
      name: `${src.name} (copy)`,
      published: false, // copies start hidden until you've edited them
      in_hero: false,
      created_at: new Date(),
      updated_at: new Date(),
    });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: friendlyDbError(e) };
  }
}

export async function setProductPublishedAction(id: string, published: boolean): Promise<ActionResult> {
  const denied = await guard();
  if (denied) return { ok: false, error: denied };
  try {
    await getDb().update(ggProducts).set({ published: !!published }).where(eq(ggProducts.id, String(id)));
    return { ok: true };
  } catch (e) {
    return { ok: false, error: friendlyDbError(e) };
  }
}

/* ----------------------------- settings ----------------------------- */

const urlOrPath = (s: string) =>
  s === "" || /^https?:\/\/\S+$/i.test(s) || /^\/\S*$/.test(s);
const urlOnly = (s: string) => s === "" || /^https?:\/\/\S+$/i.test(s);

export async function saveSettingsAction(input: unknown): Promise<ActionResult> {
  const denied = await guard();
  if (denied) return { ok: false, error: denied };

  const merged = mergeSettings(input);
  const s: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(merged)) {
    s[k] = typeof v === "string" ? v.trim().slice(0, 1500) : Array.isArray(v) ? v.map((x) => x.trim().slice(0, 100)).filter(Boolean).slice(0, 6) : v;
  }
  for (const k of ["instagram", "facebook", "youtube"]) {
    if (!urlOnly(s[k] as string)) return { ok: false, error: `The ${k} link must start with https://` };
  }
  if (!urlOrPath(s.bannerButtonLink as string)) {
    return { ok: false, error: "Banner button link must start with / or https://" };
  }
  if (!urlOrPath(s.bannerImage as string)) {
    return { ok: false, error: "Banner image must be an uploaded image or an https:// link." };
  }
  if (!s.heroLine1 && !s.heroGold && !s.heroAccent) {
    return { ok: false, error: "The hero heading can't be empty." };
  }
  try {
    await getDb()
      .insert(ggSettings)
      .values({ key: "site", data: s })
      .onConflictDoUpdate({ target: ggSettings.key, set: { data: s, updated_at: new Date() } });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: friendlyDbError(e) };
  }
}

export async function resetSettingsAction(): Promise<ActionResult> {
  const denied = await guard();
  if (denied) return { ok: false, error: denied };
  try {
    await getDb().delete(ggSettings).where(eq(ggSettings.key, "site"));
    return { ok: true };
  } catch (e) {
    return { ok: false, error: friendlyDbError(e) };
  }
}

/* ----------------------------- reviews ----------------------------- */

export async function saveReviewAction(payload: { id?: string; row: unknown }): Promise<ActionResult> {
  const denied = await guard();
  if (denied) return { ok: false, error: denied };
  const r = (payload.row ?? {}) as Record<string, unknown>;
  const name = str(r.name, 100);
  const text = str(r.text, 1000);
  if (!name || !text) return { ok: false, error: "Name and the review text are required." };
  const values = {
    name,
    city: str(r.city, 100),
    text,
    product: str(r.product, 200),
    rating: Math.min(5, Math.max(1, int(r.rating, 5))),
    published: r.published !== false,
    sort_order: int(r.sort_order),
  };
  try {
    const db = getDb();
    if (payload.id) {
      await db.update(ggReviews).set(values).where(eq(ggReviews.id, payload.id));
    } else {
      await db.insert(ggReviews).values({ id: `rv-${Date.now().toString(36)}`, ...values });
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: friendlyDbError(e) };
  }
}

export async function deleteReviewAction(id: string): Promise<ActionResult> {
  const denied = await guard();
  if (denied) return { ok: false, error: denied };
  try {
    await getDb().delete(ggReviews).where(eq(ggReviews.id, String(id)));
    return { ok: true };
  } catch (e) {
    return { ok: false, error: friendlyDbError(e) };
  }
}

/** Copy the built-in sample reviews into the database so they can be edited. */
export async function importDefaultReviewsAction(): Promise<ActionResult> {
  const denied = await guard();
  if (denied) return { ok: false, error: denied };
  try {
    await getDb()
      .insert(ggReviews)
      .values(
        DEFAULT_REVIEWS.map((r, i) => ({
          id: `rv-${r.id}`,
          name: r.name,
          city: r.city,
          text: r.text,
          product: r.product,
          rating: r.rating,
          published: true,
          sort_order: i,
        }))
      )
      .onConflictDoNothing();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: friendlyDbError(e) };
  }
}

/* ------------------- messages & subscribers ------------------- */

export async function setMessageReadAction(id: number, read: boolean): Promise<ActionResult> {
  const denied = await guard();
  if (denied) return { ok: false, error: denied };
  try {
    await getDb().update(ggMessages).set({ is_read: !!read }).where(eq(ggMessages.id, Number(id)));
    return { ok: true };
  } catch (e) {
    return { ok: false, error: friendlyDbError(e) };
  }
}

export async function deleteMessageAction(id: number): Promise<ActionResult> {
  const denied = await guard();
  if (denied) return { ok: false, error: denied };
  try {
    await getDb().delete(ggMessages).where(eq(ggMessages.id, Number(id)));
    return { ok: true };
  } catch (e) {
    return { ok: false, error: friendlyDbError(e) };
  }
}

export async function deleteSubscriberAction(email: string): Promise<ActionResult> {
  const denied = await guard();
  if (denied) return { ok: false, error: denied };
  try {
    await getDb().delete(ggSubscribers).where(eq(ggSubscribers.email, String(email)));
    return { ok: true };
  } catch (e) {
    return { ok: false, error: friendlyDbError(e) };
  }
}


/* ---------------------------- categories ---------------------------- */

async function readCategoryOverrides(): Promise<Record<string, CategoryOverride>> {
  const rows = await getDb().select().from(ggSettings).where(eq(ggSettings.key, "categories")).limit(1);
  const d = rows[0]?.data;
  return d && typeof d === "object" ? (d as Record<string, CategoryOverride>) : {};
}

async function writeCategoryOverrides(all: Record<string, CategoryOverride>) {
  await getDb()
    .insert(ggSettings)
    .values({ key: "categories", data: all })
    .onConflictDoUpdate({ target: ggSettings.key, set: { data: all, updated_at: new Date() } });
}

export async function saveCategoryAction(payload: { slug: string; data: unknown }): Promise<ActionResult> {
  const denied = await guard();
  if (denied) return { ok: false, error: denied };
  const slug = String(payload.slug);
  if (!CATEGORY_PAGES.some((c) => c.slug === slug)) return { ok: false, error: "Unknown category." };

  const d = (payload.data ?? {}) as Record<string, unknown>;
  const h1 = str(d.h1, 120);
  const metaTitle = str(d.metaTitle, 90);
  const metaDescription = str(d.metaDescription, 220);
  const intro = list(d.intro, 5).map((x) => x.slice(0, 1500));
  const tips = list(d.tips, 8).map((x) => x.slice(0, 300));
  if (!h1 || !metaTitle || !metaDescription) {
    return { ok: false, error: "Heading, Google title and Google description can't be empty." };
  }
  if (intro.length === 0) return { ok: false, error: "Add at least one intro paragraph." };

  try {
    const all = await readCategoryOverrides();
    all[slug] = { h1, metaTitle, metaDescription, intro, tips };
    await writeCategoryOverrides(all);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: friendlyDbError(e) };
  }
}

export async function resetCategoryAction(slug: string): Promise<ActionResult> {
  const denied = await guard();
  if (denied) return { ok: false, error: denied };
  try {
    const all = await readCategoryOverrides();
    delete all[String(slug)];
    await writeCategoryOverrides(all);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: friendlyDbError(e) };
  }
}

/* ------------------------- policy pages ------------------------- */

async function readPolicyOverrides(): Promise<Record<string, PolicyOverride>> {
  const rows = await getDb().select().from(ggSettings).where(eq(ggSettings.key, "pages")).limit(1);
  const d = rows[0]?.data;
  return d && typeof d === "object" ? (d as Record<string, PolicyOverride>) : {};
}

async function writePolicyOverrides(all: Record<string, PolicyOverride>) {
  await getDb()
    .insert(ggSettings)
    .values({ key: "pages", data: all })
    .onConflictDoUpdate({ target: ggSettings.key, set: { data: all, updated_at: new Date() } });
}

export async function savePolicyAction(payload: { slug: string; data: unknown }): Promise<ActionResult> {
  const denied = await guard();
  if (denied) return { ok: false, error: denied };
  const slug = String(payload.slug);
  if (!POLICY_PAGES.some((p) => p.slug === slug)) return { ok: false, error: "Unknown page." };

  const d = (payload.data ?? {}) as Record<string, unknown>;
  const title = str(d.title, 120);
  const metaDescription = str(d.metaDescription, 220);
  const intro = typeof d.intro === "string" ? d.intro.trim().slice(0, 3000) : "";
  if (!title || !metaDescription) return { ok: false, error: "Title and Google description can't be empty." };

  const rawSections = Array.isArray(d.sections) ? d.sections : [];
  const sections = rawSections
    .map((s) => {
      const o = (s ?? {}) as Record<string, unknown>;
      return {
        heading: str(o.heading, 160),
        body: (typeof o.body === "string" ? o.body : "").trim().slice(0, 12000),
      };
    })
    .filter((s) => s.heading)
    .slice(0, 30);
  if (sections.length === 0) return { ok: false, error: "Add at least one section with a heading." };

  // "Last updated" is set automatically (Indian date).
  const updated = new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString().slice(0, 10);

  try {
    const all = await readPolicyOverrides();
    all[slug] = { title, metaDescription, intro, sections, updated };
    await writePolicyOverrides(all);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: friendlyDbError(e) };
  }
}

export async function resetPolicyAction(slug: string): Promise<ActionResult> {
  const denied = await guard();
  if (denied) return { ok: false, error: denied };
  try {
    const all = await readPolicyOverrides();
    delete all[String(slug)];
    await writePolicyOverrides(all);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: friendlyDbError(e) };
  }
}

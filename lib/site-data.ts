import "server-only";
import { cache } from "react";
import { and, asc, count, desc, eq, gte, max, sql } from "drizzle-orm";
import { dbConfigured, getDb } from "@/db";
import {
  ggClicks,
  ggMessages,
  ggReviews,
  ggSettings,
  ggSubscribers,
} from "@/db/schema";
import { friendlyDbError, withRetry } from "@/lib/catalog";
import {
  DEFAULT_REVIEWS,
  DEFAULT_SETTINGS,
  mergeSettings,
  type Review,
  type SiteSettings,
} from "@/lib/settings";

export const SETTINGS_KEY = "site";

/** Site content (texts, contact info, banner…). Falls back to the defaults. */
export const getSettings = cache(async (): Promise<SiteSettings> => {
  if (!dbConfigured()) return DEFAULT_SETTINGS;
  try {
    const rows = await withRetry(() =>
      getDb().select().from(ggSettings).where(eq(ggSettings.key, SETTINGS_KEY)).limit(1)
    );
    return mergeSettings(rows[0]?.data);
  } catch (e) {
    console.error("[site-data] settings:", friendlyDbError(e));
    return DEFAULT_SETTINGS;
  }
});

export type AdminReview = Review & { published: boolean; sort_order: number };

async function allReviewRows(): Promise<AdminReview[]> {
  const rows = await getDb()
    .select()
    .from(ggReviews)
    .orderBy(asc(ggReviews.sort_order), desc(ggReviews.created_at));
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    city: r.city,
    text: r.text,
    product: r.product,
    rating: r.rating,
    published: r.published,
    sort_order: r.sort_order,
  }));
}

/** Reviews for the homepage: the client's published ones, else the built-ins. */
export const getPublishedReviews = cache(async (): Promise<Review[]> => {
  if (!dbConfigured()) return DEFAULT_REVIEWS;
  try {
    const rows = await withRetry(allReviewRows);
    if (rows.length === 0) return DEFAULT_REVIEWS;
    return rows.filter((r) => r.published);
  } catch {
    return DEFAULT_REVIEWS;
  }
});

type Result<T> = { data: T; error?: string };

async function guarded<T>(empty: T, fn: () => Promise<T>): Promise<Result<T>> {
  if (!dbConfigured()) {
    return { data: empty, error: "Database isn't configured yet (set DATABASE_URL)." };
  }
  try {
    return { data: await withRetry(fn) };
  } catch (e) {
    return { data: empty, error: friendlyDbError(e) };
  }
}

export const getAdminReviews = () => guarded<AdminReview[]>([], allReviewRows);

export type MessageRow = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export const getAdminMessages = () =>
  guarded<MessageRow[]>([], async () => {
    const rows = await getDb()
      .select()
      .from(ggMessages)
      .orderBy(desc(ggMessages.created_at))
      .limit(500);
    return rows.map((r) => ({ ...r, created_at: r.created_at.toISOString() }));
  });

export async function getUnreadMessageCount(): Promise<number> {
  if (!dbConfigured()) return 0;
  try {
    const r = await getDb()
      .select({ n: count() })
      .from(ggMessages)
      .where(eq(ggMessages.is_read, false));
    return r[0]?.n ?? 0;
  } catch {
    return 0;
  }
}

export type SubscriberRow = { email: string; created_at: string };

export const getAdminSubscribers = () =>
  guarded<SubscriberRow[]>([], async () => {
    const rows = await getDb()
      .select()
      .from(ggSubscribers)
      .orderBy(desc(ggSubscribers.created_at))
      .limit(5000);
    return rows.map((r) => ({ email: r.email, created_at: r.created_at.toISOString() }));
  });

export type Analytics = {
  days: number;
  total: number;
  byMarketplace: { marketplace: string; n: number }[];
  topProducts: {
    product_id: string;
    name: string;
    total: number;
    amazon: number;
    flipkart: number;
    meesho: number;
  }[];
  daily: { day: string; n: number }[];
};

const EMPTY_ANALYTICS: Analytics = {
  days: 30,
  total: 0,
  byMarketplace: [],
  topProducts: [],
  daily: [],
};

/** Marketplace-button clicks over the last `days` days. */
export const getAnalytics = (days = 30) =>
  guarded<Analytics>({ ...EMPTY_ANALYTICS, days }, async () => {
    const db = getDb();
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const inRange = gte(ggClicks.created_at, since);

    const byMarketplace = await db
      .select({ marketplace: ggClicks.marketplace, n: count() })
      .from(ggClicks)
      .where(inRange)
      .groupBy(ggClicks.marketplace)
      .orderBy(desc(count()));

    const perProduct = await db
      .select({
        product_id: ggClicks.product_id,
        name: max(ggClicks.product_name),
        marketplace: ggClicks.marketplace,
        n: count(),
      })
      .from(ggClicks)
      .where(inRange)
      .groupBy(ggClicks.product_id, ggClicks.marketplace);

    const map = new Map<string, Analytics["topProducts"][number]>();
    for (const r of perProduct) {
      const row =
        map.get(r.product_id) ??
        { product_id: r.product_id, name: r.name ?? r.product_id, total: 0, amazon: 0, flipkart: 0, meesho: 0 };
      row.total += r.n;
      if (r.marketplace === "amazon" || r.marketplace === "flipkart" || r.marketplace === "meesho") {
        row[r.marketplace] += r.n;
      }
      map.set(r.product_id, row);
    }

    const dailyRows = await db
      .select({
        day: sql<string>`to_char(date_trunc('day', ${ggClicks.created_at} at time zone 'Asia/Kolkata'), 'YYYY-MM-DD')`,
        n: count(),
      })
      .from(ggClicks)
      .where(and(inRange))
      .groupBy(sql`1`)
      .orderBy(sql`1`);

    return {
      days,
      total: byMarketplace.reduce((s, r) => s + r.n, 0),
      byMarketplace,
      topProducts: [...map.values()].sort((a, b) => b.total - a.total).slice(0, 15),
      daily: dailyRows,
    };
  });

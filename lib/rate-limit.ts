import "server-only";
import { lt, sql } from "drizzle-orm";
import { dbConfigured, getDb } from "@/db";
import { ggRateLimits } from "@/db/schema";

/**
 * Tiny in-memory sliding-window limiter (per server process). Used for the very
 * frequent click tracker and as a fallback when the database is unreachable.
 */
const buckets = new Map<string, number[]>();

export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= max) {
    buckets.set(key, hits);
    return false;
  }
  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (!v.some((t) => now - t < windowMs)) buckets.delete(k);
  }
  return true;
}

/** Remove counters that expired more than a day ago (run now and then, not on every call). */
function maybeCleanup() {
  if (Math.random() > 0.02) return;
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  getDb()
    .delete(ggRateLimits)
    .where(lt(ggRateLimits.reset_at, cutoff))
    .catch(() => {});
}

/**
 * Database-backed fixed-window limiter. Returns true when the call is allowed.
 * Survives restarts and works across several server instances. If the database
 * can't be reached it falls back to the in-memory limiter instead of failing.
 */
export async function rateLimitPersistent(key: string, max: number, windowMs: number): Promise<boolean> {
  if (!dbConfigured()) return rateLimit(key, max, windowMs);
  try {
    const resetAt = new Date(Date.now() + windowMs).toISOString();
    const rows = await getDb()
      .insert(ggRateLimits)
      .values({ key, count: 1, reset_at: new Date(resetAt) })
      .onConflictDoUpdate({
        target: ggRateLimits.key,
        set: {
          // window over -> start again at 1; otherwise keep counting in the same window
          count: sql`case when ${ggRateLimits.reset_at} <= now() then 1 else ${ggRateLimits.count} + 1 end`,
          reset_at: sql`case when ${ggRateLimits.reset_at} <= now() then ${resetAt}::timestamptz else ${ggRateLimits.reset_at} end`,
        },
      })
      .returning({ count: ggRateLimits.count });
    maybeCleanup();
    return (rows[0]?.count ?? 1) <= max;
  } catch {
    return rateLimit(key, max, windowMs);
  }
}

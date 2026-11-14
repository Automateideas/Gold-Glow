import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { and, eq, gt, sql } from "drizzle-orm";
import { dbConfigured, getDb } from "@/db";
import { ggRateLimits } from "@/db/schema";

/**
 * Admin auth without any third-party auth service.
 *
 * The admin ID + password live in environment variables (ADMIN_USERNAME,
 * ADMIN_PASSWORD). The server checks the login form against them, then hands
 * out a signed, httpOnly cookie. Every admin action re-verifies that cookie.
 */

export const SESSION_COOKIE = "gg_admin";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

const adminUser = () => process.env.ADMIN_USERNAME ?? "";
const adminPass = () => process.env.ADMIN_PASSWORD ?? "";

/** True when an admin ID + password have been set in the environment. */
export const adminConfigured = () =>
  adminUser().length > 0 && adminPass().length > 0;

const sha = (s: string) => createHash("sha256").update(s).digest();

/** Constant-time string comparison (hashes first so lengths always match). */
function safeEqual(a: string, b: string) {
  return timingSafeEqual(sha(a), sha(b));
}

export function checkCredentials(username: string, password: string): boolean {
  if (!adminConfigured()) return false;
  // Evaluate both so timing doesn't reveal which one was wrong.
  const okUser = safeEqual(username.trim(), adminUser());
  const okPass = safeEqual(password, adminPass());
  return okUser && okPass;
}

/** HMAC key for session cookies. Set ADMIN_SESSION_SECRET for a dedicated one. */
function secret() {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    sha(`gg-admin|${adminUser()}|${adminPass()}`).toString("hex")
  );
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function createToken() {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = `v1.${exp}`;
  return `${payload}.${sign(payload)}`;
}

function verifyToken(token: string | undefined): boolean {
  if (!token || !adminConfigured()) return false;
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "v1") return false;
  const payload = `${parts[0]}.${parts[1]}`;
  const given = Buffer.from(parts[2]);
  const expected = Buffer.from(sign(payload));
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return false;
  const exp = Number(parts[1]);
  return Number.isFinite(exp) && exp > Math.floor(Date.now() / 1000);
}

export async function startAdminSession() {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, createToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function endAdminSession() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export async function isAdminSession(): Promise<boolean> {
  const jar = await cookies();
  return verifyToken(jar.get(SESSION_COOKIE)?.value);
}

/* ------------------------------------------------------------------ */
/* Brute-force guard: 5 wrong attempts per IP -> locked for 15 minutes. */
/* Stored in the database (survives restarts); memory is the fallback. */
/* ------------------------------------------------------------------ */
const MAX_FAILS = 5;
const LOCK_MS = 15 * 60 * 1000;
const lockKey = (ip: string) => `login:${ip}`;
const fails = new Map<string, { n: number; until: number }>();

export async function isLockedOut(ip: string): Promise<boolean> {
  if (dbConfigured()) {
    try {
      const rows = await getDb()
        .select({ count: ggRateLimits.count })
        .from(ggRateLimits)
        .where(and(eq(ggRateLimits.key, lockKey(ip)), gt(ggRateLimits.reset_at, sql`now()`)))
        .limit(1);
      return (rows[0]?.count ?? 0) >= MAX_FAILS;
    } catch {
      /* fall through to memory */
    }
  }
  const rec = fails.get(ip);
  if (!rec) return false;
  if (rec.until < Date.now()) {
    fails.delete(ip);
    return false;
  }
  return rec.n >= MAX_FAILS;
}

export async function recordFailure(ip: string): Promise<void> {
  if (dbConfigured()) {
    try {
      const until = new Date(Date.now() + LOCK_MS).toISOString();
      await getDb()
        .insert(ggRateLimits)
        .values({ key: lockKey(ip), count: 1, reset_at: new Date(until) })
        .onConflictDoUpdate({
          target: ggRateLimits.key,
          set: {
            count: sql`case when ${ggRateLimits.reset_at} <= now() then 1 else ${ggRateLimits.count} + 1 end`,
            reset_at: sql`${until}::timestamptz`, // each miss extends the lock window
          },
        });
      return;
    } catch {
      /* fall through to memory */
    }
  }
  const rec = fails.get(ip) ?? { n: 0, until: 0 };
  rec.n += 1;
  rec.until = Date.now() + LOCK_MS;
  fails.set(ip, rec);
}

export async function clearFailures(ip: string): Promise<void> {
  fails.delete(ip);
  if (!dbConfigured()) return;
  try {
    await getDb().delete(ggRateLimits).where(eq(ggRateLimits.key, lockKey(ip)));
  } catch {
    /* ignore */
  }
}

import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

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
/* Brute-force guard: 5 wrong attempts per IP → locked for 15 minutes. */
/* ------------------------------------------------------------------ */
const MAX_FAILS = 5;
const LOCK_MS = 15 * 60 * 1000;
const fails = new Map<string, { n: number; until: number }>();

export function isLockedOut(key: string): boolean {
  const rec = fails.get(key);
  if (!rec) return false;
  if (rec.until && rec.until < Date.now()) {
    fails.delete(key);
    return false;
  }
  return rec.n >= MAX_FAILS;
}

export function recordFailure(key: string) {
  const rec = fails.get(key) ?? { n: 0, until: 0 };
  rec.n += 1;
  rec.until = Date.now() + LOCK_MS;
  fails.set(key, rec);
}

export function clearFailures(key: string) {
  fails.delete(key);
}

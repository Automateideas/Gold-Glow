"use server";

import { headers } from "next/headers";
import { dbConfigured, getDb } from "@/db";
import { ggMessages, ggSubscribers } from "@/db/schema";
import { friendlyDbError } from "@/lib/catalog";
import { rateLimit } from "@/lib/rate-limit";

export type FormResult = { ok: true; message: string } | { ok: false; error: string };

const clean = (v: FormDataEntryValue | null, max: number) =>
  (typeof v === "string" ? v : "").replace(/\s+/g, " ").trim().slice(0, max);
const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s) && s.length <= 254;

async function clientIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

/** Contact page form → saved in the database (Admin → Messages). */
export async function submitContactAction(formData: FormData): Promise<FormResult> {
  // Honeypot: real visitors never fill this hidden field.
  if (clean(formData.get("website"), 100)) return { ok: true, message: "Thanks!" };

  const name = clean(formData.get("name"), 120);
  const email = clean(formData.get("email"), 254).toLowerCase();
  const subject = clean(formData.get("subject"), 200);
  const message = (typeof formData.get("message") === "string" ? (formData.get("message") as string) : "")
    .trim()
    .slice(0, 4000);

  if (!name || !isEmail(email) || !message) {
    return { ok: false, error: "Please fill in your name, a valid email and a message." };
  }
  if (!rateLimit(`contact:${await clientIp()}`, 5, 60 * 60 * 1000)) {
    return { ok: false, error: "Too many messages from your network. Please try again later." };
  }
  if (!dbConfigured()) {
    return { ok: false, error: "Messages are unavailable right now. Please email us instead." };
  }
  try {
    await getDb().insert(ggMessages).values({ name, email, subject, message });
    return { ok: true, message: "Our care team will get back to you within 24 hours." };
  } catch (e) {
    console.error("[contact]", friendlyDbError(e));
    return { ok: false, error: "Couldn't send your message. Please try again." };
  }
}

/** Footer "Join the Glow Club" form → saved in the database (Admin → Subscribers). */
export async function subscribeAction(formData: FormData): Promise<FormResult> {
  if (clean(formData.get("website"), 100)) return { ok: true, message: "You're in!" };

  const email = clean(formData.get("email"), 254).toLowerCase();
  if (!isEmail(email)) return { ok: false, error: "Please enter a valid email address." };
  if (!rateLimit(`sub:${await clientIp()}`, 5, 60 * 60 * 1000)) {
    return { ok: false, error: "Too many attempts. Please try again later." };
  }
  if (!dbConfigured()) return { ok: false, error: "Sign-ups are unavailable right now." };
  try {
    await getDb().insert(ggSubscribers).values({ email }).onConflictDoNothing();
    return { ok: true, message: "You're on the list — welcome to the Glow Club!" };
  } catch (e) {
    console.error("[subscribe]", friendlyDbError(e));
    return { ok: false, error: "Couldn't sign you up. Please try again." };
  }
}

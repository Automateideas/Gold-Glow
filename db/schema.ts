import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/**
 * Gold & Glow product catalogue. Property names are snake_case on purpose so a
 * row maps 1:1 to `ProductRow` in lib/catalog-map.ts.
 *
 * RLS is enabled with no policies, so the Supabase public API (anon/publishable
 * key) can't read or write this table — only the server (via DATABASE_URL) can.
 */
export const ggProducts = pgTable("gg_products", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline").notNull().default(""),
  category: text("category").notNull().default("Face Wash"),
  price: integer("price").notNull().default(0),
  compare_at: integer("compare_at"),
  size: text("size").notNull().default(""),
  rating: numeric("rating", { precision: 2, scale: 1, mode: "number" })
    .notNull()
    .default(4.5),
  reviews: integer("reviews").notNull().default(0),
  best_seller: boolean("best_seller").notNull().default(false),
  is_new: boolean("is_new").notNull().default(false),
  in_hero: boolean("in_hero").notNull().default(false),
  published: boolean("published").notNull().default(true),
  images: text("images").array().notNull().default([]),
  shade: text("shade").notNull().default("335 82% 46%"),
  short: text("short").notNull().default(""),
  description: text("description").notNull().default(""),
  key_ingredients: text("key_ingredients").array().notNull().default([]),
  benefits: text("benefits").array().notNull().default([]),
  how_to_use: text("how_to_use").notNull().default(""),
  skin_type: text("skin_type").notNull().default(""),
  links: jsonb("links").$type<Record<string, string>>().notNull().default({}),
  sort_order: integer("sort_order").notNull().default(0),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
}).enableRLS();

export type GgProductRow = typeof ggProducts.$inferSelect;
export type GgProductInsert = typeof ggProducts.$inferInsert;

/** Customer reviews shown on the homepage ("Glow stories"). */
export const ggReviews = pgTable("gg_reviews", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  city: text("city").notNull().default(""),
  text: text("text").notNull(),
  product: text("product").notNull().default(""),
  rating: integer("rating").notNull().default(5),
  published: boolean("published").notNull().default(true),
  sort_order: integer("sort_order").notNull().default(0),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}).enableRLS();

/** Messages sent through the Contact page form. */
export const ggMessages = pgTable("gg_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull().default(""),
  message: text("message").notNull(),
  is_read: boolean("is_read").notNull().default(false),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}).enableRLS();

/** "Join the Glow Club" newsletter signups. */
export const ggSubscribers = pgTable("gg_subscribers", {
  email: text("email").primaryKey(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}).enableRLS();

/** One row per click on a Buy-on-marketplace button (for the Analytics tab). */
export const ggClicks = pgTable(
  "gg_clicks",
  {
    id: serial("id").primaryKey(),
    product_id: text("product_id").notNull(),
    product_name: text("product_name").notNull().default(""),
    marketplace: text("marketplace").notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("gg_clicks_created_idx").on(t.created_at)]
).enableRLS();

/** Editable site content (single row, key "site"): texts, contact info, banner… */
export const ggSettings = pgTable("gg_settings", {
  key: text("key").primaryKey(),
  data: jsonb("data").$type<Record<string, unknown>>().notNull().default({}),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}).enableRLS();

/**
 * Counters for rate limits (login lock-out, contact and newsletter forms). Kept in
 * the database so a server restart or a second server instance can't reset them.
 */
export const ggRateLimits = pgTable("gg_rate_limits", {
  key: text("key").primaryKey(),
  count: integer("count").notNull().default(0),
  reset_at: timestamp("reset_at", { withTimezone: true }).notNull(),
}).enableRLS();

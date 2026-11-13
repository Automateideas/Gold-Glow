import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgTable,
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

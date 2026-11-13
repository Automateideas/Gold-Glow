import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";

// Load .env.local / .env the same way Next.js does.
loadEnvConfig(process.cwd());

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  // Only ever touch our own tables — never other tables in the same project.
  tablesFilter: ["gg_*"],
  dbCredentials: { url: process.env.SUPABASE_URL ?? "" },
});

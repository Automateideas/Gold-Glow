// Applies the SQL files in ./drizzle to DATABASE_URL (run: npm run db:migrate).
import { createRequire } from "node:module";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const require = createRequire(import.meta.url);
require("@next/env").loadEnvConfig(process.cwd());

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set in .env.local");
  process.exit(1);
}

const sql = postgres(url, { prepare: false, max: 1, connect_timeout: 20 });
try {
  await migrate(drizzle(sql), { migrationsFolder: "./drizzle" });
  console.log("✔ Database is up to date (gg_products ready).");
} catch (e) {
  const err = e?.cause ?? e;
  console.error("✘ Migration failed:", err?.code ?? "", err?.message ?? e);
  process.exitCode = 1;
} finally {
  await sql.end({ timeout: 5 });
}

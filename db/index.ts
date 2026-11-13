import "server-only";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export const databaseUrl = () => process.env.DATABASE_URL ?? "";

/** True when a Postgres connection string is present. */
export const dbConfigured = () => databaseUrl().length > 0;

type Db = PostgresJsDatabase<typeof schema>;
type Cache = { url: string; db: Db; end: () => Promise<void> };
const globalForDb = globalThis as unknown as { __ggDbPool?: Cache };

/**
 * Lazily-created Drizzle client, reused across hot reloads. It is keyed by the
 * connection string, so editing DATABASE_URL in .env.local takes effect without
 * restarting the dev server (the old pool is closed).
 */
export function getDb(): Db {
  const url = databaseUrl();
  const cached = globalForDb.__ggDbPool;
  if (cached && cached.url === url) return cached.db;

  if (cached) void Promise.resolve(cached.end?.()).catch(() => {});

  // prepare:false keeps it compatible with Supabase's transaction pooler.
  const client = postgres(url, { prepare: false, max: 5, idle_timeout: 20, connect_timeout: 15 });
  const db = drizzle(client, { schema });
  globalForDb.__ggDbPool = { url, db, end: () => client.end({ timeout: 2 }) };
  return db;
}

export { schema };

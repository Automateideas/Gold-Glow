import "server-only";
import { createClient } from "@supabase/supabase-js";
import { supabaseServiceKey, supabaseUrl } from "./env";

/**
 * Server-side Supabase client using the service-role key. Used for storefront
 * reads and every admin write/upload. Never cached, so admin edits show up on
 * the storefront immediately. Row-level security stays ON with no public
 * policies, so the database is unreachable except through this server.
 */
export function createAdminSupabase() {
  return createClient(supabaseUrl(), supabaseServiceKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) =>
        fetch(input, { ...init, cache: "no-store" }),
    },
  });
}

import "server-only";

/**
 * Server-only Supabase settings, read lazily from the environment. The
 * service-role key never reaches the browser: only server components, server
 * actions and route handlers import this file.
 */
export const supabaseUrl = () =>
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseServiceKey = () => process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

/** True when the env vars needed to talk to the database are present. */
export const supabaseConfigured = () =>
  supabaseUrl().length > 0 && supabaseServiceKey().length > 0;

/** Storage bucket that holds admin-uploaded product images (public read). */
export const PRODUCT_IMAGE_BUCKET = "gg-product-images";

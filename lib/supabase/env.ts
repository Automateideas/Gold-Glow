import "server-only";

/**
 * Server-only Supabase settings for IMAGE STORAGE (the product data itself
 * goes through Drizzle + DATABASE_URL, see /db). Read lazily from the
 * environment. The secret key never reaches the browser: only route handlers
 * import this file.
 */
export const supabaseUrl = () =>
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseServiceKey = () =>
  process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

/** True when the env vars needed for image uploads (Supabase Storage) are present. */
export const supabaseConfigured = () =>
  supabaseUrl().length > 0 && supabaseServiceKey().length > 0;

/** Storage bucket that holds admin-uploaded product images (public read). */
export const PRODUCT_IMAGE_BUCKET = "gg-product-images";

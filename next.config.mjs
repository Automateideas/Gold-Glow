// Allow next/image to load admin-uploaded product images from YOUR Supabase project.
// The hostname is derived from SUPABASE_URL, so nothing is hard-coded.
const supabaseHost = (() => {
  try {
    return new URL(
      process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
    ).hostname;
  } catch {
    return null;
  }
})();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Lets a second dev server run side-by-side without sharing the .next folder.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  async headers() {
    return [
      {
        // A service worker must never be cached, or updates would never reach visitors.
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self'" },
        ],
      },
      {
        source: "/offline.html",
        headers: [{ key: "Cache-Control", value: "no-cache" }],
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: supabaseHost
      ? [
          {
            protocol: "https",
            hostname: supabaseHost,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
};

export default nextConfig;

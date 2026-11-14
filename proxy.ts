import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Adds a Content-Security-Policy to every page. Each request gets a fresh random
 * nonce, and Next.js stamps it on its own scripts, so only our code can run
 * scripts (this blocks injected <script> tags, i.e. XSS). Production only:
 * in development React needs eval and hot reload needs websockets.
 *
 * Next.js 16 calls this file "proxy" (it used to be "middleware").
 */
export function proxy(request: NextRequest) {
  if (process.env.NODE_ENV !== "production") return NextResponse.next();

  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  const csp = [
    "default-src 'self'",
    // 'strict-dynamic' lets the nonce'd Next.js scripts load their own chunks.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    // Inline style attributes (Radix UI, charts) need 'unsafe-inline'; scripts stay locked down.
    "style-src 'self' 'unsafe-inline'",
    // https: so admin-uploaded images (Supabase Storage) and banner links can show.
    "img-src 'self' blob: data: https:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "worker-src 'self'",
    "manifest-src 'self'",
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: [
    {
      // Pages only: skip APIs, build files, images and the static PWA/SEO files.
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|sw.js|offline.html|manifest.webmanifest|robots.txt|sitemap.xml|icons/|products/|marketplaces/|ecomLogo/|icon.png|apple-icon.png).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};

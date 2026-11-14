/* Gold & Glow service worker.
 *
 * Goals: installable app, instant repeat visits, and a friendly offline page.
 * It never caches the admin panel, API calls, form submissions or Next.js
 * data requests, so edits made in /admin show up straight away.
 *
 * Strategies
 *   pages (navigations)      network first, falls back to the last copy, then /offline.html
 *   /_next/static/*          cache first (files are hashed, so they never change)
 *   images, icons, fonts     stale-while-revalidate with a size limit
 *   everything else          straight to the network (not handled here)
 *
 * Bump VERSION to force every visitor onto a fresh cache.
 */
const VERSION = "v1";
const STATIC_CACHE = `gg-static-${VERSION}`;
const PAGE_CACHE = `gg-pages-${VERSION}`;
const IMAGE_CACHE = `gg-images-${VERSION}`;
const KEEP = [STATIC_CACHE, PAGE_CACHE, IMAGE_CACHE];

const OFFLINE_URL = "/offline.html";
const PRECACHE = [OFFLINE_URL, "/icons/icon-192.png", "/icons/icon-512.png"];

const MAX_PAGES = 30;
const MAX_IMAGES = 120;
const NETWORK_TIMEOUT_MS = 6000;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !KEEP.includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});

/** Keep a cache from growing forever: drop the oldest entries beyond `max`. */
async function trim(cacheName, max) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - max; i++) await cache.delete(keys[i]);
}

function fetchWithTimeout(request, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms);
    fetch(request).then(
      (res) => {
        clearTimeout(timer);
        resolve(res);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

async function networkFirstPage(request) {
  const cache = await caches.open(PAGE_CACHE);
  try {
    const response = await fetchWithTimeout(request, NETWORK_TIMEOUT_MS);
    // Only keep good, same-origin pages (not redirects or errors).
    if (response.ok && response.type === "basic") {
      cache.put(request, response.clone()).then(() => trim(PAGE_CACHE, MAX_PAGES));
    }
    return response;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;
    const offline = await caches.match(OFFLINE_URL);
    return offline || new Response("You are offline.", { status: 503, headers: { "Content-Type": "text/plain" } });
  }
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone());
  return response;
}

async function staleWhileRevalidate(request, cacheName, max) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const refresh = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone()).then(() => trim(cacheName, max));
      }
      return response;
    })
    .catch(() => undefined);
  return cached || (await refresh) || Response.error();
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const path = url.pathname;

  // Never touch the admin panel, APIs, server-action/RSC data requests or dev HMR.
  if (
    path.startsWith("/admin") ||
    path.startsWith("/api/") ||
    path.startsWith("/_next/webpack-hmr") ||
    url.searchParams.has("_rsc") ||
    request.headers.has("RSC") ||
    request.headers.has("Next-Action")
  ) {
    return;
  }

  // Page navigations
  if (request.mode === "navigate") {
    event.respondWith(networkFirstPage(request));
    return;
  }

  // Hashed build files never change
  if (path.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Images, icons and fonts
  if (
    path.startsWith("/_next/image") ||
    path.startsWith("/products/") ||
    path.startsWith("/marketplaces/") ||
    path.startsWith("/icons/") ||
    request.destination === "image" ||
    request.destination === "font"
  ) {
    event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE, MAX_IMAGES));
  }
});

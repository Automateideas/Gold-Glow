# Gold & Glow — Product Catalog

A modern, fully-responsive **product catalog / showcase website** for **Gold & Glow**
herbal cosmetics — _"precised care, poetic glow."_ Products are listed here, and each
one links out to **Amazon, Flipkart and Meesho** so customers buy on their favourite
marketplace. (No in-house cart/checkout — that's planned for later.)

Built with **Next.js 16 (App Router, Turbopack)**, **React 19**, **TypeScript**,
**Tailwind CSS v4**, and **shadcn/ui**-style components.

## ✨ Features

- **13 real products** across 6 categories (Face Wash, Body Lotion, Skin Cream,
  Talc & Powder, Toner & Mist, Aloe Gel) using the brand's actual product photography.
- **Marketplace links** — every product shows "Buy on Amazon / Flipkart / Meesho"
  buttons (product page) and quick colour-coded chips (product cards).
- **Homepage** — hero, category grid, bestsellers, talc feature banner, ingredient
  promise, customer reviews, newsletter.
- **Shop page** — live search, category filters, and sorting (featured / price / rating).
- **Product detail** — image gallery with thumbnails, benefits, "Where to buy"
  marketplace buttons, accordions (description, ingredients, how-to-use), related products.
- **About** and **Contact** pages (with FAQ + working demo form).
- Premium **Champagne Gold & Charcoal** theming, light/dark tokens, custom fonts
  (Playfair Display + Poppins), animations, SEO metadata.

## 🔗 Adding your marketplace links

Links live in [`lib/products.ts`](lib/products.ts). Until you add exact listing URLs,
every button automatically falls back to that marketplace's **search page** for the
product (brand + name), so nothing is ever a dead link.

To pin an exact listing, add a `links` field to any product:

```ts
{
  id: "gg-01",
  slug: "vitamin-c-face-wash",
  // …
  links: {
    amazon: "https://www.amazon.in/dp/XXXXXXXXXX",
    flipkart: "https://www.flipkart.com/…/p/XXXX",
    meesho: "https://www.meesho.com/…/p/XXXX",
  },
},
```

Any marketplace you leave out keeps using the search fallback.

## 🚀 Running the project

Install dependencies:

```bash
npm install
```

**Development**

```bash
npm run dev
```

**Production build & start**

```bash
npm run build
npm run start
```

Then open <http://localhost:3000>.

> ℹ️ **About the `&` in the folder name.** Because this folder is `Gold&Glow`, the
> default Next.js `.bin` shim breaks on Windows (npm resolves a truncated path like
> `F:\next\dist\bin\next`). To avoid this, the `package.json` scripts call Next's JS
> entry point directly (`node node_modules/next/dist/bin/next …`) instead of the `next`
> shim — so the standard `npm run dev` / `build` / `start` commands work normally.
> (Renaming the folder to something without `&`, e.g. `gold-and-glow`, also works and
> lets you use the plain `next` binary if you prefer.)

## 🗂 Project structure

```
app/
  layout.tsx            # Root layout: fonts, header/footer, toaster
  page.tsx              # Homepage
  shop/page.tsx         # Shop / catalog (reads ?category=)
  product/[slug]/       # Product detail (rendered live from the catalogue)
  admin/                # Admin panel (env-based login + server actions)
  api/admin/upload/     # Admin-only image upload → Supabase Storage
db/                     # Drizzle schema + client (gg_products)
  about/ contact/       # Content pages
  globals.css           # Brand design tokens + Tailwind
components/
  ui/                   # shadcn-style primitives (button, card, accordion…)
  marketplace-buttons.tsx  # "Buy on Amazon/Flipkart/Meesho" buttons + chips
  site-header, site-footer, product-card, product-detail, shop-client…
lib/
  products.ts           # Product catalog + brand info + marketplace link helpers
  utils.ts              # cn() + INR formatter
public/products/        # Product imagery
```

## 🔐 Admin panel (Drizzle + Supabase, no Supabase Auth)

An admin panel at **`/admin`** lets you add, edit and delete products (name, title,
description, price, category, images, marketplace links, flags) with image uploads.
Product data lives in **your own Supabase Postgres**, accessed through **Drizzle ORM**
(schema in [`db/schema.ts`](db/schema.ts)); product images go to Supabase Storage. The
storefront reads live from the database and **falls back to the built-in catalogue**
whenever the database isn't reachable or the table is still empty, so the site never breaks.

**How login works:** there is no Supabase Auth. The admin ID and password live in
`.env.local`; the site's own server checks the login form against them and sets a signed,
httpOnly cookie (7 days). Every admin action and image upload re-checks that cookie. Five
wrong attempts from one IP lock login for 15 minutes.

**Admin tabs** (`/admin`):

| Tab | What you can do |
| --- | --- |
| **Products** | Add, edit, delete, duplicate, search/filter; hide a product without deleting it; "Home carousel", Bestseller and New switches; image upload (auto-resized to WebP) |
| **Categories** | Heading, intro text, tips and Google title/description of each category page (`/shop/face-wash` …) |
| **Reviews** | The customer stories on the homepage (until you add your own, 3 built-in samples show) |
| **Pages** | Privacy Policy, Terms of Use, Return & Refund and Payment policy: edit sections, bold/bullets/links, auto "Last updated" |
| **Messages** | Everything sent through the Contact form, with unread count and one-click reply |
| **Subscribers** | Footer newsletter signups, with CSV download |
| **Analytics** | Clicks on the Buy-on-Amazon/Flipkart/Meesho buttons per product and marketplace (7/30/90 days) |
| **Settings** | Announcement bar, homepage heading and text, feature banner (with image), contact details (email, phone, address, hours), social links (Instagram, Facebook, YouTube, WhatsApp), Google title/description |

**One-time activation:**

1. **Create a Supabase project** for Gold & Glow (supabase.com → New project) and remember
   the database password.
2. **Fill `.env.local`** (copy from [`.env.example`](.env.example)):
   - `DATABASE_URL` — Dashboard → **Connect** → *Session pooler* URI, with
     `[YOUR-PASSWORD]` replaced by your database password.
   - `SUPABASE_URL` — Project URL, and `SUPABASE_SERVICE_ROLE_KEY` — Settings → API Keys →
     **secret key** (`sb_secret_...`; legacy *service_role* also works). Used only for image
     uploads. **Never the publishable key; secret, server-only.**
   - `NEXT_PUBLIC_SITE_URL` — your public website address (sitemap, Google & social previews).
   - `ADMIN_USERNAME` / `ADMIN_PASSWORD` — the login for `/admin`;
     `ADMIN_SESSION_SECRET` — long random string for signing the cookie.
3. **Create the tables:** `npm run db:migrate` (Drizzle applies `drizzle/0000_init.sql`: creates `gg_products` with row-level
   security on and no public policies).
4. Restart `npm run dev`, open **`/admin`**, sign in, and click **"Import starter
   catalogue"** to load the 13 built-in products. The image bucket is created automatically
   on the first upload.

Other commands: `npm run db:generate` (after editing `db/schema.ts`, then `db:migrate` again; SQL lives in `drizzle/`),
`npm run db:studio`. On Hostinger, set the same variables as environment variables for the
Node.js app instead of a file.

## 📱 Installable app (PWA)

The site can be installed on a phone or computer like an app (Add to Home Screen / Install app).

- **Manifest:** [`app/manifest.ts`](app/manifest.ts): name, brand colour, icons and Shop/Contact shortcuts.
- **Icons:** white "G" on brand pink, generated from the logo by `node scripts/generate-icons.mjs`
  (writes `public/icons/*`, `app/icon.png`, `app/apple-icon.png`). Re-run it if the logo changes.
- **Service worker:** [`public/sw.js`](public/sw.js). Pages are network-first (so admin edits show
  immediately) and fall back to the last visited copy, then to [`public/offline.html`](public/offline.html).
  Hashed build files are cache-first, images stale-while-revalidate. It never touches `/admin`, `/api`
  or form submissions. Change `VERSION` in `sw.js` to force everyone onto fresh caches.
- It only registers in **production** (`npm run build && npm run start`), over HTTPS or localhost.
- **Install button + popup:** an "Install" button in the header (and "Install app" in the footer) stays
  visible until the site runs as an installed app. It opens the browser's install dialog when one is
  available; otherwise it explains how to install from the browser menu (iPhone: Share → Add to Home
  Screen). A small "Install Gold & Glow" card also pops up 1.5 s after the browser says the site is
  installable (right away on iPhone); "Not now" hides it for 7 days
  (`components/install-app.tsx`).
- Chrome fires its install event only once, often before the page has hydrated, so a tiny head script in
  `app/layout.tsx` keeps it (`window.__ggInstall`), and the service worker registers right after
  hydration instead of waiting for the page `load` event. Both are what make the prompt arrive quickly.
- Installability can only be tested in production over HTTPS (Vercel) — not in `npm run dev`.

## 📱 Mobile tab bar

On phones (below the `lg` breakpoint) a bottom tab bar ([`components/mobile-bottom-nav.tsx`](components/mobile-bottom-nav.tsx)) gives
thumb-reach navigation: **Home · Shop · Categories · Contact · Search**. Categories opens a bottom sheet with the 6 categories (plus
All products and About us); Search opens `/shop?search=1` with the search box focused. The bar slides away while scrolling down and returns on
scroll up, respects the iPhone home-bar safe area, and is not shown in the admin panel or on desktop.

## 🚀 Deploying to Vercel

1. Import the repository in Vercel (framework: Next.js is detected automatically).
2. Add these **Environment Variables** (Production + Preview), the same names as in `.env.example`:
   `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (the `sb_secret_...` key),
   `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `NEXT_PUBLIC_SITE_URL` (your real domain).
3. Deploy. The database tables already exist in Supabase; for a new database run `npm run db:migrate` once from your computer.

Speed notes:
- [`vercel.json`](vercel.json) pins the functions to **Mumbai (`bom1`)**, next to the Supabase database
  (ap-south-1). Without it Vercel defaults to the US and every database call crosses the world.
- The catalogue, settings, reviews, category and policy text are kept in Next's data cache for 5 minutes, and
  every Save in the admin refreshes it straight away (`updateTag`). Pages are still rendered per request
  (needed for the CSP nonce), but they no longer wait on the database.
- The home-page animations can be switched off in **Admin → Settings → Homepage** ("Animated home page"),
  handy for comparing the animated and the calm version in front of a client.

## ✨ "Liquid Glow" home page (Anime.js)

The home page uses [Anime.js](https://animejs.com) v4 for a look built around the brand's *glow*, not generic fade-ups:

- **Liquid drop hero** ([`components/hero-stage.tsx`](components/hero-stage.tsx), [`hero-carousel.tsx`](components/hero-carousel.tsx), [`lib/blob.ts`](lib/blob.ts)):
  each product sits in a slowly morphing organic drop with a halo in the product's own accent colour
  (the "Accent colour" field in Admin → Products). When the product changes, that colour floods the whole hero
  from the drop outwards, so rose water turns the page pink, aloe green, honey gold.
- **Intro ripple:** the hero text is uncovered by a circle spreading out of the drop.
- **Light sweep:** section headings are revealed by a soft, feathered sweep of light.
- **Liquid fill:** card grids fill up from the bottom like liquid filling a bottle.
- **Cursor glow:** on desktop a soft gold light follows the mouse and lights up the card under it.

All of it only decorates server-rendered HTML (the content is in the page source for SEO) and lives in
[`components/home-motion.tsx`](components/home-motion.tsx). Nothing is hidden unless JavaScript flags the page
(`motion` class on `<html>`, set by a tiny nonce'd script in `app/layout.tsx`). Visitors who prefer reduced motion
get a static page (the drop keeps its shape but doesn't move), and if the animation code never starts the class
is removed after 4 s. To animate another block on the home page, add `data-reveal` (or `data-reveal-stagger` on a grid).

## 🔒 Security & code quality

- **Security headers** on every response (`next.config.mjs`): nosniff, X-Frame-Options DENY,
  Referrer-Policy, Permissions-Policy, COOP, and HSTS in production.
- **Content-Security-Policy with a per-request nonce** (`proxy.ts`, production only): only our own
  scripts can run. All pages are rendered per request (`dynamic = "force-dynamic"` in the root layout),
  which nonces need and which keeps editable header/footer text fresh.
- **Rate limits stored in the database** (`gg_rate_limits`): admin login locks for 15 minutes after
  5 wrong attempts per IP; contact and newsletter forms allow 5 per hour per IP. They survive restarts.
  The click tracker uses a lightweight in-memory limit.
- **Lint:** `npm run lint` (ESLint 9 + `eslint-config-next`, flat config in `eslint.config.mjs`).
  `next lint` no longer exists in Next.js 16.

## 🛠 Tech

Next.js 16 (Turbopack) · React 19 · TypeScript 5.9 · Tailwind CSS v4 · Drizzle ORM · Radix UI ·
lucide-react · sonner · class-variance-authority.

Tailwind v4 is configured the documented compatibility way: `app/globals.css` uses
`@import "tailwindcss"` + `@config "../tailwind.config.ts"`, PostCSS uses
`@tailwindcss/postcss`, and animation utilities come from `tw-animate-css`
(the v4 successor to `tailwindcss-animate`).

## 📝 Notes

- Product prices, descriptions and reviews are illustrative placeholder content —
  update `lib/products.ts` with your real catalog data and marketplace links.
- Prices are shown as **indicative MRP**; the actual price is whatever the marketplace
  lists, since all purchases happen on Amazon / Flipkart / Meesho.
- In-house cart & checkout are intentionally **not** included yet — this is a catalog
  that drives traffic to the marketplaces. A full store can be added later.

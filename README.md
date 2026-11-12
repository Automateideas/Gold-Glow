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

## 🔐 Admin panel (Supabase, no Supabase Auth)

An admin panel at **`/admin`** lets you add, edit and delete products (name, title,
description, price, category, images, marketplace links, flags) with image uploads —
backed by **your own Supabase project** (Postgres + Storage). The storefront reads live
from the database, and **falls back to the built-in catalogue** whenever Supabase isn't
reachable or the table is still empty, so the site never breaks.

**How login works:** there is no Supabase Auth. The admin ID and password live in
`.env.local`; the site's own server checks the login form against them and sets a signed,
httpOnly cookie (7 days). Every admin action and image upload re-checks that cookie. Five
wrong attempts from one IP lock login for 15 minutes.

**One-time activation:**

1. **Create a new Supabase project** for Gold & Glow (supabase.com → New project).
2. **Create the table + image bucket** — Supabase → **SQL Editor** → paste and run
   [`supabase/setup.sql`](supabase/setup.sql).
3. **Fill `.env.local`** (copy from [`.env.example`](.env.example)):
   - `SUPABASE_URL` — Project Settings → API → *Project URL*
   - `SUPABASE_SERVICE_ROLE_KEY` — same page → *service_role* key. **Secret, server-only:**
     never prefix it with `NEXT_PUBLIC_`, never commit it.
   - `ADMIN_USERNAME` / `ADMIN_PASSWORD` — the login you'll use on `/admin`
   - `ADMIN_SESSION_SECRET` — optional long random string for signing the cookie
4. Restart `npm run dev`, open **`/admin`**, sign in, and click **"Import starter
   catalogue"** to load the 13 built-in products — then edit them or add your own.

Row-level security is ON with no public policies, so the table can only be reached through
the site's server (service-role key). On Hostinger, set the same variables as environment
variables for the Node.js app instead of a file.

## 🛠 Tech

Next.js 16 (Turbopack) · React 19 · TypeScript 5.9 · Tailwind CSS v4 · Radix UI ·
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

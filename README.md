# Gold & Glow — E-commerce Store

A modern, fully-responsive e-commerce website for **Gold & Glow** herbal cosmetics —
_"precised care, poetic glow."_ Built with **Next.js 15 (App Router)**, **TypeScript**,
**Tailwind CSS**, and **shadcn/ui**-style components.

## ✨ Features

- **13 real products** across 6 categories (Face Wash, Body Lotion, Skin Cream,
  Talc & Powder, Toner & Mist, Aloe Gel) using the brand's actual product photography.
- **Homepage** — hero, category grid, bestsellers, talc feature banner, ingredient
  promise, customer reviews, newsletter.
- **Shop page** — live search, category filters, and sorting (featured / price / rating).
- **Product detail** — image gallery with thumbnails, quantity selector, benefits,
  accordions (description, ingredients, how-to-use), related products.
- **Cart** — slide-out drawer **and** full cart page, quantity controls, free-shipping
  progress bar, savings, persisted to `localStorage`.
- **Checkout** — shipping form, `GLOW20` coupon (20% off), order summary, and an order
  confirmation screen. _(Demo only — no real payment is processed.)_
- **About** and **Contact** pages (with FAQ + working demo form).
- Brand theming (magenta + champagne gold), light/dark tokens, custom fonts
  (Playfair Display + Poppins), toasts, animations, SEO metadata.

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
  layout.tsx            # Root layout: fonts, cart provider, header/footer, toaster
  page.tsx              # Homepage
  shop/page.tsx         # Shop (reads ?category=)
  product/[slug]/       # Product detail (static-generated per product)
  cart/ checkout/       # Cart & checkout
  about/ contact/       # Content pages
  globals.css           # Brand design tokens + Tailwind
components/
  ui/                   # shadcn-style primitives (button, card, sheet, accordion…)
  site-header, site-footer, product-card, cart-drawer, product-detail, shop-client…
lib/
  products.ts           # Product catalog + brand info
  cart-context.tsx      # Cart state (React Context + localStorage)
  utils.ts              # cn() + INR formatter
public/products/        # Product imagery
```

## 🛠 Tech

Next.js 15 · React 19 · TypeScript · Tailwind CSS 3.4 · Radix UI · lucide-react ·
sonner · class-variance-authority.

## 📝 Notes

- Product prices, descriptions and reviews are illustrative placeholder content —
  update `lib/products.ts` with your real catalog data.
- The checkout is a front-end demo; wire it to a real payment provider (Razorpay,
  Stripe, etc.) and an order backend before going live.

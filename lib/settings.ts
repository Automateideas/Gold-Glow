import { BRAND } from "@/lib/products";

/**
 * Editable site content. Everything here can be changed from Admin → Settings.
 * The defaults are exactly what the site showed before the admin existed, so an
 * empty database renders the same site as always.
 */
export type SiteSettings = {
  // Announcement bar (top of every page). **double stars** make text bold.
  announcementEnabled: boolean;
  announcement: string;

  // Homepage hero
  heroBadge: string;
  heroLine1: string;
  heroGold: string;
  heroAccent: string;
  heroDescription: string;
  showRating: boolean;
  ratingScore: string;
  ratingText: string;

  // Featured banner on the homepage (below bestsellers)
  bannerEnabled: boolean;
  bannerBadge: string;
  bannerTitle: string;
  bannerText: string;
  bannerFeatures: string[];
  bannerButtonLabel: string;
  bannerButtonLink: string;
  bannerImage: string;

  // Contact details (footer + contact page)
  email: string;
  phone: string;
  address: string;
  hours: string;

  // Social links (an empty one is hidden)
  instagram: string;
  facebook: string;
  youtube: string;

  // SEO
  seoTitle: string;
  seoDescription: string;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  announcementEnabled: true,
  announcement:
    "✨ Now available on **Amazon · Flipkart · Meesho** — shop from your favourite app",

  heroBadge: "New season glow drop",
  heroLine1: "Precised care,",
  heroGold: "poetic",
  heroAccent: "glow.",
  heroDescription:
    "Herbal-inspired skincare and body care that treats your skin gently and lights it up beautifully. Clean formulas, radiant results.",
  showRating: true,
  ratingScore: "4.8/5",
  ratingText: "from 2,300+ happy customers",

  bannerEnabled: true,
  bannerBadge: "Icy-touch collection",
  bannerTitle: "Stay fresh, all day long",
  bannerText:
    "Our Blossom talc range cools on contact and keeps you feeling confident — with rose, fresh floral and long-lasting deo freshness.",
  bannerFeatures: ["Icy cooling", "All-day dry", "Floral scent"],
  bannerButtonLabel: "Shop talc range",
  bannerButtonLink: "/shop?category=Talc+%26+Powder",
  bannerImage: "/products/talc-trio-banner.jpg",

  email: BRAND.supportEmail,
  phone: BRAND.phone,
  address: BRAND.address,
  hours: "Mon–Sat · 10am – 7pm IST",

  instagram: "",
  facebook: "",
  youtube: "",

  seoTitle: "Gold & Glow — Precised Care, Poetic Glow",
  seoDescription:
    "Gold & Glow herbal cosmetics — vitamin-C face wash, aloe & honey lotions, icy-touch talc, rose water and more. Precised care, poetic glow.",
};

/** Merge saved values over the defaults, ignoring anything of the wrong type. */
export function mergeSettings(saved: unknown): SiteSettings {
  const out: Record<string, unknown> = { ...DEFAULT_SETTINGS };
  if (saved && typeof saved === "object") {
    for (const [k, def] of Object.entries(DEFAULT_SETTINGS)) {
      const v = (saved as Record<string, unknown>)[k];
      if (v === undefined || v === null) continue;
      if (typeof def === "boolean" && typeof v === "boolean") out[k] = v;
      else if (typeof def === "string" && typeof v === "string") out[k] = v;
      else if (Array.isArray(def) && Array.isArray(v))
        out[k] = v.filter((x) => typeof x === "string");
    }
  }
  return out as SiteSettings;
}

/** A built-in review, used until the client adds their own in Admin → Reviews. */
export type Review = {
  id: string;
  name: string;
  city: string;
  text: string;
  product: string;
  rating: number;
};

export const DEFAULT_REVIEWS: Review[] = [
  {
    id: "r1",
    name: "Ananya R.",
    city: "Mumbai",
    text: "The Vitamin-C face wash gave my dull skin a proper glow in two weeks. It doesn't dry me out at all.",
    product: "Vitamin-C Face Wash",
    rating: 5,
  },
  {
    id: "r2",
    name: "Priya S.",
    city: "Bengaluru",
    text: "Honey & almond lotion is the softest thing ever — non-sticky and smells divine. My whole family uses it now.",
    product: "Honey & Almond Lotion",
    rating: 5,
  },
  {
    id: "r3",
    name: "Meera K.",
    city: "Delhi",
    text: "Rose water toner is a staple in my bag. Instantly refreshing and 100% pure. Repurchased 3 times!",
    product: "Premium Rose Water",
    rating: 5,
  },
];

export type Category =
  | "Face Wash"
  | "Body Lotion"
  | "Skin Cream"
  | "Talc & Powder"
  | "Toner & Mist"
  | "Aloe Gel";

export type Marketplace = "amazon" | "flipkart" | "meesho";

export type Product = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: Category;
  price: number;
  compareAt?: number;
  size: string;
  rating: number;
  reviews: number;
  bestSeller?: boolean;
  /** Show in the homepage hero carousel. */
  hero?: boolean;
  /** false = hidden from the storefront (draft). Defaults to true. */
  published?: boolean;
  /** ISO date of the last edit (from the database). */
  updatedAt?: string;
  new?: boolean;
  images: string[];
  shade: string; // accent color used in UI cards (hsl)
  short: string;
  description: string;
  keyIngredients: string[];
  benefits: string[];
  howToUse: string;
  skinType: string;
  /**
   * Direct marketplace product URLs. Leave a marketplace out (or set "#") and the
   * site falls back to that marketplace's SEARCH page for this product, so every
   * button works even before you have the exact listing link. Paste the real
   * product URLs here whenever your listings go live.
   */
  links?: Partial<Record<Marketplace, string>>;
};

// Brand
export const BRAND = {
  name: "Gold & Glow",
  tagline: "precised care, poetic glow",
  supportEmail: "care@goldandglow.in",
  phone: "+91 98100 00000",
  address: "Gold & Glow Herbals Cosmetics, New Delhi, India",
};

export const CATEGORIES: { name: Category; blurb: string; image: string }[] = [
  { name: "Face Wash", blurb: "Brighten & cleanse", image: "/products/vitamin-c-facewash.jpg" },
  { name: "Body Lotion", blurb: "48h moisture lock", image: "/products/aloe-lotion.jpg" },
  { name: "Skin Cream", blurb: "Deep nourishment", image: "/products/honey-almond-cream.jpg" },
  { name: "Talc & Powder", blurb: "Icy-touch freshness", image: "/products/rose-talc.jpg" },
  { name: "Toner & Mist", blurb: "Pure & natural", image: "/products/rose-water.jpg" },
  { name: "Aloe Gel", blurb: "Soothe & repair", image: "/products/aloe-gel.jpg" },
];

export const products: Product[] = [
  {
    id: "gg-01",
    slug: "vitamin-c-face-wash",
    hero: true,
    name: "Vitamin-C Face Wash",
    tagline: "Brighten • Cleanse • Glow",
    category: "Face Wash",
    price: 299,
    compareAt: 399,
    size: "100 ml",
    rating: 4.8,
    reviews: 214,
    bestSeller: true,
    images: [
      "/products/vitamin-c-facewash.jpg",
      "/products/vitamin-c-facewash-banner.jpg",
    ],
    shade: "28 90% 55%",
    short:
      "A zesty vitamin-C gel wash that deep-cleanses, purifies and reveals brighter, radiant skin.",
    description:
      "Wake up your complexion with a burst of vitamin-C. This gentle gel-to-lather face wash sweeps away dirt, oil and pollution while natural orange extracts help fade dullness and even out skin tone. Skin is left clean, fresh and visibly luminous — never tight or stripped.",
    keyIngredients: ["Vitamin-C", "Orange Extract", "Aloe Vera", "Glycerin"],
    benefits: [
      "Deep cleanses & purifies pores",
      "Brightens uneven skin tone",
      "Boosts natural radiance",
      "Non-drying, everyday-gentle formula",
    ],
    howToUse:
      "Massage a coin-sized amount onto damp skin in circular motions. Rinse with water. Use morning and night for best glow.",
    skinType: "All skin types",
  },
  {
    id: "gg-02",
    slug: "aloe-vera-body-lotion",
    name: "Aloe Vera Light Moisturizing Lotion",
    tagline: "Light • Non-sticky • Daily",
    category: "Body Lotion",
    price: 449,
    compareAt: 549,
    size: "800 gm",
    rating: 4.7,
    reviews: 168,
    bestSeller: true,
    images: ["/products/aloe-lotion.jpg"],
    shade: "140 55% 42%",
    short:
      "Feather-light aloe vera lotion that hydrates for 48 hours without any greasy after-feel.",
    description:
      "A cooling daily lotion powered by pure aloe vera. Its lightweight, fast-absorbing formula floods skin with lasting moisture and keeps it soft, supple and calm — perfect for face and body, all year round.",
    keyIngredients: ["Aloe Vera", "Vitamin-E", "Glycerin"],
    benefits: [
      "48-hour lightweight hydration",
      "Non-sticky, fast absorbing",
      "Soothes & softens skin",
      "For face & body",
    ],
    howToUse:
      "Apply generously over clean skin and massage until absorbed. Reapply as needed through the day.",
    skinType: "Normal to oily skin",
  },
  {
    id: "gg-03",
    slug: "honey-almond-body-lotion",
    name: "Honey & Almond Lotion",
    tagline: "Deeply hydrates & nourishes",
    category: "Body Lotion",
    price: 499,
    compareAt: 599,
    size: "800 gm",
    rating: 4.9,
    reviews: 192,
    images: ["/products/honey-almond-lotion.jpg"],
    shade: "40 70% 52%",
    short:
      "Rich honey and almond body lotion for deep, 24-hour moisturization and a golden glow.",
    description:
      "A nourishing blend of golden honey and pure almond oil that wraps dry skin in lasting comfort. Deeply hydrating yet non-sticky, it restores softness and leaves skin glowing with health.",
    keyIngredients: ["Honey", "Almond Oil", "Shea Butter", "Vitamin-E"],
    benefits: [
      "Deeply hydrates & nourishes",
      "24-hour moisturization",
      "Non-sticky, fast absorbing",
      "For all skin types",
    ],
    howToUse:
      "Smooth over clean, dry skin daily — ideally after a shower — and massage until fully absorbed.",
    skinType: "Dry to normal skin",
  },
  {
    id: "gg-04",
    slug: "fruit-body-lotion",
    name: "Fruit Skin Moisturizer Lotion",
    tagline: "Apple + Jojoba Oil",
    category: "Body Lotion",
    price: 469,
    compareAt: 569,
    size: "800 gm",
    rating: 4.6,
    reviews: 121,
    new: true,
    images: ["/products/fruit-lotion.jpg"],
    shade: "355 75% 52%",
    short:
      "Apple and jojoba oil lotion that locks in moisture for 48 hours of long-lasting hydration.",
    description:
      "Juicy apple extracts meet nourishing jojoba oil in a lotion built for 48-hour moisture lock. Skin drinks it in fast, staying soft, supple and naturally glowing all day long.",
    keyIngredients: ["Apple Extract", "Jojoba Oil", "Glycerin", "Vitamin-E"],
    benefits: [
      "48h moisture lock",
      "Long-lasting hydration",
      "Soft, supple, glowing skin",
      "Lightweight everyday wear",
    ],
    howToUse:
      "Apply over clean skin morning and evening. Massage gently until absorbed.",
    skinType: "All skin types",
  },
  {
    id: "gg-05",
    slug: "aloe-vera-skin-cream",
    hero: true,
    name: "Aloe Vera Light Moisturizing Cream",
    tagline: "Non-sticky 48h hydration",
    category: "Skin Cream",
    price: 249,
    compareAt: 299,
    size: "200 gm",
    rating: 4.7,
    reviews: 143,
    images: [
      "/products/aloe-cream.jpg",
      "/products/aloe-cream-alt1.jpg",
      "/products/aloe-cream-alt2.jpg",
    ],
    shade: "140 55% 42%",
    short:
      "A whipped aloe vera cream that delivers cool, non-sticky hydration for face and body.",
    description:
      "Silky and lightweight, this aloe vera cream melts into skin for instant cooling comfort. It hydrates deeply for up to 48 hours while calming irritation — a daily essential for soft, healthy-looking skin.",
    keyIngredients: ["Aloe Vera", "Glycerin", "Vitamin-E"],
    benefits: [
      "Non-sticky 48h hydration",
      "Cools & soothes skin",
      "Lightweight daily cream",
      "For face & body",
    ],
    howToUse:
      "Take a small amount and massage onto clean skin until absorbed. Use daily, morning and night.",
    skinType: "All skin types",
  },
  {
    id: "gg-06",
    slug: "honey-almond-skin-cream",
    hero: true,
    name: "Honey & Almond Nourishing Cream",
    tagline: "100% pure almond oil",
    category: "Skin Cream",
    price: 279,
    compareAt: 349,
    size: "200 gm",
    rating: 4.8,
    reviews: 158,
    bestSeller: true,
    images: [
      "/products/honey-almond-cream.jpg",
      "/products/honey-almond-cream-alt1.jpg",
    ],
    shade: "40 70% 52%",
    short:
      "Buttery honey and almond cream that nourishes dry skin with 48-hour moisture.",
    description:
      "A luxuriously rich cream blending honey with 100% pure almond oil. It nourishes and repairs dry, dull skin, restoring a soft, velvety glow that lasts. A little goes a long way.",
    keyIngredients: ["Honey", "100% Pure Almond Oil", "Shea Butter"],
    benefits: [
      "48h moisture & nourishing",
      "Repairs dry, dull skin",
      "Velvety soft finish",
      "Rich yet non-greasy",
    ],
    howToUse:
      "Warm a small amount between fingertips and massage into skin. Use daily on face, hands and body.",
    skinType: "Dry to normal skin",
  },
  {
    id: "gg-07",
    slug: "fruit-skin-cream",
    name: "Fruit Skin Moisturizer Cream",
    tagline: "Apple + Jojoba Oil",
    category: "Skin Cream",
    price: 259,
    compareAt: 319,
    size: "200 ml",
    rating: 4.6,
    reviews: 109,
    images: [
      "/products/fruit-cream.jpg",
      "/products/fruit-cream-alt1.jpg",
      "/products/fruit-cream-alt2.jpg",
    ],
    shade: "355 75% 52%",
    short:
      "Apple and jojoba cream with a 48-hour moisture lock for soft, supple, glowing skin.",
    description:
      "This fruit-fresh cream pairs apple extract with jojoba oil to seal in long-lasting hydration. The airy texture absorbs quickly and keeps skin bouncy, smooth and radiant.",
    keyIngredients: ["Apple Extract", "Jojoba Oil", "Vitamin-E"],
    benefits: [
      "48h moisture lock",
      "Long-lasting hydration",
      "Naturally glowing skin",
      "Fast-absorbing texture",
    ],
    howToUse:
      "Apply to clean skin and massage in gentle circles until absorbed. Use morning and night.",
    skinType: "All skin types",
  },
  {
    id: "gg-08",
    slug: "rose-cool-blossom-talc",
    name: "Rose Cool Blossom Talc",
    tagline: "Rose Icy Touch • Prickly Heat Powder",
    category: "Talc & Powder",
    price: 199,
    compareAt: 249,
    size: "300 gm",
    rating: 4.7,
    reviews: 96,
    images: ["/products/rose-talc.jpg", "/products/talc-trio.jpg"],
    shade: "335 75% 55%",
    short:
      "A rose-scented icy-touch talc that cools, soothes prickly heat and keeps you fresh.",
    description:
      "Rosevia-fresh talc with a cooling icy-touch finish. It absorbs sweat, calms prickly heat and leaves a delicate rose fragrance lingering on skin all day.",
    keyIngredients: ["Rose Extract", "Cooling Menthol", "Zinc"],
    benefits: [
      "Icy-touch cooling",
      "Soothes prickly heat",
      "Long-lasting rose fragrance",
      "Absorbs excess sweat",
    ],
    howToUse:
      "Dust lightly over clean, dry skin. Reapply through the day to stay cool and fresh.",
    skinType: "All skin types",
  },
  {
    id: "gg-09",
    slug: "fresh-blossom-talc",
    name: "Fresh Blossom Talc",
    tagline: "Soft Touch Talc",
    category: "Talc & Powder",
    price: 189,
    compareAt: 239,
    size: "300 gm",
    rating: 4.6,
    reviews: 84,
    images: ["/products/fresh-blossom-talc.jpg"],
    shade: "330 65% 62%",
    short:
      "A soft, floral talc that keeps skin smooth, dry and delicately fragrant.",
    description:
      "Fresh Blossom wraps you in a soft floral veil. This fine soft-touch talc keeps skin silky and moisture-free while a gentle blossom scent keeps you feeling fresh from morning to night.",
    keyIngredients: ["Blossom Fragrance", "Fine Talc", "Zinc"],
    benefits: [
      "Silky soft-touch finish",
      "Keeps skin dry & fresh",
      "Delicate floral fragrance",
      "Everyday comfort",
    ],
    howToUse:
      "Apply evenly over clean, dry skin after bathing. Reapply as required.",
    skinType: "All skin types",
  },
  {
    id: "gg-10",
    slug: "classic-deo-blossom-talc",
    name: "Classic Deo Blossom Talc",
    tagline: "Icy Touch • Long-lasting Deo Freshness",
    category: "Talc & Powder",
    price: 209,
    compareAt: 259,
    size: "300 gm",
    rating: 4.8,
    reviews: 102,
    new: true,
    images: ["/products/classic-deo-talc.jpg", "/products/classic-deo-talc-alt1.jpg"],
    shade: "205 75% 52%",
    short:
      "A deodorising icy-touch talc that delivers long-lasting freshness and all-day confidence.",
    description:
      "Classic Deo Blossom combines an icy-touch cooling finish with long-lasting deodorant freshness. It fights odour, absorbs moisture and keeps you crisp and confident, even on the busiest days.",
    keyIngredients: ["Deo Complex", "Cooling Menthol", "Blue Blossom"],
    benefits: [
      "Long-lasting deo freshness",
      "Icy-touch cooling",
      "Controls odour & moisture",
      "All-day confidence",
    ],
    howToUse:
      "Dust generously over clean, dry skin, focusing on areas prone to sweat.",
    skinType: "All skin types",
  },
  {
    id: "gg-11",
    slug: "premium-rose-water",
    hero: true,
    name: "Premium Rose Water Toner",
    tagline: "100% pure & natural",
    category: "Toner & Mist",
    price: 179,
    compareAt: 229,
    size: "120 ml",
    rating: 4.9,
    reviews: 231,
    bestSeller: true,
    images: ["/products/rose-water.jpg"],
    shade: "345 75% 58%",
    short:
      "A 100% pure rose water mist that hydrates, refreshes and revitalizes all skin types.",
    description:
      "Steam-distilled from real roses, this gentle toning mist tightens pores, balances skin and delivers an instant hit of hydration. Spritz any time for a refreshed, dewy glow.",
    keyIngredients: ["100% Pure Rose Water"],
    benefits: [
      "Hydrates & refreshes",
      "Revitalizes tired skin",
      "Gentle toner for all skin types",
      "Sets makeup with a dewy finish",
    ],
    howToUse:
      "Mist over cleansed skin or use on a cotton pad as a toner. Reapply through the day to refresh.",
    skinType: "All skin types",
  },
  {
    id: "gg-12",
    slug: "aloe-face-body-gel",
    name: "Aloe Face & Body Gel",
    tagline: "Pure aloe vera formula",
    category: "Aloe Gel",
    price: 229,
    compareAt: 289,
    size: "150 gm",
    rating: 4.7,
    reviews: 176,
    images: ["/products/aloe-gel.jpg", "/products/aloe-gel-alt1.jpg"],
    shade: "120 55% 42%",
    short:
      "A multipurpose pure aloe gel that soothes, clears pimples and enhances skin glow.",
    description:
      "The ultimate multitasker. This pure aloe vera gel calms irritation, helps clear pimples, softens fine lines and boosts radiance. Use it as a moisturiser, after-sun soother or hair styling gel.",
    keyIngredients: ["99% Aloe Vera", "Vitamin-E"],
    benefits: [
      "Soothes & repairs skin",
      "Helps clear pimples",
      "Reduces wrinkles",
      "Enhances natural glow",
    ],
    howToUse:
      "Apply a thin layer over face, body or hair as needed. Lightweight enough for daily use.",
    skinType: "All skin types, incl. sensitive",
  },
  {
    id: "gg-13",
    slug: "glycerine-skin-toner",
    name: "Glycerine Skin Toner",
    tagline: "Perfect smooth",
    category: "Toner & Mist",
    price: 149,
    compareAt: 189,
    size: "30 gm",
    rating: 4.5,
    reviews: 67,
    images: ["/products/glycerine-toner.jpg"],
    shade: "330 60% 60%",
    short:
      "A pure glycerine toner that deeply hydrates and leaves skin perfectly smooth.",
    description:
      "A herbal glycerine skin toner that draws moisture into the skin for a soft, smooth, supple feel. Ideal for dry winter days when skin needs an extra drink of hydration.",
    keyIngredients: ["Pure Glycerine", "Herbal Extracts"],
    benefits: [
      "Deep, lasting hydration",
      "Perfectly smooth skin",
      "Great for dry & winter skin",
      "Herbal, gentle formula",
    ],
    howToUse:
      "Apply a few drops to clean skin or mix with your moisturiser. Use daily, especially at night.",
    skinType: "Dry & dehydrated skin",
  },
];

export const MARKETPLACES: {
  id: Marketplace;
  name: string;
  color: string;
  logo: string;
  search: (q: string) => string;
}[] = [
  {
    id: "amazon",
    name: "Amazon",
    color: "#FF9900",
    logo: "/marketplaces/amazon.svg",
    search: (q) => `https://www.amazon.in/s?k=${encodeURIComponent(q)}`,
  },
  {
    id: "flipkart",
    name: "Flipkart",
    color: "#2874F0",
    logo: "/marketplaces/flipkart.svg",
    search: (q) => `https://www.flipkart.com/search?q=${encodeURIComponent(q)}`,
  },
  {
    id: "meesho",
    name: "Meesho",
    color: "#F43397",
    logo: "/marketplaces/meesho.png",
    search: (q) => `https://www.meesho.com/search?q=${encodeURIComponent(q)}`,
  },
];

/**
 * Resolve the buy link for a product on a marketplace. Uses the explicit product
 * URL if set in `product.links`, otherwise falls back to a brand+product search
 * on that marketplace so the button always leads somewhere useful.
 */
export function buyUrl(product: Product, marketplace: Marketplace): string {
  const explicit = product.links?.[marketplace];
  if (explicit && explicit !== "#") return explicit;
  const mk = MARKETPLACES.find((m) => m.id === marketplace)!;
  return mk.search(`${BRAND.name} ${product.name}`);
}

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function relatedProducts(slug: string, category: Category, limit = 4) {
  const same = products.filter((p) => p.category === category && p.slug !== slug);
  const others = products.filter((p) => p.category !== category && p.slug !== slug);
  return [...same, ...others].slice(0, limit);
}

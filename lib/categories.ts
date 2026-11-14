import { CATEGORIES, type Category } from "@/lib/products";

/**
 * SEO landing-page content for each product category (/shop/<slug>).
 * Intro copy sticks to what the products really are, so nothing here
 * over-promises. Product lists and the quick guide come from live data.
 */
export type CategoryPage = {
  name: Category;
  slug: string;
  /** Page heading (H1). */
  h1: string;
  /** Browser/Google title (the site name is added automatically). */
  metaTitle: string;
  metaDescription: string;
  /** Intro paragraphs shown above the products. */
  intro: string[];
  /** What to look for when choosing. */
  tips: string[];
};

export const CATEGORY_PAGES: CategoryPage[] = [
  {
    name: "Face Wash",
    slug: "face-wash",
    h1: "Vitamin-C Face Wash",
    metaTitle: "Vitamin-C Face Wash for Bright, Clean Skin",
    metaDescription:
      "Shop Gold & Glow vitamin-C face wash: a gentle gel-to-lather cleanser for brighter, even-looking skin. Buy on Amazon, Flipkart or Meesho.",
    intro: [
      "A good face wash is the first step of every skincare routine. Gold & Glow's face wash is built around vitamin-C and natural orange extracts that sweep away dirt, oil and pollution, while helping dull skin look brighter and more even.",
      "It lathers from a light gel, so it cleans thoroughly without leaving skin feeling tight. Use it morning and night, then follow with a toner or moisturiser.",
    ],
    tips: [
      "Look for a gentle, gel-to-lather formula if your skin feels tight after washing.",
      "Vitamin-C cleansers suit dull or uneven-looking skin, and the face wash here is made for all skin types.",
      "Wash twice a day with lukewarm water and pat dry rather than rubbing.",
    ],
  },
  {
    name: "Body Lotion",
    slug: "body-lotion",
    h1: "Herbal Body Lotions",
    metaTitle: "Herbal Body Lotion: Aloe, Honey & Almond",
    metaDescription:
      "Explore Gold & Glow body lotions: light aloe vera, rich honey & almond and apple-jojoba fruit moisturiser. Buy on Amazon, Flipkart or Meesho.",
    intro: [
      "Daily moisture should feel comfortable, not heavy. Our body lotions range from a feather-light aloe vera formula that absorbs without a sticky feel, to a richer honey and almond lotion for dry skin, plus an apple and jojoba fruit moisturiser.",
      "Smooth one on right after a bath while skin is still slightly damp, so the moisture stays where it belongs.",
    ],
    tips: [
      "Normal to oily skin usually likes a light, non-sticky lotion such as aloe vera.",
      "Dry or winter skin does better with a richer lotion like honey and almond.",
      "Apply within a few minutes of bathing to lock in moisture.",
    ],
  },
  {
    name: "Skin Cream",
    slug: "skin-cream",
    h1: "Nourishing Skin Creams",
    metaTitle: "Nourishing Skin Cream: Aloe, Almond & Fruit",
    metaDescription:
      "Shop Gold & Glow skin creams: non-sticky aloe vera, nourishing honey & almond and apple-jojoba fruit cream. Buy on Amazon, Flipkart or Meesho.",
    intro: [
      "Creams give skin a little more care than a lotion, especially on dry patches like hands, elbows and face. Choose a non-sticky aloe vera cream for everyday hydration, a honey and almond cream made with pure almond oil for dry skin, or the apple and jojoba fruit cream.",
      "A small amount goes a long way. Warm it between your palms and press it into clean skin.",
    ],
    tips: [
      "Aloe vera cream is a light, everyday option that doesn't feel greasy.",
      "Honey and almond cream suits dry to normal skin that needs extra nourishment.",
      "Use it at night for the most noticeable softness by morning.",
    ],
  },
  {
    name: "Talc & Powder",
    slug: "talc-powder",
    h1: "Blossom Talc & Prickly Heat Powder",
    metaTitle: "Icy-Touch Talc & Prickly Heat Powder",
    metaDescription:
      "Gold & Glow Blossom talc range: rose icy-touch prickly heat powder, fresh floral talc and long-lasting deo talc. Buy on Amazon, Flipkart or Meesho.",
    intro: [
      "Stay fresh through hot, humid days with the Blossom talc range. Choose a rose icy-touch powder that cools on contact, a soft-touch fresh floral talc, or a classic deo talc made for long-lasting freshness.",
      "Dust it on clean, dry skin after a bath, on the neck, underarms and body folds, for a dry and comfortable feel.",
    ],
    tips: [
      "Icy-touch powders are a good pick for summer heat and sweat.",
      "Deo talc is made for long-lasting freshness through the day.",
      "Always apply on clean, completely dry skin.",
    ],
  },
  {
    name: "Toner & Mist",
    slug: "toner-mist",
    h1: "Rose Water & Skin Toners",
    metaTitle: "Rose Water Toner & Glycerine Skin Toner",
    metaDescription:
      "Shop Gold & Glow toners: pure natural rose water and a glycerine skin toner for smooth, refreshed skin. Buy on Amazon, Flipkart or Meesho.",
    intro: [
      "A toner is a quick way to refresh skin after cleansing. Our premium rose water is a pure and natural mist for an instant lift, while the glycerine skin toner is made for dry and dehydrated skin that wants to feel smooth.",
      "Spritz or pat on after washing your face, then follow with your moisturiser.",
    ],
    tips: [
      "Rose water suits all skin types and works well as a mid-day refresh.",
      "Glycerine toner is aimed at dry, dehydrated skin.",
      "Apply right after cleansing, before your cream.",
    ],
  },
  {
    name: "Aloe Gel",
    slug: "aloe-gel",
    h1: "Aloe Vera Gel for Face & Body",
    metaTitle: "Pure Aloe Vera Gel for Face & Body",
    metaDescription:
      "Gold & Glow aloe face & body gel: a pure aloe vera formula to soothe and hydrate, suitable for all skin types. Buy on Amazon, Flipkart or Meesho.",
    intro: [
      "Aloe vera is a long-loved ingredient for calming and hydrating skin. Our aloe face and body gel is a pure aloe vera formula that is light, cooling and suitable for all skin types, including sensitive skin.",
      "Use it on the face and body after sun, shaving or whenever skin feels dry and tired.",
    ],
    tips: [
      "Its light texture makes it a good everyday gel for oily and combination skin.",
      "Keep it in the fridge for an extra-cooling feel.",
      "Do a small patch test first if your skin is very sensitive.",
    ],
  },
];

/** The editable part of a category page, as saved from Admin → Categories. */
export type CategoryOverride = Partial<Pick<CategoryPage, "h1" | "metaTitle" | "metaDescription" | "intro" | "tips">>;

/** Saved edits win over the built-in text; empty or wrong-typed values are ignored. */
export function mergeCategory(base: CategoryPage, ov?: CategoryOverride | null): CategoryPage {
  if (!ov) return base;
  const str = (v: unknown, d: string) => (typeof v === "string" && v.trim() ? v.trim() : d);
  const list = (v: unknown, d: string[]) => {
    const a = Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && x.trim() !== "") : [];
    return a.length ? a.map((x) => x.trim()) : d;
  };
  return {
    ...base,
    h1: str(ov.h1, base.h1),
    metaTitle: str(ov.metaTitle, base.metaTitle),
    metaDescription: str(ov.metaDescription, base.metaDescription),
    intro: list(ov.intro, base.intro),
    tips: list(ov.tips, base.tips),
  };
}

export const categorySlug = (name: string) =>
  CATEGORY_PAGES.find((c) => c.name === name)?.slug ?? "";

export const categoryBySlug = (slug: string) => CATEGORY_PAGES.find((c) => c.slug === slug);

export const categoryHref = (name: string) => {
  const slug = categorySlug(name);
  return slug ? `/shop/${slug}` : "/shop";
};

/** Image + short blurb for a category (from the shared CATEGORIES list). */
export const categoryMeta = (name: string) => CATEGORIES.find((c) => c.name === name);

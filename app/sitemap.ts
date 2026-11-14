import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/catalog";
import { CATEGORY_PAGES } from "@/lib/categories";
import { SITE_URL } from "@/lib/site-url";

export const dynamic = "force-dynamic";

/** Only real "last changed" dates are listed (products); static pages omit lastmod. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getAllProducts();
  return [
    { url: SITE_URL, priority: 1 },
    { url: `${SITE_URL}/shop`, priority: 0.9 },
    ...CATEGORY_PAGES.filter((c) => products.some((p) => p.category === c.name)).map((c) => ({
      url: `${SITE_URL}/shop/${c.slug}`,
      priority: 0.8,
    })),
    { url: `${SITE_URL}/about`, priority: 0.5 },
    { url: `${SITE_URL}/contact`, priority: 0.5 },
    { url: `${SITE_URL}/privacy`, priority: 0.3 },
    { url: `${SITE_URL}/terms`, priority: 0.3 },
    { url: `${SITE_URL}/refund-policy`, priority: 0.3 },
    { url: `${SITE_URL}/payment-policy`, priority: 0.3 },
    ...products.map((p) => ({
      url: `${SITE_URL}/product/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined,
      priority: 0.8,
    })),
  ];
}

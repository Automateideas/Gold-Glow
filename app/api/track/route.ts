import { dbConfigured, getDb } from "@/db";
import { ggClicks } from "@/db/schema";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const MARKETPLACES = new Set(["amazon", "flipkart", "meesho"]);

/** Records a click on a "Buy on <marketplace>" button. Fire-and-forget. */
export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!dbConfigured() || !rateLimit(`track:${ip}`, 60, 60 * 1000)) {
    return new Response(null, { status: 204 });
  }
  try {
    const body = (await req.json()) as { productId?: unknown; name?: unknown; marketplace?: unknown };
    const marketplace = typeof body.marketplace === "string" ? body.marketplace : "";
    const productId = typeof body.productId === "string" ? body.productId.slice(0, 80) : "";
    if (!MARKETPLACES.has(marketplace) || !productId) return new Response(null, { status: 400 });
    const name = typeof body.name === "string" ? body.name.slice(0, 200) : "";
    await getDb().insert(ggClicks).values({ product_id: productId, product_name: name, marketplace });
  } catch {
    /* tracking must never break the visitor's click */
  }
  return new Response(null, { status: 204 });
}

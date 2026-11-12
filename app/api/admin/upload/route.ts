import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin/auth";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { PRODUCT_IMAGE_BUCKET, supabaseConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB per image
const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

/** Admin-only image upload → Supabase Storage (public bucket). Returns { url }. */
export async function POST(req: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  }
  if (!supabaseConfigured()) {
    return NextResponse.json({ error: "Supabase isn't configured yet." }, { status: 503 });
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }
  const ext = ALLOWED[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "Only JPG, PNG, WebP, GIF or AVIF images are allowed." },
      { status: 400 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image is larger than 5 MB." }, { status: 400 });
  }

  const sb = createAdminSupabase();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const body = Buffer.from(await file.arrayBuffer());

  let { error } = await sb.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .upload(path, body, { contentType: file.type, cacheControl: "31536000", upsert: false });

  // Bucket missing? Create it (public) once, then retry.
  if (error && /bucket.*not found/i.test(error.message)) {
    await sb.storage.createBucket(PRODUCT_IMAGE_BUCKET, { public: true });
    ({ error } = await sb.storage
      .from(PRODUCT_IMAGE_BUCKET)
      .upload(path, body, { contentType: file.type, cacheControl: "31536000", upsert: false }));
  }
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = sb.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}

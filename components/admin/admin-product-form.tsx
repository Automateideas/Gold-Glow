"use client";

import * as React from "react";
import { Loader2, Upload, X, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { CATEGORIES, MARKETPLACES, type Product } from "@/lib/products";
import { saveProductAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type FormState = {
  name: string;
  slug: string;
  tagline: string;
  category: string;
  price: string;
  compareAt: string;
  size: string;
  rating: string;
  reviews: string;
  bestSeller: boolean;
  isNew: boolean;
  inHero: boolean;
  shade: string;
  short: string;
  description: string;
  keyIngredients: string;
  benefits: string;
  howToUse: string;
  skinType: string;
  amazon: string;
  flipkart: string;
  meesho: string;
  sortOrder: string;
};

function initialState(p: Product | null): FormState {
  return {
    name: p?.name ?? "",
    slug: p?.slug ?? "",
    tagline: p?.tagline ?? "",
    category: p?.category ?? CATEGORIES[0].name,
    price: p ? String(p.price) : "",
    compareAt: p?.compareAt ? String(p.compareAt) : "",
    size: p?.size ?? "",
    rating: p ? String(p.rating) : "4.6",
    reviews: p ? String(p.reviews) : "0",
    bestSeller: p?.bestSeller ?? false,
    isNew: p?.new ?? false,
    inHero: p?.hero ?? false,
    shade: p?.shade ?? "335 82% 46%",
    short: p?.short ?? "",
    description: p?.description ?? "",
    keyIngredients: (p?.keyIngredients ?? []).join("\n"),
    benefits: (p?.benefits ?? []).join("\n"),
    howToUse: p?.howToUse ?? "",
    skinType: p?.skinType ?? "",
    amazon: p?.links?.amazon ?? "",
    flipkart: p?.links?.flipkart ?? "",
    meesho: p?.links?.meesho ?? "",
    sortOrder: "0",
  };
}

export function AdminProductForm({
  initial,
  onClose,
  onSaved,
}: {
  initial: Product | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [f, setF] = React.useState<FormState>(() => initialState(initial));
  const [images, setImages] = React.useState<string[]>(initial?.images ?? []);
  const [uploading, setUploading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  function set<K extends keyof FormState>(key: K, val: FormState[K]) {
    setF((prev) => ({ ...prev, [key]: val }));
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    for (const file of files) {
      try {
        const body = new FormData();
        body.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body });
        const json = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
        if (!res.ok || !json.url) {
          toast.error(`${file.name}: ${json.error ?? "upload failed"}`);
          continue;
        }
        setImages((prev) => [...prev, json.url!]);
      } catch {
        toast.error(`${file.name}: network error while uploading`);
      }
    }
    setUploading(false);
    e.target.value = "";
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (images.length === 0) {
      toast.error("Add at least one product image.");
      return;
    }
    setSaving(true);
    const slug = (f.slug || slugify(f.name)).trim();
    const row = {
      slug,
      name: f.name.trim(),
      tagline: f.tagline.trim(),
      category: f.category,
      price: parseInt(f.price || "0", 10) || 0,
      compare_at: f.compareAt ? parseInt(f.compareAt, 10) : null,
      size: f.size.trim(),
      rating: Math.min(5, Math.max(0, parseFloat(f.rating || "4.6"))),
      reviews: parseInt(f.reviews || "0", 10) || 0,
      best_seller: f.bestSeller,
      is_new: f.isNew,
      in_hero: f.inHero,
      images,
      shade: f.shade.trim() || "335 82% 46%",
      short: f.short.trim(),
      description: f.description.trim(),
      key_ingredients: f.keyIngredients.split("\n").map((s) => s.trim()).filter(Boolean),
      benefits: f.benefits.split("\n").map((s) => s.trim()).filter(Boolean),
      how_to_use: f.howToUse.trim(),
      skin_type: f.skinType.trim(),
      links: {
        ...(f.amazon.trim() ? { amazon: f.amazon.trim() } : {}),
        ...(f.flipkart.trim() ? { flipkart: f.flipkart.trim() } : {}),
        ...(f.meesho.trim() ? { meesho: f.meesho.trim() } : {}),
      },
      sort_order: parseInt(f.sortOrder || "0", 10) || 0,
    };

    const res = await saveProductAction({ id: initial?.id, row });

    setSaving(false);
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success(initial ? "Product updated" : "Product added");
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-foreground/40 p-4 backdrop-blur-sm">
      <form
        onSubmit={onSubmit}
        className="my-6 w-full max-w-2xl rounded-2xl border bg-card p-6 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold">
            {initial ? "Edit product" : "Add product"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Images */}
        <div className="mt-5">
          <Label>Product images</Label>
          <div className="mt-2 flex flex-wrap gap-3">
            {images.map((url) => (
              <div key={url} className="relative h-20 w-20 overflow-hidden rounded-xl border bg-secondary/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-full w-full object-contain p-1" />
                <button
                  type="button"
                  onClick={() => setImages((prev) => prev.filter((u) => u !== url))}
                  className="absolute right-0.5 top-0.5 grid h-5 w-5 place-items-center rounded-full bg-foreground/80 text-background"
                  aria-label="Remove image"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <label className="grid h-20 w-20 cursor-pointer place-items-center rounded-xl border border-dashed text-muted-foreground transition-colors hover:border-primary hover:text-primary">
              {uploading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <ImagePlus className="h-5 w-5" />
              )}
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleUpload}
                disabled={uploading}
              />
            </label>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            First image is the main thumbnail. PNG/JPG recommended.
          </p>
        </div>

        {/* Core fields */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Name" required>
            <Input value={f.name} onChange={(e) => set("name", e.target.value)} required />
          </Field>
          <Field label="Slug (URL)" hint="auto from name if empty">
            <Input
              value={f.slug}
              onChange={(e) => set("slug", e.target.value)}
              placeholder={slugify(f.name)}
            />
          </Field>
          <Field label="Tagline">
            <Input value={f.tagline} onChange={(e) => set("tagline", e.target.value)} />
          </Field>
          <Field label="Category">
            <select
              value={f.category}
              onChange={(e) => set("category", e.target.value)}
              className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {CATEGORIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Price (₹)" required>
            <Input type="number" value={f.price} onChange={(e) => set("price", e.target.value)} required />
          </Field>
          <Field label="Compare-at / MRP (₹)" hint="optional, shows as struck-through">
            <Input type="number" value={f.compareAt} onChange={(e) => set("compareAt", e.target.value)} />
          </Field>
          <Field label="Size">
            <Input value={f.size} onChange={(e) => set("size", e.target.value)} placeholder="100 ml" />
          </Field>
          <Field label="Rating (0–5)">
            <Input type="number" step="0.1" min="0" max="5" value={f.rating} onChange={(e) => set("rating", e.target.value)} />
          </Field>
          <Field label="Reviews count">
            <Input type="number" value={f.reviews} onChange={(e) => set("reviews", e.target.value)} />
          </Field>
          <Field label="Accent colour (HSL)" hint="e.g. 335 82% 46%">
            <Input value={f.shade} onChange={(e) => set("shade", e.target.value)} />
          </Field>
        </div>

        <div className="mt-4 flex flex-wrap gap-5">
          <Toggle label="Bestseller" checked={f.bestSeller} onChange={(v) => set("bestSeller", v)} />
          <Toggle label="New" checked={f.isNew} onChange={(v) => set("isNew", v)} />
          <Toggle label="Home carousel" checked={f.inHero} onChange={(v) => set("inHero", v)} />
          <Field label="Sort order" hint="lower = earlier">
            <Input type="number" value={f.sortOrder} onChange={(e) => set("sortOrder", e.target.value)} className="w-24" />
          </Field>
        </div>

        {/* Text content */}
        <div className="mt-5 grid gap-4">
          <Field label="Short description (card + hero line)">
            <Textarea value={f.short} onChange={(e) => set("short", e.target.value)} rows={2} />
          </Field>
          <Field label="Full description">
            <Textarea value={f.description} onChange={(e) => set("description", e.target.value)} rows={4} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Key ingredients" hint="one per line">
              <Textarea value={f.keyIngredients} onChange={(e) => set("keyIngredients", e.target.value)} rows={4} />
            </Field>
            <Field label="Benefits" hint="one per line">
              <Textarea value={f.benefits} onChange={(e) => set("benefits", e.target.value)} rows={4} />
            </Field>
          </div>
          <Field label="How to use">
            <Textarea value={f.howToUse} onChange={(e) => set("howToUse", e.target.value)} rows={2} />
          </Field>
          <Field label="Suitable for">
            <Input value={f.skinType} onChange={(e) => set("skinType", e.target.value)} placeholder="All skin types" />
          </Field>
        </div>

        {/* Marketplace links */}
        <div className="mt-5">
          <Label>Marketplace links (optional — search fallback used if blank)</Label>
          <div className="mt-2 grid gap-3">
            {MARKETPLACES.map((m) => (
              <div key={m.id} className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.logo} alt={m.name} className="h-6 w-6 shrink-0 object-contain" />
                <Input
                  value={f[m.id as "amazon" | "flipkart" | "meesho"]}
                  onChange={(e) => set(m.id as "amazon" | "flipkart" | "meesho", e.target.value)}
                  placeholder={`${m.name} product URL`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving || uploading}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {initial ? "Save changes" : "Add product"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label>
        {label}
        {required && <span className="text-destructive"> *</span>}
        {hint && <span className="ml-1 font-normal text-muted-foreground">({hint})</span>}
      </Label>
      {children}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-[hsl(var(--primary))]"
      />
      {label}
    </label>
  );
}

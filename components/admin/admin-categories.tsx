"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ExternalLink, Loader2, RotateCcw, Save } from "lucide-react";
import type { CategoryOverride, CategoryPage } from "@/lib/categories";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/admin/fields";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { cn } from "@/lib/utils";
import { resetCategoryAction, saveCategoryAction } from "@/app/admin/actions";

type Form = {
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string; // paragraphs separated by a blank line
  tips: string; // one per line
};

const toForm = (c: CategoryPage): Form => ({
  h1: c.h1,
  metaTitle: c.metaTitle,
  metaDescription: c.metaDescription,
  intro: c.intro.join("\n\n"),
  tips: c.tips.join("\n"),
});

/** Character counter that turns red when over the recommended length. */
function Count({ value, max }: { value: string; max: number }) {
  return (
    <span className={cn("text-xs", value.length > max ? "text-destructive" : "text-muted-foreground")}>
      {value.length}/{max}
    </span>
  );
}

export function AdminCategories({
  pages,
  defaults,
  overrides,
}: {
  pages: CategoryPage[];
  defaults: CategoryPage[];
  overrides: Record<string, CategoryOverride>;
}) {
  const router = useRouter();
  const [slug, setSlug] = React.useState(pages[0]?.slug ?? "");
  const current = pages.find((p) => p.slug === slug) ?? pages[0];
  const [form, setForm] = React.useState<Form>(() => toForm(current));
  const [saving, setSaving] = React.useState(false);

  // Reload the form when another category is picked, or after a save/reset refresh.
  const [loaded, setLoaded] = React.useState(current);
  if (loaded !== current) {
    setLoaded(current);
    setForm(toForm(current));
  }

  const dirty = JSON.stringify(form) !== JSON.stringify(toForm(current));
  const customized = (s: string) => !!overrides[s] && Object.keys(overrides[s]).length > 0;
  const set = <K extends keyof Form>(k: K, v: string) => setForm((p) => ({ ...p, [k]: v }));

  function pick(next: string) {
    if (next === slug) return;
    if (dirty && !confirm("You have unsaved changes in this category. Discard them?")) return;
    setSlug(next);
  }

  async function save() {
    setSaving(true);
    const res = await saveCategoryAction({
      slug,
      data: {
        h1: form.h1,
        metaTitle: form.metaTitle,
        metaDescription: form.metaDescription,
        intro: form.intro.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean),
        tips: form.tips.split("\n").map((s) => s.trim()).filter(Boolean),
      },
    });
    setSaving(false);
    if (!res.ok) return toast.error(res.error);
    toast.success(`${current.name} page updated`);
    router.refresh();
  }

  async function reset() {
    if (!confirm(`Restore the original text for ${current.name}?`)) return;
    const res = await resetCategoryAction(slug);
    if (!res.ok) return toast.error(res.error);
    const original = defaults.find((d) => d.slug === slug);
    if (original) setForm(toForm(original));
    toast.success("Original text restored");
    router.refresh();
  }

  return (
    <>
      <AdminPageHeader
        title="Categories"
        description="Edit the heading, intro text and Google title/description of each category page (like /shop/face-wash)."
      >
        <Button variant="outline" asChild>
          <Link href={`/shop/${slug}`} target="_blank">
            View page <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>
        <Button onClick={save} disabled={saving || !dirty}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save changes
        </Button>
      </AdminPageHeader>

      <div className="mt-6 grid gap-6 lg:grid-cols-[14rem_1fr]">
        {/* Category list */}
        <div className="flex gap-2 overflow-x-auto lg:flex-col" role="tablist" aria-label="Categories">
          {pages.map((p) => (
            <button
              key={p.slug}
              role="tab"
              aria-selected={p.slug === slug}
              onClick={() => pick(p.slug)}
              className={cn(
                "flex shrink-0 items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors",
                p.slug === slug
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:text-foreground"
              )}
            >
              <span>{p.name}</span>
              {customized(p.slug) && (
                <Badge variant={p.slug === slug ? "outline" : "soft"} className={p.slug === slug ? "border-white/50 text-white" : ""}>
                  Edited
                </Badge>
              )}
            </button>
          ))}
        </div>

        {/* Editor */}
        <div className="rounded-2xl border bg-card p-6">
          <div className="grid gap-5">
            <Field label="Page heading (H1)">
              <Input value={form.h1} onChange={(e) => set("h1", e.target.value)} />
            </Field>

            <div className="grid gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium leading-none">
                  Google title <span className="font-normal text-muted-foreground">(brand is added automatically)</span>
                </span>
                <Count value={form.metaTitle} max={55} />
              </div>
              <Input value={form.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} />
            </div>

            <div className="grid gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium leading-none">Google description</span>
                <Count value={form.metaDescription} max={160} />
              </div>
              <Textarea
                rows={3}
                value={form.metaDescription}
                onChange={(e) => set("metaDescription", e.target.value)}
              />
            </div>

            <Field label="Intro text" hint="leave a blank line between paragraphs">
              <Textarea rows={8} value={form.intro} onChange={(e) => set("intro", e.target.value)} />
            </Field>

            <Field label="Buying tips" hint="one per line">
              <Textarea rows={5} value={form.tips} onChange={(e) => set("tips", e.target.value)} />
            </Field>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
              <p className="text-xs text-muted-foreground">
                The product list and quick guide on the page update automatically from your Products tab.
              </p>
              <Button variant="outline" onClick={reset} disabled={!customized(slug)}>
                <RotateCcw className="h-4 w-4" /> Restore original text
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

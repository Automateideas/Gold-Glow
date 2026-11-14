"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, ExternalLink, Loader2, Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { formatUpdated, type PolicyOverride, type PolicyPage } from "@/lib/pages";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/admin/fields";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { cn } from "@/lib/utils";
import { resetPolicyAction, savePolicyAction } from "@/app/admin/actions";

type Form = {
  title: string;
  metaDescription: string;
  intro: string;
  sections: { id: number; heading: string; body: string }[];
};

let nextId = 1;
const toForm = (p: PolicyPage): Form => ({
  title: p.title,
  metaDescription: p.metaDescription,
  intro: p.intro,
  sections: p.sections.map((s) => ({ id: nextId++, heading: s.heading, body: s.body })),
});

// Compare without the temporary ids.
const sig = (f: Form) =>
  JSON.stringify([f.title, f.metaDescription, f.intro, f.sections.map((s) => [s.heading, s.body])]);

export function AdminPolicies({
  pages,
  defaults,
  overrides,
}: {
  pages: PolicyPage[];
  defaults: PolicyPage[];
  overrides: Record<string, PolicyOverride>;
}) {
  const router = useRouter();
  const [slug, setSlug] = React.useState(pages[0]?.slug ?? "");
  const current = pages.find((p) => p.slug === slug) ?? pages[0];
  const [form, setForm] = React.useState<Form>(() => toForm(current));
  const [saving, setSaving] = React.useState(false);

  // Reload the form when another page is picked, or after a save/reset refresh.
  const [loaded, setLoaded] = React.useState(current);
  if (loaded !== current) {
    setLoaded(current);
    setForm(toForm(current));
  }

  const dirty = sig(form) !== sig(toForm(current));
  const edited = (s: string) => !!overrides[s] && Object.keys(overrides[s]).length > 0;

  function pick(next: string) {
    if (next === slug) return;
    if (dirty && !confirm("You have unsaved changes on this page. Discard them?")) return;
    setSlug(next);
  }

  const setField = (k: "title" | "metaDescription" | "intro", v: string) =>
    setForm((p) => ({ ...p, [k]: v }));
  const setSection = (id: number, k: "heading" | "body", v: string) =>
    setForm((p) => ({ ...p, sections: p.sections.map((s) => (s.id === id ? { ...s, [k]: v } : s)) }));
  const move = (i: number, dir: -1 | 1) =>
    setForm((p) => {
      const j = i + dir;
      if (j < 0 || j >= p.sections.length) return p;
      const next = [...p.sections];
      [next[i], next[j]] = [next[j], next[i]];
      return { ...p, sections: next };
    });
  const remove = (id: number) => {
    if (!confirm("Delete this section?")) return;
    setForm((p) => ({ ...p, sections: p.sections.filter((s) => s.id !== id) }));
  };
  const add = () =>
    setForm((p) => ({ ...p, sections: [...p.sections, { id: nextId++, heading: "", body: "" }] }));

  async function save() {
    setSaving(true);
    const res = await savePolicyAction({
      slug,
      data: {
        title: form.title,
        metaDescription: form.metaDescription,
        intro: form.intro,
        sections: form.sections.map((s) => ({ heading: s.heading, body: s.body })),
      },
    });
    setSaving(false);
    if (!res.ok) return toast.error(res.error);
    toast.success(`${form.title} updated. The "Last updated" date was refreshed.`);
    router.refresh();
  }

  async function reset() {
    if (!confirm(`Restore the original text of "${current.title}"? Your edits will be lost.`)) return;
    const res = await resetPolicyAction(slug);
    if (!res.ok) return toast.error(res.error);
    const original = defaults.find((d) => d.slug === slug);
    if (original) setForm(toForm(original));
    toast.success("Original text restored");
    router.refresh();
  }

  return (
    <>
      <AdminPageHeader
        title="Pages"
        description="Edit your Privacy Policy, Terms, Return & Refund and Payment policy pages."
      >
        <Button variant="outline" asChild>
          <Link href={`/${slug}`} target="_blank">
            View page <ExternalLink className="h-4 w-4" />
          </Link>
        </Button>
        <Button onClick={save} disabled={saving || !dirty}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save changes
        </Button>
      </AdminPageHeader>

      <div className="mt-6 grid gap-6 lg:grid-cols-[14rem_1fr]">
        <div className="flex gap-2 overflow-x-auto lg:flex-col" role="tablist" aria-label="Policy pages">
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
              <span>{p.title}</span>
              {edited(p.slug) && (
                <Badge variant={p.slug === slug ? "outline" : "soft"} className={p.slug === slug ? "border-white/50 text-white" : ""}>
                  Edited
                </Badge>
              )}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border bg-card p-6">
          <div className="grid gap-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Page title">
                <Input value={form.title} onChange={(e) => setField("title", e.target.value)} />
              </Field>
              <div className="grid content-start gap-1.5">
                <span className="text-sm font-medium leading-none">Last updated</span>
                <p className="flex h-11 items-center rounded-xl border bg-secondary/40 px-3 text-sm text-muted-foreground">
                  {formatUpdated(current.updated)} (changes when you save)
                </p>
              </div>
            </div>

            <div className="grid gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium leading-none">Google description</span>
                <span className={cn("text-xs", form.metaDescription.length > 160 ? "text-destructive" : "text-muted-foreground")}>
                  {form.metaDescription.length}/160
                </span>
              </div>
              <Textarea rows={2} value={form.metaDescription} onChange={(e) => setField("metaDescription", e.target.value)} />
            </div>

            <Field label="Short intro" hint="shown under the title">
              <Textarea rows={3} value={form.intro} onChange={(e) => setField("intro", e.target.value)} />
            </Field>

            <div className="rounded-xl border border-dashed bg-secondary/30 p-4 text-xs leading-relaxed text-muted-foreground">
              <p className="font-semibold text-foreground">How to format the text</p>
              <ul className="mt-1.5 list-disc space-y-0.5 pl-4">
                <li>Leave a blank line to start a new paragraph.</li>
                <li>Start a line with <code>- </code> to make a bullet point.</li>
                <li>
                  <code>**bold**</code> makes words bold; <code>[text](/terms)</code> or{" "}
                  <code>[text](https://…)</code> makes a link.
                </li>
                <li>
                  <code>{"{{email}}"}</code>, <code>{"{{phone}}"}</code> and <code>{"{{address}}"}</code> are
                  filled in automatically from Settings.
                </li>
              </ul>
            </div>

            <div className="grid gap-4">
              {form.sections.map((s, i) => (
                <div key={s.id} className="rounded-xl border p-4">
                  <div className="flex items-center gap-2">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    <Input
                      value={s.heading}
                      onChange={(e) => setSection(s.id, "heading", e.target.value)}
                      placeholder="Section heading"
                      aria-label={`Heading of section ${i + 1}`}
                      className="h-10 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      aria-label="Move section up"
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border hover:bg-accent disabled:opacity-40"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, 1)}
                      disabled={i === form.sections.length - 1}
                      aria-label="Move section down"
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border hover:bg-accent disabled:opacity-40"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(s.id)}
                      aria-label="Delete section"
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <Textarea
                    rows={6}
                    value={s.body}
                    onChange={(e) => setSection(s.id, "body", e.target.value)}
                    aria-label={`Text of section ${i + 1}`}
                    className="mt-3"
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
              <Button type="button" variant="outline" onClick={add}>
                <Plus className="h-4 w-4" /> Add section
              </Button>
              <Button variant="outline" onClick={reset} disabled={!edited(slug)}>
                <RotateCcw className="h-4 w-4" /> Restore original text
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

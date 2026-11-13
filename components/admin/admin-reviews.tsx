"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  DownloadCloud,
  Loader2,
  MessageSquareQuote,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import type { AdminReview } from "@/lib/site-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, Toggle } from "@/components/admin/fields";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { AdminError, EmptyState } from "@/components/admin/admin-notice";
import {
  deleteReviewAction,
  importDefaultReviewsAction,
  saveReviewAction,
} from "@/app/admin/actions";

export function AdminReviews({
  reviews,
  loadError,
}: {
  reviews: AdminReview[];
  loadError?: string;
}) {
  const router = useRouter();
  const [editing, setEditing] = React.useState<AdminReview | "new" | null>(null);
  const [importing, setImporting] = React.useState(false);

  async function onDelete(r: AdminReview) {
    if (!confirm(`Delete the review by ${r.name}?`)) return;
    const res = await deleteReviewAction(r.id);
    if (!res.ok) return toast.error(res.error);
    toast.success("Review deleted");
    router.refresh();
  }

  async function importSamples() {
    setImporting(true);
    const res = await importDefaultReviewsAction();
    setImporting(false);
    if (!res.ok) return toast.error(res.error);
    toast.success("Sample reviews copied. Edit or replace them with real ones.");
    router.refresh();
  }

  return (
    <>
      <AdminPageHeader
        title="Reviews"
        description="Shown in the Glow stories section of the homepage. Use real customer words."
      >
        <Button disabled={!!loadError} onClick={() => setEditing("new")}>
          <Plus className="h-4 w-4" /> Add review
        </Button>
      </AdminPageHeader>

      {loadError ? (
        <AdminError message={loadError} />
      ) : reviews.length === 0 ? (
        <EmptyState
          icon={MessageSquareQuote}
          title="No reviews of your own yet"
          text="The homepage currently shows 3 built-in sample reviews. Copy them here to edit, or add your own."
        >
          <div className="flex gap-3">
            <Button onClick={importSamples} disabled={importing}>
              {importing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <DownloadCloud className="h-4 w-4" />
              )}
              Copy sample reviews
            </Button>
            <Button variant="outline" onClick={() => setEditing("new")}>
              Add manually
            </Button>
          </div>
        </EmptyState>
      ) : (
        <div className="mt-6 grid gap-3">
          {reviews.map((r) => (
            <div
              key={r.id}
              className={`flex flex-wrap items-start justify-between gap-4 rounded-2xl border bg-card p-5 ${
                r.published ? "" : "opacity-60"
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{r.name}</p>
                  {r.city && <span className="text-xs text-muted-foreground">{r.city}</span>}
                  <span className="text-xs text-primary">{"★".repeat(r.rating)}</span>
                  {!r.published && <Badge variant="outline">Hidden</Badge>}
                </div>
                <p className="mt-1.5 text-sm text-foreground/90">&ldquo;{r.text}&rdquo;</p>
                {r.product && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Verified buyer of {r.product}
                  </p>
                )}
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setEditing(r)}
                  className="grid h-8 w-8 place-items-center rounded-lg border hover:bg-accent"
                  aria-label={`Edit review by ${r.name}`}
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(r)}
                  className="grid h-8 w-8 place-items-center rounded-lg border text-destructive hover:bg-destructive/10"
                  aria-label={`Delete review by ${r.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <ReviewForm
          initial={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            router.refresh();
          }}
        />
      )}
    </>
  );
}

function ReviewForm({
  initial,
  onClose,
  onSaved,
}: {
  initial: AdminReview | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [f, setF] = React.useState({
    name: initial?.name ?? "",
    city: initial?.city ?? "",
    product: initial?.product ?? "",
    rating: String(initial?.rating ?? 5),
    text: initial?.text ?? "",
    sort_order: String(initial?.sort_order ?? 0),
    published: initial?.published ?? true,
  });
  const [saving, setSaving] = React.useState(false);
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) =>
    setF((p) => ({ ...p, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await saveReviewAction({
      id: initial?.id,
      row: { ...f, rating: Number(f.rating), sort_order: Number(f.sort_order) },
    });
    setSaving(false);
    if (!res.ok) return toast.error(res.error);
    toast.success(initial ? "Review updated" : "Review added");
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-foreground/40 p-4 backdrop-blur-sm">
      <form
        onSubmit={submit}
        className="my-6 w-full max-w-lg rounded-2xl border bg-card p-6 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold">
            {initial ? "Edit review" : "Add review"}
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
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Customer name" required>
            <Input
              value={f.name}
              onChange={(e) => set("name", e.target.value)}
              required
              placeholder="Ananya R."
            />
          </Field>
          <Field label="City">
            <Input
              value={f.city}
              onChange={(e) => set("city", e.target.value)}
              placeholder="Mumbai"
            />
          </Field>
          <Field label="Product they bought" className="sm:col-span-2">
            <Input
              value={f.product}
              onChange={(e) => set("product", e.target.value)}
              placeholder="Vitamin-C Face Wash"
            />
          </Field>
          <Field label="Rating">
            <select
              value={f.rating}
              onChange={(e) => set("rating", e.target.value)}
              className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} stars
                </option>
              ))}
            </select>
          </Field>
          <Field label="Sort order" hint="lower = first">
            <Input
              type="number"
              value={f.sort_order}
              onChange={(e) => set("sort_order", e.target.value)}
            />
          </Field>
          <Field label="Review" required className="sm:col-span-2">
            <Textarea
              value={f.text}
              onChange={(e) => set("text", e.target.value)}
              rows={4}
              required
            />
          </Field>
        </div>
        <div className="mt-4">
          <Toggle
            label="Show on website"
            checked={f.published}
            onChange={(v) => set("published", v)}
          />
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {initial ? "Save changes" : "Add review"}
          </Button>
        </div>
      </form>
    </div>
  );
}

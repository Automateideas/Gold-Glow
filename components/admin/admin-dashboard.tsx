"use client";

import * as React from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  PackageOpen,
  DownloadCloud,
  AlertTriangle,
  Copy,
  Eye,
  EyeOff,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/products";
import { CATEGORIES } from "@/lib/products";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AdminProductForm } from "@/components/admin/admin-product-form";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import {
  deleteProductAction,
  duplicateProductAction,
  importStarterAction,
  setProductPublishedAction,
} from "@/app/admin/actions";

export function AdminDashboard({
  items,
  loadError,
}: {
  items: Product[];
  loadError?: string;
}) {
  const router = useRouter();
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Product | null>(null);
  const [seeding, setSeeding] = React.useState(false);
  const [busyId, setBusyId] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const [status, setStatus] = React.useState<"all" | "visible" | "hidden">("all");

  const visible = items.filter((p) => {
    if (category !== "all" && p.category !== category) return false;
    if (status === "visible" && p.published === false) return false;
    if (status === "hidden" && p.published !== false) return false;
    const q = query.trim().toLowerCase();
    return !q || `${p.name} ${p.tagline} ${p.category}`.toLowerCase().includes(q);
  });

  function openForm(p: Product | null) {
    setEditing(p);
    setFormOpen(true);
  }

  async function onDelete(p: Product) {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    setBusyId(p.id);
    const res = await deleteProductAction(p.id);
    setBusyId(null);
    if (!res.ok) return toast.error(res.error);
    toast.success(`Deleted ${p.name}`);
    router.refresh();
  }

  async function onDuplicate(p: Product) {
    setBusyId(p.id);
    const res = await duplicateProductAction(p.id);
    setBusyId(null);
    if (!res.ok) return toast.error(res.error);
    toast.success("Copy created (hidden) — edit it, then make it visible.");
    router.refresh();
  }

  async function onToggleVisible(p: Product) {
    setBusyId(p.id);
    const next = p.published === false;
    const res = await setProductPublishedAction(p.id, next);
    setBusyId(null);
    if (!res.ok) return toast.error(res.error);
    toast.success(next ? `${p.name} is now visible` : `${p.name} is now hidden`);
    router.refresh();
  }

  async function seedStarter() {
    setSeeding(true);
    const res = await importStarterAction();
    setSeeding(false);
    if (!res.ok) return toast.error(res.error);
    toast.success("Starter catalogue imported (13 products)");
    router.refresh();
  }

  return (
    <>
      <AdminPageHeader
        title="Products"
        description="Add, edit or hide the products shown on your site."
      >
        <Button disabled={!!loadError} onClick={() => openForm(null)}>
          <Plus className="h-4 w-4" /> Add product
        </Button>
      </AdminPageHeader>

      {loadError && (
        <div
          role="alert"
          className="mt-6 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-semibold">Database not ready</p>
            <p className="mt-0.5">{loadError}</p>
            <p className="mt-1 text-xs opacity-80">
              Your storefront keeps showing the built-in products until this is fixed.
            </p>
          </div>
        </div>
      )}

      {loadError ? null : items.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border bg-card py-16 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-secondary">
            <PackageOpen className="h-7 w-7 text-primary" />
          </div>
          <div>
            <p className="font-semibold">No products yet</p>
            <p className="mx-auto max-w-sm text-sm text-muted-foreground">
              Import the 13 built-in Gold &amp; Glow products to get started, then edit
              them — or add your own from scratch.
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={seedStarter} disabled={seeding}>
              {seeding ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <DownloadCloud className="h-4 w-4" />
              )}
              Import starter catalogue
            </Button>
            <Button variant="outline" onClick={() => openForm(null)}>
              Add manually
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="relative min-w-[12rem] flex-1 sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products…"
                className="h-10 pl-10"
                aria-label="Search products"
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Filter by category"
              className="h-10 rounded-xl border border-input bg-background px-3 text-sm"
            >
              <option value="all">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as typeof status)}
              aria-label="Filter by visibility"
              className="h-10 rounded-xl border border-input bg-background px-3 text-sm"
            >
              <option value="all">All</option>
              <option value="visible">Visible</option>
              <option value="hidden">Hidden</option>
            </select>
            <p className="text-sm text-muted-foreground">
              {visible.length} of {items.length}
            </p>
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border bg-card">
            <table className="w-full text-sm">
              <thead className="border-b bg-secondary/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="hidden px-4 py-3 font-semibold sm:table-cell">Category</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="hidden px-4 py-3 font-semibold md:table-cell">Flags</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                      No products match your search.
                    </td>
                  </tr>
                )}
                {visible.map((p) => {
                  const hidden = p.published === false;
                  const busy = busyId === p.id;
                  return (
                    <tr key={p.id} className={`border-b last:border-0 ${hidden ? "opacity-60" : ""}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border bg-secondary/40">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p.images[0]} alt="" className="h-full w-full object-contain p-0.5" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium">{p.name}</p>
                            <p className="truncate text-xs text-muted-foreground">{p.size}</p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{p.category}</td>
                      <td className="px-4 py-3 font-medium">{formatINR(p.price)}</td>
                      <td className="hidden px-4 py-3 md:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {hidden && <Badge variant="outline">Hidden</Badge>}
                          {p.bestSeller && <Badge variant="soft">Best</Badge>}
                          {p.new && <Badge variant="gold">New</Badge>}
                          {p.hero && <Badge variant="outline">Carousel</Badge>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          {busy ? (
                            <Loader2 className="my-1.5 h-5 w-5 animate-spin text-primary" />
                          ) : (
                            <>
                              <IconBtn
                                label={hidden ? `Show ${p.name} on site` : `Hide ${p.name} from site`}
                                onClick={() => onToggleVisible(p)}
                              >
                                {hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </IconBtn>
                              <IconBtn label={`Duplicate ${p.name}`} onClick={() => onDuplicate(p)}>
                                <Copy className="h-4 w-4" />
                              </IconBtn>
                              <IconBtn label={`Edit ${p.name}`} onClick={() => openForm(p)}>
                                <Pencil className="h-4 w-4" />
                              </IconBtn>
                              <IconBtn label={`Delete ${p.name}`} danger onClick={() => onDelete(p)}>
                                <Trash2 className="h-4 w-4" />
                              </IconBtn>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {formOpen && (
        <AdminProductForm
          initial={editing}
          onClose={() => setFormOpen(false)}
          onSaved={() => {
            setFormOpen(false);
            router.refresh();
          }}
        />
      )}
    </>
  );
}

function IconBtn({
  label,
  danger,
  onClick,
  children,
}: {
  label: string;
  danger?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`grid h-8 w-8 place-items-center rounded-lg border transition-colors ${
        danger ? "text-destructive hover:bg-destructive/10" : "hover:bg-accent"
      }`}
    >
      {children}
    </button>
  );
}

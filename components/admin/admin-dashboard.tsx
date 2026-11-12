"use client";

import * as React from "react";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Trash2,
  LogOut,
  ExternalLink,
  Loader2,
  PackageOpen,
  DownloadCloud,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/products";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/logo";
import { AdminProductForm } from "@/components/admin/admin-product-form";
import {
  deleteProductAction,
  importStarterAction,
  logoutAction,
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

  async function onDelete(p: Product) {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    const res = await deleteProductAction(p.id);
    if (!res.ok) return toast.error(res.error);
    toast.success(`Deleted ${p.name}`);
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
    <div className="min-h-screen bg-secondary/30">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
        <div className="container flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo />
            <Badge variant="soft" className="hidden sm:inline-flex">Admin</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" target="_blank">
                View site <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
            <form action={logoutAction}>
              <Button type="submit" variant="outline" size="sm">
                <LogOut className="h-4 w-4" /> Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-serif text-2xl font-bold">Products</h1>
            <p className="text-sm text-muted-foreground">
              Add, edit or remove the products shown on your site.
            </p>
          </div>
          <Button
            disabled={!!loadError}
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4" /> Add product
          </Button>
        </div>

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
                Import the 13 built-in Gold &amp; Glow products to get started, then
                edit them — or add your own from scratch.
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
              <Button
                variant="outline"
                onClick={() => {
                  setEditing(null);
                  setFormOpen(true);
                }}
              >
                Add manually
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border bg-card">
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
                {items.map((p) => (
                  <tr key={p.id} className="border-b last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border bg-secondary/40">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={p.images[0]}
                            alt=""
                            className="h-full w-full object-contain p-0.5"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium">{p.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{p.size}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                      {p.category}
                    </td>
                    <td className="px-4 py-3 font-medium">{formatINR(p.price)}</td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      <div className="flex gap-1">
                        {p.bestSeller && <Badge variant="soft">Best</Badge>}
                        {p.new && <Badge variant="gold">New</Badge>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => {
                            setEditing(p);
                            setFormOpen(true);
                          }}
                          className="grid h-8 w-8 place-items-center rounded-lg border transition-colors hover:bg-accent"
                          aria-label={`Edit ${p.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete(p)}
                          className="grid h-8 w-8 place-items-center rounded-lg border text-destructive transition-colors hover:bg-destructive/10"
                          aria-label={`Delete ${p.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

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
    </div>
  );
}

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Download, Trash2, Users } from "lucide-react";
import type { SubscriberRow } from "@/lib/site-data";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { AdminError, EmptyState } from "@/components/admin/admin-notice";
import { deleteSubscriberAction } from "@/app/admin/actions";

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { dateStyle: "medium" });

export function AdminSubscribers({
  subscribers,
  loadError,
}: {
  subscribers: SubscriberRow[];
  loadError?: string;
}) {
  const router = useRouter();

  async function remove(s: SubscriberRow) {
    if (!confirm(`Remove ${s.email} from the list?`)) return;
    const res = await deleteSubscriberAction(s.email);
    if (!res.ok) return toast.error(res.error);
    toast.success("Subscriber removed");
    router.refresh();
  }

  return (
    <>
      <AdminPageHeader
        title="Subscribers"
        description={`${subscribers.length} ${subscribers.length === 1 ? "person has" : "people have"} joined the Glow Club (footer newsletter form).`}
      >
        <Button variant="outline" asChild disabled={subscribers.length === 0}>
          <a href="/api/admin/subscribers" download>
            <Download className="h-4 w-4" /> Download CSV
          </a>
        </Button>
      </AdminPageHeader>

      {loadError ? (
        <AdminError message={loadError} />
      ) : subscribers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No subscribers yet"
          text="Emails entered in the Join the Glow Club box in your site footer are collected here."
        />
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b bg-secondary/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Joined</th>
                <th className="px-4 py-3 text-right font-semibold">Remove</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr key={s.email} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{s.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">{fmt(s.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <button
                        onClick={() => remove(s)}
                        className="grid h-8 w-8 place-items-center rounded-lg border text-destructive hover:bg-destructive/10"
                        aria-label={`Remove ${s.email}`}
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
    </>
  );
}

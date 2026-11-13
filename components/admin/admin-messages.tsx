"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Inbox, Mail, MailOpen, Trash2 } from "lucide-react";
import type { MessageRow } from "@/lib/site-data";
import { Badge } from "@/components/ui/badge";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { AdminError, EmptyState } from "@/components/admin/admin-notice";
import { deleteMessageAction, setMessageReadAction } from "@/app/admin/actions";

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

export function AdminMessages({
  messages,
  loadError,
}: {
  messages: MessageRow[];
  loadError?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState<number | null>(null);
  const unread = messages.filter((m) => !m.is_read).length;

  async function toggleRead(m: MessageRow, read: boolean) {
    const res = await setMessageReadAction(m.id, read);
    if (!res.ok) return toast.error(res.error);
    router.refresh();
  }

  async function expand(m: MessageRow) {
    const next = open === m.id ? null : m.id;
    setOpen(next);
    if (next !== null && !m.is_read) await toggleRead(m, true);
  }

  async function remove(m: MessageRow) {
    if (!confirm(`Delete the message from ${m.name}?`)) return;
    const res = await deleteMessageAction(m.id);
    if (!res.ok) return toast.error(res.error);
    toast.success("Message deleted");
    router.refresh();
  }

  return (
    <>
      <AdminPageHeader
        title="Messages"
        description={`Sent from your Contact page. ${unread} unread.`}
      />

      {loadError ? (
        <AdminError message={loadError} />
      ) : messages.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No messages yet"
          text="When a visitor uses the Contact form, their message shows up here."
        />
      ) : (
        <div className="mt-6 grid gap-3">
          {messages.map((m) => (
            <div key={m.id} className="overflow-hidden rounded-2xl border bg-card">
              <button
                type="button"
                onClick={() => expand(m)}
                className="flex w-full items-start justify-between gap-4 p-5 text-left transition-colors hover:bg-secondary/30"
                aria-expanded={open === m.id}
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className={m.is_read ? "font-medium" : "font-bold"}>{m.name}</p>
                    {!m.is_read && <Badge variant="soft">New</Badge>}
                  </div>
                  <p className="truncate text-sm text-foreground/80">
                    {m.subject || "(no subject)"}
                  </p>
                  {open !== m.id && (
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">{m.message}</p>
                  )}
                </div>
                <p className="shrink-0 text-xs text-muted-foreground">{fmt(m.created_at)}</p>
              </button>
              {open === m.id && (
                <div className="border-t bg-secondary/20 p-5">
                  <p className="whitespace-pre-wrap text-sm">{m.message}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                    <a
                      href={`mailto:${m.email}?subject=${encodeURIComponent(
                        "Re: " + (m.subject || "Your message to Gold & Glow")
                      )}`}
                      className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90"
                    >
                      <Mail className="h-4 w-4" /> Reply to {m.email}
                    </a>
                    <button
                      onClick={() => toggleRead(m, !m.is_read)}
                      className="inline-flex items-center gap-2 rounded-full border px-4 py-2 font-medium hover:bg-accent"
                    >
                      <MailOpen className="h-4 w-4" /> Mark as {m.is_read ? "unread" : "read"}
                    </button>
                    <button
                      onClick={() => remove(m)}
                      className="inline-flex items-center gap-2 rounded-full border px-4 py-2 font-medium text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

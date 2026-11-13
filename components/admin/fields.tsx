"use client";

import * as React from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

/** Labelled form row used across the admin screens. */
export function Field({
  label,
  hint,
  required,
  children,
  className,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`grid gap-1.5 ${className ?? ""}`}>
      <Label>
        {label}
        {required && <span className="text-destructive"> *</span>}
        {hint && <span className="ml-1 font-normal text-muted-foreground">({hint})</span>}
      </Label>
      {children}
    </div>
  );
}

export function Toggle({
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

/** Uploads one image to the server (auto-resized to WebP). Returns its public URL. */
export async function uploadImage(file: File): Promise<string | null> {
  try {
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body });
    const json = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
    if (!res.ok || !json.url) {
      toast.error(`${file.name}: ${json.error ?? "upload failed"}`);
      return null;
    }
    return json.url;
  } catch {
    toast.error(`${file.name}: network error while uploading`);
    return null;
  }
}

/** Single-image picker with preview (used for the homepage banner). */
export function ImageField({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [busy, setBusy] = React.useState(false);

  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    const url = await uploadImage(file);
    setBusy(false);
    if (url) onChange(url);
  }

  return (
    <div className="flex items-center gap-3">
      <div className="relative h-24 w-36 shrink-0 overflow-hidden rounded-xl border bg-secondary/40">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center text-xs text-muted-foreground">
            No image
          </div>
        )}
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-foreground/80 text-background"
            aria-label="Remove image"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
        {value ? "Replace image" : "Upload image"}
        <input type="file" accept="image/*" className="hidden" onChange={pick} disabled={busy} />
      </label>
    </div>
  );
}

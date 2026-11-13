"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, RotateCcw, Save } from "lucide-react";
import { DEFAULT_SETTINGS, type SiteSettings } from "@/lib/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, ImageField, Toggle } from "@/components/admin/fields";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { cn } from "@/lib/utils";
import { resetSettingsAction, saveSettingsAction } from "@/app/admin/actions";

const SECTIONS = [
  { id: "home", label: "Homepage" },
  { id: "banner", label: "Feature banner" },
  { id: "contact", label: "Contact & social" },
  { id: "site", label: "Announcement & SEO" },
] as const;
type SectionId = (typeof SECTIONS)[number]["id"];

export function AdminSettings({ initial }: { initial: SiteSettings }) {
  const router = useRouter();
  const [s, setS] = React.useState<SiteSettings>(initial);
  const [section, setSection] = React.useState<SectionId>("home");
  const [saving, setSaving] = React.useState(false);
  const dirty = JSON.stringify(s) !== JSON.stringify(initial);

  const set = <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) =>
    setS((p) => ({ ...p, [k]: v }));

  async function save() {
    setSaving(true);
    const res = await saveSettingsAction(s);
    setSaving(false);
    if (!res.ok) return toast.error(res.error);
    toast.success("Settings saved. Your website is updated.");
    router.refresh();
  }

  async function reset() {
    if (!confirm("Reset ALL site settings to the original defaults?")) return;
    const res = await resetSettingsAction();
    if (!res.ok) return toast.error(res.error);
    setS(DEFAULT_SETTINGS);
    toast.success("Settings reset to defaults");
    router.refresh();
  }

  return (
    <>
      <AdminPageHeader
        title="Settings"
        description="Edit the text, banner and contact details shown across your website."
      >
        <Button variant="outline" onClick={reset}>
          <RotateCcw className="h-4 w-4" /> Reset to defaults
        </Button>
        <Button onClick={save} disabled={saving || !dirty}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save changes
        </Button>
      </AdminPageHeader>

      {/* Sub-navigation */}
      <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Settings sections">
        {SECTIONS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={section === t.id}
            onClick={() => setSection(t.id)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              section === t.id
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border bg-card p-6">
        {section === "home" && (
          <div className="grid gap-5">
            <Field label="Small badge above the heading">
              <Input value={s.heroBadge} onChange={(e) => set("heroBadge", e.target.value)} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Heading — first part" hint="dark">
                <Input value={s.heroLine1} onChange={(e) => set("heroLine1", e.target.value)} />
              </Field>
              <Field label="Heading — gold word" hint="gold">
                <Input value={s.heroGold} onChange={(e) => set("heroGold", e.target.value)} />
              </Field>
              <Field label="Heading — last word" hint="pink">
                <Input value={s.heroAccent} onChange={(e) => set("heroAccent", e.target.value)} />
              </Field>
            </div>
            <Field label="Text under the heading">
              <Textarea
                rows={3}
                value={s.heroDescription}
                onChange={(e) => set("heroDescription", e.target.value)}
              />
            </Field>
            <div className="rounded-xl border p-4">
              <Toggle
                label="Show the star-rating line under the buttons"
                checked={s.showRating}
                onChange={(v) => set("showRating", v)}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Only show this if the numbers are real.
              </p>
              {s.showRating && (
                <div className="mt-3 grid gap-4 sm:grid-cols-[8rem_1fr]">
                  <Field label="Score">
                    <Input value={s.ratingScore} onChange={(e) => set("ratingScore", e.target.value)} />
                  </Field>
                  <Field label="Text after the score">
                    <Input value={s.ratingText} onChange={(e) => set("ratingText", e.target.value)} />
                  </Field>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              The product slider next to the heading is controlled from the Products tab
              (Home carousel switch on each product).
            </p>
          </div>
        )}

        {section === "banner" && (
          <div className="grid gap-5">
            <Toggle
              label="Show the feature banner on the homepage"
              checked={s.bannerEnabled}
              onChange={(v) => set("bannerEnabled", v)}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Small badge">
                <Input value={s.bannerBadge} onChange={(e) => set("bannerBadge", e.target.value)} />
              </Field>
              <Field label="Title">
                <Input value={s.bannerTitle} onChange={(e) => set("bannerTitle", e.target.value)} />
              </Field>
            </div>
            <Field label="Text">
              <Textarea
                rows={3}
                value={s.bannerText}
                onChange={(e) => set("bannerText", e.target.value)}
              />
            </Field>
            <Field label="Highlights" hint="one per line, up to 3">
              <Textarea
                rows={3}
                value={s.bannerFeatures.join("\n")}
                onChange={(e) => set("bannerFeatures", e.target.value.split("\n"))}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Button text">
                <Input
                  value={s.bannerButtonLabel}
                  onChange={(e) => set("bannerButtonLabel", e.target.value)}
                />
              </Field>
              <Field label="Button link" hint="/shop?category=… or https://…">
                <Input
                  value={s.bannerButtonLink}
                  onChange={(e) => set("bannerButtonLink", e.target.value)}
                />
              </Field>
            </div>
            <Field label="Banner image">
              <ImageField value={s.bannerImage} onChange={(url) => set("bannerImage", url)} />
            </Field>
          </div>
        )}

        {section === "contact" && (
          <div className="grid gap-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Support email">
                <Input type="email" value={s.email} onChange={(e) => set("email", e.target.value)} />
              </Field>
              <Field label="Phone">
                <Input value={s.phone} onChange={(e) => set("phone", e.target.value)} />
              </Field>
            </div>
            <Field label="Address">
              <Input value={s.address} onChange={(e) => set("address", e.target.value)} />
            </Field>
            <Field label="Working hours">
              <Input value={s.hours} onChange={(e) => set("hours", e.target.value)} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Instagram link" hint="empty = hidden">
                <Input
                  value={s.instagram}
                  onChange={(e) => set("instagram", e.target.value)}
                  placeholder="https://instagram.com/…"
                />
              </Field>
              <Field label="Facebook link" hint="empty = hidden">
                <Input
                  value={s.facebook}
                  onChange={(e) => set("facebook", e.target.value)}
                  placeholder="https://facebook.com/…"
                />
              </Field>
              <Field label="YouTube link" hint="empty = hidden">
                <Input
                  value={s.youtube}
                  onChange={(e) => set("youtube", e.target.value)}
                  placeholder="https://youtube.com/…"
                />
              </Field>
            </div>
          </div>
        )}

        {section === "site" && (
          <div className="grid gap-5">
            <Toggle
              label="Show the announcement bar at the top of every page"
              checked={s.announcementEnabled}
              onChange={(v) => set("announcementEnabled", v)}
            />
            <Field label="Announcement text" hint="wrap words in **double stars** to make them bold">
              <Input
                value={s.announcement}
                onChange={(e) => set("announcement", e.target.value)}
              />
            </Field>
            <hr />
            <Field label="Google title" hint="shown in search results & browser tab">
              <Input value={s.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} />
            </Field>
            <Field label="Google description">
              <Textarea
                rows={3}
                value={s.seoDescription}
                onChange={(e) => set("seoDescription", e.target.value)}
              />
            </Field>
          </div>
        )}
      </div>
    </>
  );
}

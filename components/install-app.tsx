"use client";

import * as React from "react";
import Image from "next/image";
import { Download, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Shared install state                                                */
/* ------------------------------------------------------------------ */

type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};
type InstallWindow = Window & { __ggInstall?: InstallEvent };
type Snapshot = { event: InstallEvent | null; installed: boolean };

const SERVER_SNAPSHOT: Snapshot = { event: null, installed: true }; // nothing is shown on the server
let snapshot: Snapshot = { event: null, installed: false };
const listeners = new Set<() => void>();
let started = false;

function update(next: Snapshot) {
  snapshot = next;
  listeners.forEach((l) => l());
}

/**
 * Chrome fires `beforeinstallprompt` once, often before React has hydrated. A tiny head
 * script in app/layout.tsx stores that event on `window.__ggInstall`; this picks it up
 * (and also listens directly, in case the head script did not run).
 */
function start() {
  if (started) return;
  started = true;
  const w = window as InstallWindow;
  if (w.__ggInstall) snapshot = { ...snapshot, event: w.__ggInstall };
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    w.__ggInstall = e as InstallEvent;
    update({ ...snapshot, event: e as InstallEvent });
  });
  window.addEventListener("appinstalled", () => {
    w.__ggInstall = undefined;
    update({ event: null, installed: true });
  });
}

function subscribe(cb: () => void) {
  start();
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}
const getSnapshot = () => snapshot;
const getServerSnapshot = () => SERVER_SNAPSHOT;

const noSubscribe = () => () => {};
const isStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true;
const isIOSDevice = () => /iPad|iPhone|iPod/.test(navigator.userAgent);

function useInstall() {
  const snap = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const standalone = React.useSyncExternalStore(noSubscribe, isStandalone, () => true);
  const isIOS = React.useSyncExternalStore(noSubscribe, isIOSDevice, () => false);

  const hidden = standalone || snap.installed;
  const canPrompt = !!snap.event;

  /** Opens the browser's install dialog, or explains how to install when it has none. */
  const install = React.useCallback(async (): Promise<"accepted" | "dismissed" | "manual"> => {
    const ev = snapshot.event;
    if (ev) {
      await ev.prompt();
      const { outcome } = await ev.userChoice;
      (window as InstallWindow).__ggInstall = undefined;
      update({ event: null, installed: outcome === "accepted" });
      return outcome;
    }
    toast.info(
      isIOSDevice()
        ? "Tap the Share button in Safari, then choose “Add to Home Screen”."
        : "Open your browser menu (⋮ or ⋯) and choose “Install app” or “Add to Home screen”.",
      { duration: 9000 }
    );
    return "manual";
  }, []);

  return { hidden, canPrompt, isIOS, install };
}

/* ------------------------------------------------------------------ */
/* Install button (header + footer)                                    */
/* ------------------------------------------------------------------ */

/**
 * "Install" button. Always visible until the site runs as an installed app, so there is
 * never a missing button: it opens the real install dialog when the browser offers one,
 * and otherwise shows how to install from the browser menu / Share sheet.
 */
export function InstallApp({ variant = "footer" }: { variant?: "footer" | "header" }) {
  const { hidden, install } = useInstall();
  if (hidden) return null;

  return (
    <button
      type="button"
      onClick={() => void install()}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium transition-colors hover:bg-primary hover:text-primary-foreground",
        variant === "header"
          ? "h-9 border-primary/40 bg-background px-3 text-sm text-primary"
          : "bg-background px-3 py-1.5 text-foreground"
      )}
    >
      <Download className={variant === "header" ? "h-4 w-4" : "h-3.5 w-3.5"} />
      {variant === "header" ? "Install" : "Install app"}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Install popup                                                       */
/* ------------------------------------------------------------------ */

const SNOOZE_KEY = "gg-install-snoozed-until";
const SNOOZE_MS = 7 * 24 * 60 * 60 * 1000;
const SHOW_AFTER_MS = 1500;

function snoozed() {
  try {
    return Number(localStorage.getItem(SNOOZE_KEY) ?? 0) > Date.now();
  } catch {
    return false;
  }
}
function snooze() {
  try {
    localStorage.setItem(SNOOZE_KEY, String(Date.now() + SNOOZE_MS));
  } catch {
    /* private mode: it just may show again next visit */
  }
}

/**
 * Our own "Install Gold & Glow" card: it appears 1.5 seconds after the browser says the
 * site is installable (or straight away on iPhone, which has no install event), instead of
 * waiting for Chrome's small, unreliable prompt. "Not now" hides it for a week.
 */
export function InstallPrompt() {
  const { hidden, canPrompt, isIOS, install } = useInstall();
  const eligible = !hidden && (canPrompt || isIOS);
  const [armed, setArmed] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(false);

  React.useEffect(() => {
    if (!eligible || snoozed()) return;
    const t = window.setTimeout(() => setArmed(true), SHOW_AFTER_MS);
    return () => window.clearTimeout(t);
  }, [eligible]);

  if (!eligible || !armed || dismissed) return null;

  const close = () => {
    snooze();
    setDismissed(true);
  };

  return (
    <div
      role="dialog"
      aria-label="Install the Gold & Glow app"
      className="fixed inset-x-3 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-50 animate-in fade-in slide-in-from-bottom-4 rounded-2xl border bg-background p-4 shadow-xl duration-300 sm:inset-x-auto sm:left-6 sm:w-[22rem] lg:bottom-6"
    >
      <button
        type="button"
        onClick={close}
        aria-label="Close"
        className="absolute right-2 top-2 rounded-full p-1.5 text-muted-foreground hover:bg-accent"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex items-start gap-3 pr-6">
        <Image
          src="/icons/icon-192.png"
          alt=""
          width={48}
          height={48}
          className="h-12 w-12 shrink-0 rounded-xl border"
        />
        <div className="min-w-0">
          <p className="font-serif text-base font-semibold leading-tight">Install Gold &amp; Glow</p>
          <p className="mt-1 text-xs leading-snug text-muted-foreground">
            {canPrompt
              ? "Add the app to your home screen: opens faster and works even with a weak connection."
              : "On iPhone: tap the Share button in Safari, then choose “Add to Home Screen”."}
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={close}>
          Not now
        </Button>
        {canPrompt && (
          <Button
            type="button"
            size="sm"
            onClick={async () => {
              const result = await install();
              if (result === "dismissed") close();
            }}
          >
            <Download className="h-4 w-4" /> Install
          </Button>
        )}
      </div>
    </div>
  );
}

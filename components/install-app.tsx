"use client";

import * as React from "react";
import Image from "next/image";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { INSTALL_HELP_IOS, useInstall } from "@/lib/use-install";
import { cn } from "@/lib/utils";

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

const SNOOZE_KEY = "gg-install-snoozed-until";
const SNOOZE_MS = 7 * 24 * 60 * 60 * 1000;
/** Chrome/Android: wait a moment after the install event so the page can settle first. */
const SHOW_AFTER_PROMPT_MS = 1500;

function isInstallSnoozed() {
  try {
    return Number(localStorage.getItem(SNOOZE_KEY) ?? 0) > Date.now();
  } catch {
    return false;
  }
}
function snoozeInstallPrompt() {
  try {
    localStorage.setItem(SNOOZE_KEY, String(Date.now() + SNOOZE_MS));
  } catch {
    /* private mode: it just may show again next visit */
  }
}

/**
 * Our own "Install Gold & Glow" card. On Chrome/Android it appears 1.5 seconds after the
 * browser says the site is installable (instead of waiting for Chrome's small, unreliable
 * prompt); on iPhone, which has no install event, it appears straight away with the
 * Add to Home Screen steps. "Not now" hides it for a week.
 */
export function InstallPrompt() {
  const { hidden, canPrompt, isIOS, install } = useInstall();
  const eligible = !hidden && (canPrompt || isIOS);
  const [armed, setArmed] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(false);

  React.useEffect(() => {
    if (!eligible || isInstallSnoozed()) return;
    const t = window.setTimeout(() => setArmed(true), canPrompt ? SHOW_AFTER_PROMPT_MS : 0);
    return () => window.clearTimeout(t);
  }, [eligible, canPrompt]);

  if (!eligible || !armed || dismissed) return null;

  const close = () => {
    snoozeInstallPrompt();
    setDismissed(true);
  };

  return (
    <div
      role="dialog"
      aria-label="Install the Gold & Glow app"
      className="install-popup fixed inset-x-3 z-50 animate-in fade-in slide-in-from-bottom-4 rounded-2xl border bg-background p-4 shadow-xl duration-300 sm:inset-x-auto sm:left-6 sm:w-[22rem]"
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
              : INSTALL_HELP_IOS}
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

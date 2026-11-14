"use client";

import * as React from "react";
import { Download } from "lucide-react";

type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

/**
 * Small "Install app" button for the footer.
 *  - Chrome / Edge / Android: uses the browser's install prompt when it is available.
 *  - iPhone / iPad Safari (no install prompt exists): shows how to Add to Home Screen.
 *  - Hidden once the site is already running as an installed app.
 */
export function InstallApp() {
  const [promptEvent, setPromptEvent] = React.useState<InstallEvent | null>(null);
  const [isIOS, setIsIOS] = React.useState(false);
  const [installed, setInstalled] = React.useState(true); // hidden until we know
  const [showHint, setShowHint] = React.useState(false);

  React.useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    setInstalled(standalone);
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));

    const onPrompt = (e: Event) => {
      e.preventDefault(); // keep it for our own button
      setPromptEvent(e as InstallEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setPromptEvent(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed || (!promptEvent && !isIOS)) return null;

  async function install() {
    if (promptEvent) {
      await promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      if (outcome === "accepted") setInstalled(true);
      setPromptEvent(null);
    } else {
      setShowHint((v) => !v);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2 sm:items-end">
      <button
        type="button"
        onClick={install}
        className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1.5 font-medium text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
      >
        <Download className="h-3.5 w-3.5" /> Install app
      </button>
      {showHint && (
        <p className="max-w-[16rem] text-center text-[0.7rem] leading-snug sm:text-right">
          On iPhone or iPad: tap the <strong>Share</strong> button in Safari, then choose{" "}
          <strong>Add to Home Screen</strong>.
        </p>
      )}
    </div>
  );
}

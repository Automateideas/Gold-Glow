import * as React from "react";
import { toast } from "sonner";

/**
 * Shared "install the app" state for every install button / popup.
 *
 * Chrome fires `beforeinstallprompt` once, often before React has hydrated. A tiny head
 * script in app/layout.tsx stores that event on `window.__ggInstall`; this module picks it
 * up (and also listens directly, in case the head script did not run).
 */

type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};
type InstallWindow = Window & { __ggInstall?: InstallEvent };
type Snapshot = { event: InstallEvent | null; installed: boolean };

export const INSTALL_HELP_IOS = "Tap the Share button in Safari, then choose “Add to Home Screen”.";
const INSTALL_HELP_OTHER = "Open your browser menu (⋮ or ⋯) and choose “Install app” or “Add to Home screen”.";
const INSTALL_HELP_CANCELLED =
  "Installation was cancelled. You can still install any time from your browser menu (⋮ or ⋯) → “Install app”.";

const SERVER_SNAPSHOT: Snapshot = { event: null, installed: true }; // nothing is shown on the server
let snapshot: Snapshot = { event: null, installed: false };
let cancelledOnce = false;
const listeners = new Set<() => void>();
let started = false;

function update(next: Snapshot) {
  snapshot = next;
  listeners.forEach((l) => l());
}

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

export type InstallResult = "accepted" | "dismissed" | "manual";

export function useInstall() {
  const snap = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const standalone = React.useSyncExternalStore(noSubscribe, isStandalone, () => true);
  const isIOS = React.useSyncExternalStore(noSubscribe, isIOSDevice, () => false);

  /** Opens the browser's install dialog, or explains how to install when it has none. */
  const install = React.useCallback(async (): Promise<InstallResult> => {
    const ev = snapshot.event;
    if (ev) {
      await ev.prompt();
      const { outcome } = await ev.userChoice;
      (window as InstallWindow).__ggInstall = undefined;
      if (outcome === "dismissed") cancelledOnce = true;
      update({ event: null, installed: outcome === "accepted" });
      return outcome;
    }
    toast.info(isIOSDevice() ? INSTALL_HELP_IOS : cancelledOnce ? INSTALL_HELP_CANCELLED : INSTALL_HELP_OTHER, {
      duration: 9000,
    });
    return "manual";
  }, []);

  return {
    hidden: standalone || snap.installed,
    canPrompt: !!snap.event,
    isIOS,
    install,
  };
}

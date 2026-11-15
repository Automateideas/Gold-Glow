"use client";

import * as React from "react";

/**
 * Registers the service worker (public/sw.js) in production only. In development
 * a service worker would cache stale code and fight hot reloading, so any old
 * one is removed instead.
 */
export function PwaRegister() {
  React.useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((r) => r.unregister()));
      return;
    }

    // Register right after hydration, not on the window "load" event: this page loads many
    // images, so "load" fires late, and Chrome only offers installation once the service
    // worker is active. Registering early is what makes the install prompt arrive quickly.
    navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .catch((err) => console.warn("Service worker registration failed:", err));
  }, []);

  return null;
}

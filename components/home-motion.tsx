"use client";

import * as React from "react";
import { animate, utils } from "animejs";

/**
 * Motion for the home page, "Liquid Glow" style: everything behaves like light
 * and liquid instead of generic fade-ups.
 *
 *  - Intro: the hero text is revealed by a circular ripple that spreads out of the product drop.
 *  - Sections: headings are uncovered by a soft, feathered sweep of light.
 *  - Grids: cards fill up from the bottom like liquid filling a bottle.
 *  - Cursor: a soft gold glow follows the mouse and lights up whichever card it is over.
 *
 * Performance notes: styles are written straight onto the elements (no animated CSS
 * variables, which would re-style every child on every frame); `will-change` is only
 * set while an element is animating; the cursor light only moves with `transform`.
 * It only decorates server-rendered HTML and does nothing for reduced-motion visitors.
 */

type Anim = { revert: () => unknown };

const hint = (el: HTMLElement, props: string) => {
  el.style.willChange = props;
};
const unhint = (el: HTMLElement) => {
  el.style.willChange = "";
};

export function HomeMotion() {
  // Layout effect: runs before the browser paints, so hidden elements never flash.
  React.useLayoutEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.remove("motion");
      return;
    }
    const scope = document.querySelector<HTMLElement>("[data-motion-scope]");
    if (!scope) return;

    root.classList.add("motion");
    root.dataset.motionReady = "1"; // tells the failsafe in layout.tsx that we took over

    const anims: Anim[] = [];
    const cleanups: Array<() => void> = [];
    const q = <T extends HTMLElement>(sel: string) => Array.from(scope.querySelectorAll<T>(sel));

    /* ------------------- intro: ripple out of the product drop ------------------- */
    const source = scope.querySelector<HTMLElement>("[data-ripple-source]");
    const ripple = scope.querySelector<HTMLElement>("[data-ripple]");
    if (source) {
      anims.push(animate(source, { opacity: [0, 1], scale: [0.7, 1], duration: 1100, ease: "outExpo" }));
    }
    if (ripple) {
      const rr = ripple.getBoundingClientRect();
      const sr = (source ?? ripple).getBoundingClientRect();
      const ox = sr.left + sr.width / 2 - rr.left;
      const oy = sr.top + sr.height / 2 - rr.top;
      const maxR = Math.hypot(Math.max(ox, rr.width - ox), Math.max(oy, rr.height - oy));
      const state = { r: 0 };
      hint(ripple, "clip-path");
      anims.push(
        animate(state, {
          r: [0, maxR],
          duration: 1300,
          delay: 150,
          ease: "outExpo",
          onUpdate: () => {
            ripple.style.clipPath = `circle(${state.r}px at ${ox}px ${oy}px)`;
          },
          onComplete: () => {
            ripple.style.clipPath = "none";
            unhint(ripple);
          },
        })
      );
    }

    /* ----------------- sections: feathered sweep of light + liquid fill ----------------- */
    const glowLayers = new WeakMap<HTMLElement, HTMLElement>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          io.unobserve(el);

          if (el.hasAttribute("data-reveal-stagger")) {
            const kids = Array.from(el.children) as HTMLElement[];
            const step = Math.min(80, 420 / Math.max(kids.length, 1));
            kids.forEach((k, i) => {
              // A small overlay the cursor light is painted on (see pointermove below).
              const layer = document.createElement("div");
              layer.setAttribute("aria-hidden", "true");
              layer.className = "glow-layer";
              k.setAttribute("data-glow", "");
              k.appendChild(layer);
              glowLayers.set(k, layer);
              cleanups.push(() => layer.remove());

              const state = { v: 100 };
              hint(k, "clip-path, transform");
              anims.push(
                animate(state, {
                  v: [100, 0],
                  duration: 800,
                  delay: i * step,
                  ease: "outCubic",
                  onUpdate: () => {
                    k.style.clipPath = `inset(${state.v}% 0 0 0 round 22px)`;
                    k.style.transform = `translateY(${state.v * 0.16}px)`;
                  },
                  onComplete: () => {
                    k.style.clipPath = "none"; // clip-path would also cut off the card's shadow
                    k.style.transform = "";
                    unhint(k);
                  },
                })
              );
            });
          } else {
            const dir = el.dataset.reveal === "right" ? 270 : 90;
            const state = { p: 0 };
            hint(el, "mask-image");
            anims.push(
              animate(state, {
                p: [0, 118],
                duration: 1000,
                ease: "inOutSine",
                onUpdate: () => {
                  const m = `linear-gradient(${dir}deg, #000 ${state.p - 16}%, transparent ${state.p}%)`;
                  el.style.maskImage = m;
                  el.style.setProperty("-webkit-mask-image", m);
                },
                onComplete: () => {
                  el.style.maskImage = "none";
                  el.style.setProperty("-webkit-mask-image", "none");
                  unhint(el);
                },
              })
            );
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    q("[data-reveal], [data-reveal-stagger]").forEach((g) => io.observe(g));
    cleanups.push(() => io.disconnect());

    /* ---------------- cursor: a soft gold light that lights up cards ---------------- */
    if (window.matchMedia("(pointer: fine)").matches) {
      const glow = document.createElement("div");
      glow.setAttribute("aria-hidden", "true");
      glow.className = "cursor-glow";
      document.body.appendChild(glow);
      cleanups.push(() => glow.remove());

      let tx = -999;
      let ty = -999;
      let x = tx;
      let y = ty;
      let raf = 0;
      let pendingCard: { layer: HTMLElement; x: number; y: number } | null = null;

      const tick = () => {
        x += (tx - x) * 0.14;
        y += (ty - y) * 0.14;
        glow.style.transform = `translate3d(${x - 230}px, ${y - 230}px, 0)`;
        if (pendingCard) {
          const { layer, x: cx, y: cy } = pendingCard;
          layer.style.background = `radial-gradient(240px circle at ${cx}px ${cy}px, hsl(var(--gold) / 0.42), hsl(var(--primary) / 0.12) 48%, transparent 72%)`;
          pendingCard = null;
        }
        raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 || pendingCard ? requestAnimationFrame(tick) : 0;
      };
      const onMove = (e: PointerEvent) => {
        if (tx === -999) {
          x = e.clientX;
          y = e.clientY;
        }
        tx = e.clientX;
        ty = e.clientY;
        glow.style.opacity = "1";

        const card = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-glow]");
        const layer = card && glowLayers.get(card);
        if (card && layer) {
          const r = card.getBoundingClientRect();
          pendingCard = { layer, x: utils.clamp(e.clientX - r.left, 0, r.width), y: utils.clamp(e.clientY - r.top, 0, r.height) };
        }
        if (!raf) raf = requestAnimationFrame(tick);
      };
      const onLeave = () => {
        glow.style.opacity = "0";
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
      cleanups.push(() => {
        window.removeEventListener("pointermove", onMove);
        document.documentElement.removeEventListener("pointerleave", onLeave);
        if (raf) cancelAnimationFrame(raf);
      });
    }

    return () => {
      anims.forEach((a) => a.revert());
      cleanups.forEach((fn) => fn());
      scope.querySelectorAll("[data-glow]").forEach((el) => el.removeAttribute("data-glow"));
    };
  }, []);

  return null;
}

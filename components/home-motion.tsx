"use client";

import * as React from "react";
import { animate, stagger, utils } from "animejs";

/**
 * Motion for the home page, "Liquid Glow" style: everything behaves like light
 * and liquid instead of generic fade-ups.
 *
 *  - Intro: the hero text is revealed by a circular ripple that spreads out of the product drop.
 *  - Sections: headings are uncovered by a soft, feathered sweep of light.
 *  - Grids: cards fill up from the bottom like liquid filling a bottle.
 *  - Cursor: a soft gold glow follows the mouse and lights up whichever card it is over.
 *
 * It only decorates server-rendered HTML (content stays in the page source) and does
 * nothing for visitors who prefer reduced motion. Only cheap properties are animated.
 */

type Anim = { revert: () => unknown };

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
      anims.push(
        animate(source, { opacity: [0, 1], scale: [0.7, 1], duration: 1100, ease: "outExpo" })
      );
    }
    if (ripple) {
      const rr = ripple.getBoundingClientRect();
      const sr = (source ?? ripple).getBoundingClientRect();
      ripple.style.setProperty("--ox", `${sr.left + sr.width / 2 - rr.left}px`);
      ripple.style.setProperty("--oy", `${sr.top + sr.height / 2 - rr.top}px`);
      anims.push(
        animate(ripple, {
          "--r": [0, 170],
          duration: 1300,
          delay: 150,
          ease: "outExpo",
          onComplete: () => {
            ripple.style.clipPath = "none";
          },
        })
      );
    }

    /* ----------------- sections: feathered sweep of light + liquid fill ----------------- */
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          io.unobserve(el);

          if (el.hasAttribute("data-reveal-stagger")) {
            const kids = Array.from(el.children) as HTMLElement[];
            kids.forEach((k) => k.setAttribute("data-glow", ""));
            anims.push(
              animate(kids, {
                "--fill": [100, 0],
                translateY: [18, 0],
                duration: 900,
                delay: stagger(Math.min(80, 420 / Math.max(kids.length, 1))),
                ease: "outCubic",
                onComplete: () => kids.forEach((k) => (k.style.clipPath = "none")),
              })
            );
          } else {
            anims.push(
              animate(el, {
                "--p": [0, 118],
                duration: 1100,
                ease: "inOutSine",
                onComplete: () => {
                  el.style.maskImage = "none";
                  el.style.setProperty("-webkit-mask-image", "none");
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
      const tick = () => {
        x += (tx - x) * 0.14;
        y += (ty - y) * 0.14;
        glow.style.transform = `translate3d(${x - 230}px, ${y - 230}px, 0)`;
        raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(tick) : 0;
      };
      const onMove = (e: PointerEvent) => {
        if (tx === -999) {
          x = e.clientX;
          y = e.clientY;
        }
        tx = e.clientX;
        ty = e.clientY;
        glow.style.opacity = "1";
        if (!raf) raf = requestAnimationFrame(tick);

        // Light up the card under the cursor (CSS reads --mx / --my).
        const card = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-glow]");
        if (card) {
          const r = card.getBoundingClientRect();
          card.style.setProperty("--mx", `${utils.clamp(e.clientX - r.left, 0, r.width)}px`);
          card.style.setProperty("--my", `${utils.clamp(e.clientY - r.top, 0, r.height)}px`);
        }
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

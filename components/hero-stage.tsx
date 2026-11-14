"use client";

import * as React from "react";
import { animate } from "animejs";
import type { Product } from "@/lib/products";
import { HeroCarousel } from "@/components/hero-carousel";
import { BLOB_PATH_PHOTO, BLOB_SHAPES, blobPath, shapeAt } from "@/lib/blob";

const SLIDE_MS = 6500;
const MORPH_MS_PER_SHAPE = 6500;

/** Soft colour wash for the hero background, built from a product's own accent colour ("H S% L%"). */
const tintBg = (shade: string) =>
  `radial-gradient(55% 70% at 78% 48%, hsl(${shade} / 0.30), transparent 72%), radial-gradient(42% 52% at 6% 14%, hsl(${shade} / 0.13), transparent 70%)`;

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * The hero section, "Liquid Glow" style:
 *  - the product sits in a slowly morphing liquid drop;
 *  - when the product changes, its colour floods the hero from the drop outwards
 *    (a circular liquid wipe), so the whole page takes on that product's colour.
 * The headline/buttons (server-rendered) come in as `children`.
 */
export function HeroStage({ products, children }: { products: Product[]; children: React.ReactNode }) {
  const count = products.length;
  const first = products[0]?.shade ?? "335 82% 46%";

  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  const sectionRef = React.useRef<HTMLElement>(null);
  const baseRef = React.useRef<HTMLDivElement>(null);
  const wipeRef = React.useRef<HTMLDivElement>(null);
  const clipRef = React.useRef<SVGPathElement>(null);
  const ringRef = React.useRef<SVGPathElement>(null);
  const shownIndex = React.useRef(0);
  const wipeAnim = React.useRef<{ revert: () => unknown } | null>(null);

  /* ---- autoplay ---- */
  React.useEffect(() => {
    if (count < 2 || paused || prefersReducedMotion()) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), SLIDE_MS);
    return () => clearInterval(t);
  }, [count, paused]);

  /* ---- liquid colour wipe when the product changes ---- */
  React.useEffect(() => {
    if (shownIndex.current === index) return;
    shownIndex.current = index;
    const shade = products[index]?.shade;
    const section = sectionRef.current;
    const base = baseRef.current;
    const wipe = wipeRef.current;
    if (!shade || !section || !base || !wipe) return;

    section.style.setProperty("--tint", shade); // halo colour (fades via CSS)
    if (prefersReducedMotion()) {
      base.style.background = tintBg(shade);
      return;
    }

    wipeAnim.current?.revert();
    // The wipe grows out of the drop's centre.
    const s = section.getBoundingClientRect();
    const r = (ringRef.current?.ownerSVGElement ?? section).getBoundingClientRect();
    const x = r.left - s.left + r.width / 2;
    const y = r.top - s.top + r.height / 2;
    const maxR = Math.hypot(Math.max(x, s.width - x), Math.max(y, s.height - y));

    wipe.style.background = tintBg(shade);
    const state = { r: 0 };
    wipeAnim.current = animate(state, {
      r: [0, maxR],
      duration: 1100,
      ease: "inOutQuart",
      onUpdate: () => {
        wipe.style.clipPath = `circle(${state.r}px at ${x}px ${y}px)`;
      },
      onComplete: () => {
        base.style.background = tintBg(shade);
        wipe.style.clipPath = "circle(0px at 50% 50%)";
      },
    });
  }, [index, products]);

  /* ---- the drop slowly changes shape ---- */
  React.useEffect(() => {
    const clip = clipRef.current;
    const ring = ringRef.current;
    const section = sectionRef.current;
    if (!clip || !ring || !section || prefersReducedMotion()) return;

    const n = BLOB_SHAPES.length;
    const state = { t: 0 };
    const morph = animate(state, {
      t: [0, n],
      duration: n * MORPH_MS_PER_SHAPE,
      ease: "linear",
      loop: true,
      onUpdate: () => {
        clip.setAttribute("d", blobPath(shapeAt(BLOB_SHAPES, state.t)));
        ring.setAttribute("d", blobPath(shapeAt(BLOB_SHAPES, state.t + 1.5)));
      },
    });
    // Don't burn CPU while the hero is scrolled out of view.
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? morph.play() : morph.pause()));
    io.observe(section);
    return () => {
      io.disconnect();
      morph.revert();
      clip.setAttribute("d", BLOB_PATH_PHOTO);
    };
  }, []);

  React.useEffect(
    () => () => {
      wipeAnim.current?.revert();
    },
    []
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ ["--tint" as string]: first }}
    >
      {/* Colour wash. `base` is the current colour, `wipe` floods over it on a change. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div ref={baseRef} className="absolute inset-0" style={{ background: tintBg(first) }} />
        <div
          ref={wipeRef}
          className="absolute inset-0"
          style={{ clipPath: "circle(0px at 50% 50%)" }}
        />
      </div>

      <div className="container relative grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
        {children}
        <HeroCarousel
          products={products}
          index={index}
          onSelect={setIndex}
          onPause={setPaused}
          clipRef={clipRef}
          ringRef={ringRef}
        />
      </div>
    </section>
  );
}

/**
 * Organic "liquid" blob shapes for the home hero. Each shape is just 8 radii
 * (distance from the centre at 45° steps), so two shapes can be blended smoothly
 * and turned into a closed Bézier path in a 0..1 box. Fixed numbers (no random),
 * so the server and the browser always draw the same first frame.
 */
export const BLOB_SHAPES: number[][] = [
  [0.46, 0.4, 0.45, 0.38, 0.46, 0.41, 0.44, 0.39],
  [0.4, 0.46, 0.39, 0.45, 0.41, 0.47, 0.38, 0.44],
  [0.44, 0.38, 0.47, 0.42, 0.37, 0.45, 0.43, 0.46],
  [0.38, 0.44, 0.41, 0.47, 0.44, 0.39, 0.46, 0.41],
];

const STEPS = 8;

/** Blend two radius sets (t = 0..1). */
export function mixRadii(a: number[], b: number[], t: number): number[] {
  return a.map((r, i) => r + (b[i] - r) * t);
}

/** Point `shape` at fractional position `t` through the shape list (loops). */
export function shapeAt(shapes: number[][], t: number): number[] {
  const n = shapes.length;
  const floor = Math.floor(t);
  const f = t - floor;
  const eased = f * f * (3 - 2 * f); // smoothstep: slow in, slow out
  return mixRadii(shapes[((floor % n) + n) % n], shapes[(((floor + 1) % n) + n) % n], eased);
}

const fmt = (n: number) => Math.round(n * 1e4) / 1e4;

/** Closed, smooth Bézier path (Catmull-Rom → cubic) for the given radii. All shapes have the same structure. */
export function blobPath(radii: number[]): string {
  const pts = radii.map((r, i) => {
    const a = (i / STEPS) * Math.PI * 2 - Math.PI / 2;
    return [0.5 + r * Math.cos(a), 0.5 + r * Math.sin(a)] as const;
  });
  const at = (i: number) => pts[((i % STEPS) + STEPS) % STEPS];
  let d = `M${fmt(pts[0][0])} ${fmt(pts[0][1])}`;
  for (let i = 0; i < STEPS; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C${fmt(c1x)} ${fmt(c1y)} ${fmt(c2x)} ${fmt(c2y)} ${fmt(p2[0])} ${fmt(p2[1])}`;
  }
  return `${d}Z`;
}

/** Initial paths drawn on the server: photo mask and the tinted ring behind it. */
export const BLOB_PATH_PHOTO = blobPath(BLOB_SHAPES[0]);
export const BLOB_PATH_RING = blobPath(shapeAt(BLOB_SHAPES, 1.5));

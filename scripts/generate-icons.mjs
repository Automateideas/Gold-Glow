// Builds the PWA / favicon icons from the "G" of the brand wordmark.
// Run again after changing the logo:  node scripts/generate-icons.mjs
import { mkdirSync } from "node:fs";
import sharp from "sharp";

const SOURCE = "public/products/logo-wordmark.jpg";
// Brand pink = the site's primary colour, hsl(335 82% 46%).
const BRAND = { r: 214, g: 21, b: 112 };

mkdirSync("public/icons", { recursive: true });

// Crop the first "G" out of the wordmark, then trim to its tight bounding box.
const crop = await sharp(SOURCE)
  .extract({ left: 170, top: 260, width: 216, height: 216 })
  .trim({ background: "#ffffff", threshold: 60 })
  .toBuffer();

/** White "G" on a solid brand-pink square. `fraction` = glyph size relative to the icon. */
async function makeIcon(size, fraction, outPath) {
  const box = Math.round(size * fraction);
  const glyph = await sharp(crop)
    .resize({ width: box, height: box, fit: "inside" })
    .extractChannel("green") // pink strokes have almost no green, white paper has full green
    .negate() // strokes -> opaque, paper -> transparent
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = glyph.info;

  const white = await sharp({
    create: { width, height, channels: 3, background: "#ffffff" },
  })
    .joinChannel(glyph.data, { raw: { width, height, channels: 1 } })
    .png()
    .toBuffer();

  await sharp({ create: { width: size, height: size, channels: 3, background: BRAND } })
    .composite([{ input: white, left: Math.round((size - width) / 2), top: Math.round((size - height) / 2) }])
    .png({ compressionLevel: 9 })
    .toFile(outPath);
  console.log("wrote", outPath, `${size}x${size}`);
}

await makeIcon(192, 0.62, "public/icons/icon-192.png");
await makeIcon(512, 0.62, "public/icons/icon-512.png");
// Maskable: Android may crop to a circle, so keep the "G" inside the central safe zone.
await makeIcon(512, 0.46, "public/icons/icon-maskable-512.png");
// App-folder conventions: Next adds the <link> tags (favicon + iOS home-screen icon) automatically.
await makeIcon(512, 0.62, "app/icon.png");
await makeIcon(180, 0.58, "app/apple-icon.png");

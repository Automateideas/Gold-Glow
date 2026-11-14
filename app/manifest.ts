import type { MetadataRoute } from "next";

/** Web app manifest: lets people install Gold & Glow to their phone or desktop. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Gold & Glow — Herbal Cosmetics",
    short_name: "Gold & Glow",
    description:
      "Herbal skincare and body care: face wash, lotions, creams, talc and toners. Find your favourites and buy on Amazon, Flipkart or Meesho.",
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    lang: "en-IN",
    dir: "ltr",
    categories: ["shopping", "lifestyle", "beauty"],
    background_color: "#fffcfa",
    theme_color: "#d61570",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      {
        name: "Shop all products",
        short_name: "Shop",
        url: "/shop?source=shortcut",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "Contact us",
        short_name: "Contact",
        url: "/contact?source=shortcut",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
    ],
  };
}

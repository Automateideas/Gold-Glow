import type { Metadata, Viewport } from "next";
import { Poppins, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/site-chrome";
import { PwaRegister } from "@/components/pwa-register";
import { Toaster } from "sonner";
import { getSettings } from "@/lib/site-data";
import { SITE_URL } from "@/lib/site-url";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-serif",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#d61570",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    metadataBase: new URL(SITE_URL),
    applicationName: "Gold & Glow",
    appleWebApp: { capable: true, title: "Gold & Glow", statusBarStyle: "default" },
    formatDetection: { telephone: false },
    title: { default: s.seoTitle, template: "%s · Gold & Glow" },
    description: s.seoDescription,
    keywords: [
      "Gold & Glow",
      "cosmetics",
      "skincare",
      "face wash",
      "body lotion",
      "talc",
      "rose water",
      "herbal cosmetics",
    ],
    openGraph: {
      title: s.seoTitle,
      description: s.seoDescription,
      type: "website",
      siteName: "Gold & Glow",
      locale: "en_IN",
      images: [{ url: "/products/logo-wordmark.jpg", alt: "Gold & Glow" }],
    },
    twitter: { card: "summary_large_image", title: s.seoTitle, description: s.seoDescription },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen font-sans" suppressHydrationWarning>
        <SiteChrome settings={settings}>{children}</SiteChrome>
        <PwaRegister />
        <Toaster
          position="bottom-right"
          richColors
          toastOptions={{ style: { borderRadius: "14px" } }}
        />
      </body>
    </html>
  );
}

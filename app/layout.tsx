import type { Metadata } from "next";
import { Poppins, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SiteChrome } from "@/components/site-chrome";
import { Toaster } from "sonner";
import { getSettings } from "@/lib/site-data";

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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://goldandglow.in";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    metadataBase: new URL(SITE_URL),
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
    },
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
        <Toaster
          position="bottom-right"
          richColors
          toastOptions={{ style: { borderRadius: "14px" } }}
        />
      </body>
    </html>
  );
}

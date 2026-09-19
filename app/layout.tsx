import type { Metadata } from "next";
import { Poppins, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartDrawer } from "@/components/cart-drawer";
import { Toaster } from "sonner";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://goldandglow.in"),
  title: {
    default: "Gold & Glow — Precised Care, Poetic Glow",
    template: "%s · Gold & Glow",
  },
  description:
    "Gold & Glow herbal cosmetics — vitamin-C face wash, aloe & honey lotions, icy-touch talc, rose water and more. Precised care, poetic glow.",
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
    title: "Gold & Glow — Precised Care, Poetic Glow",
    description:
      "Herbal-inspired cosmetics crafted for precise care and a poetic, golden glow.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen font-sans" suppressHydrationWarning>
        <CartProvider>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
          <CartDrawer />
          <Toaster
            position="bottom-right"
            richColors
            toastOptions={{ style: { borderRadius: "14px" } }}
          />
        </CartProvider>
      </body>
    </html>
  );
}

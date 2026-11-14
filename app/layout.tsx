import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
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
  viewportFit: "cover", // lets env(safe-area-inset-*) work for the bottom tab bar
};

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    metadataBase: new URL(SITE_URL),
    applicationName: "Gold & Glow",
    appleWebApp: {
      capable: true,
      title: "Gold & Glow",
      statusBarStyle: "default",
    },
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
    twitter: {
      card: "summary_large_image",
      title: s.seoTitle,
      description: s.seoDescription,
    },
  };
}

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  // Nonce from proxy.ts so this tiny inline script is allowed by the CSP in production.
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Marks the page as "motion-enabled" before first paint so animated elements never flash.
            Only when the home-page animations switch is on (Admin → Settings). Skipped for
            reduced-motion users; removed after 4s if the animation code never started.
            A real inline script on purpose: next/script's beforeInteractive only runs after
            hydration starts, which is too late to prevent the flash. */}
        {settings.homeMotion && (
          <script
            nonce={nonce}
            dangerouslySetInnerHTML={{
              __html:
                "(function(){try{var d=document.documentElement;if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.classList.add('motion');setTimeout(function(){if(!d.dataset.motionReady)d.classList.remove('motion')},4000)}catch(e){}})()",
            }}
          />
        )}
      </head>
      <body
        className="min-h-screen font-sans"
        suppressHydrationWarning
        data-temp-mail-org="0"
      >
        <SiteChrome settings={settings}>{children}</SiteChrome>
        <PwaRegister />
        <Toaster
          position="bottom-right"
          mobileOffset={{ bottom: "5.5rem" }}
          richColors
          toastOptions={{ style: { borderRadius: "14px" } }}
        />
      </body>
    </html>
  );
}

"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import type { SiteSettings } from "@/lib/settings";

/**
 * Wraps storefront pages with the header/footer, but renders admin routes bare
 * (the admin panel has its own top bar).
 */
export function SiteChrome({
  settings,
  children,
}: {
  settings: SiteSettings;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const bare = pathname?.startsWith("/admin");

  if (bare) return <>{children}</>;

  return (
    <>
      <SiteHeader settings={settings} />
      {/* Extra room at the bottom on phones so the tab bar never covers the footer. */}
      <div className="pb-[calc(4.25rem+env(safe-area-inset-bottom))] lg:pb-0">
        <main>{children}</main>
        <SiteFooter settings={settings} />
      </div>
      <MobileBottomNav />
    </>
  );
}

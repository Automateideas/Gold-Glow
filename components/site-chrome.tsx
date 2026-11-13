"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
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
      <main>{children}</main>
      <SiteFooter settings={settings} />
    </>
  );
}

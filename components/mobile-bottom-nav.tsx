"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Info, LayoutGrid, Mail, Search, Store, type LucideIcon } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CATEGORIES } from "@/lib/products";
import { categoryHref } from "@/lib/categories";
import { ROUTES } from "@/lib/nav";
import { SEARCH_PROXY_ID, SHOP_SEARCH_HREF, SHOP_SEARCH_ID } from "@/lib/shop-search";
import { cn } from "@/lib/utils";

/**
 * App-style tab bar for phones (hidden from the `lg` breakpoint up, where the top
 * header already has everything). Home · Shop · Categories · Contact · Search.
 * It slides away while you scroll down and returns when you scroll up.
 */
export function MobileBottomNav() {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [scrolledAway, setScrolledAway] = React.useState(false);
  const barHidden = scrolledAway && !sheetOpen;

  // Hide on scroll down, show on scroll up.
  React.useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY;
        if (y < 80 || delta < -6) setScrolledAway(false);
        else if (delta > 8) setScrolledAway(true);
        lastY = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Let other fixed elements (the install popup) drop down while the bar is away.
  React.useEffect(() => {
    const root = document.documentElement;
    root.toggleAttribute("data-nav-hidden", barHidden);
    return () => root.removeAttribute("data-nav-hidden");
  }, [barHidden]);

  function openSearch() {
    const box = document.getElementById(SHOP_SEARCH_ID);
    if (pathname === ROUTES.shop && box) {
      // Already on the shop page: just focus its search box.
      box.focus();
      box.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }
    // From any other page: iOS only opens the keyboard for a focus() made during this tap,
    // so focus a throw-away input now. The shop page hands the focus to its real search box.
    const proxy = document.createElement("input");
    proxy.id = SEARCH_PROXY_ID;
    proxy.tabIndex = -1;
    proxy.setAttribute("aria-hidden", "true");
    proxy.style.cssText = "position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;font-size:16px;";
    document.body.appendChild(proxy);
    proxy.focus();
    window.setTimeout(() => proxy.remove(), 4000);
    router.push(SHOP_SEARCH_HREF);
  }

  const tabClass = "relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[0.68rem] font-medium transition-colors";
  const idleClass = "text-muted-foreground";
  const activeClass = "text-primary";

  // "Shop" covers the product pages too, since they are reached from the shop.
  const shopActive = pathname === ROUTES.shop || pathname.startsWith("/product/");
  const categoriesActive = sheetOpen || pathname.startsWith("/shop/");

  const tabLink = (href: string, label: string, Icon: LucideIcon, active: boolean) => (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(tabClass, active ? activeClass : idleClass)}
    >
      <ActiveIndicator active={active} />
      <Icon className="h-5 w-5" aria-hidden />
      {label}
    </Link>
  );

  const sheetLink = (href: string, label: string, Icon: LucideIcon) => (
    <Link
      href={href}
      onClick={() => setSheetOpen(false)}
      className="flex items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium active:bg-accent"
    >
      <Icon className="h-4 w-4" /> {label}
    </Link>
  );

  return (
    <>
      <nav
        aria-label="Main"
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 border-t bg-background/90 shadow-[0_-6px_24px_-12px_rgba(0,0,0,0.18)] backdrop-blur transition-transform duration-300 lg:hidden",
          barHidden ? "translate-y-full" : "translate-y-0"
        )}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto flex max-w-lg items-stretch">
          {tabLink(ROUTES.home, "Home", Home, pathname === ROUTES.home)}
          {tabLink(ROUTES.shop, "Shop", Store, shopActive)}

          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={sheetOpen}
            className={cn(tabClass, categoriesActive ? activeClass : idleClass)}
          >
            <ActiveIndicator active={categoriesActive} />
            <LayoutGrid className="h-5 w-5" aria-hidden />
            Categories
          </button>

          {tabLink(ROUTES.contact, "Contact", Mail, pathname.startsWith(ROUTES.contact))}

          <button type="button" onClick={openSearch} className={cn(tabClass, idleClass)}>
            <Search className="h-5 w-5" aria-hidden />
            Search
          </button>
        </div>
      </nav>

      {/* Categories sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-3xl pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
          <SheetHeader>
            <SheetTitle>Shop by category</SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-2 gap-3 px-4 pt-2">
            {CATEGORIES.map((c) => (
              <Link
                key={c.name}
                href={categoryHref(c.name)}
                onClick={() => setSheetOpen(false)}
                className="flex items-center gap-2.5 rounded-2xl border bg-card p-2.5 transition-colors active:bg-accent"
              >
                <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-secondary/50">
                  <Image src={c.image} alt="" fill sizes="48px" className="object-contain p-1" />
                </span>
                <span className="min-w-0">
                  <span className="line-clamp-2 text-sm font-semibold leading-tight">{c.name}</span>
                  <span className="mt-0.5 block truncate text-[0.68rem] leading-tight text-muted-foreground">{c.blurb}</span>
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 px-4">
            {sheetLink(ROUTES.shop, "All products", Store)}
            {sheetLink(ROUTES.about, "About us", Info)}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

/** Small pill on the top edge of the active tab. */
function ActiveIndicator({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "absolute left-1/2 top-0 h-0.5 -translate-x-1/2 rounded-full bg-primary transition-all duration-300",
        active ? "w-8 opacity-100" : "w-0 opacity-0"
      )}
    />
  );
}

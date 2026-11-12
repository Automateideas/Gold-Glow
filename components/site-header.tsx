"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const NAV = [
  { label: "Shop All", href: "/shop" },
  { label: "Face Care", href: "/shop?category=Face+Wash" },
  { label: "Body Care", href: "/shop?category=Body+Lotion" },
  { label: "Talc", href: "/shop?category=Talc+%26+Powder" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Announcement bar */}
      <div className="brand-gradient text-primary-foreground">
        <div className="container flex h-9 items-center justify-center gap-2 overflow-hidden text-center text-xs font-medium">
          <span className="truncate">
            ✨ Now available on{" "}
            <span className="font-bold">Amazon · Flipkart · Meesho</span> — shop from
            your favourite app
          </span>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-40 w-full border-b transition-all",
          scrolled ? "glass border-border shadow-sm" : "bg-background border-transparent"
        )}
      >
        <div className="container flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <SheetHeader>
                  <SheetTitle>
                    <Logo withTagline />
                  </SheetTitle>
                </SheetHeader>
                <nav className="mt-4 flex flex-col gap-1 px-4">
                  {NAV.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="rounded-xl px-3 py-3 text-sm font-medium transition-colors hover:bg-accent"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>

            <Logo />
          </div>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => {
              const base = item.href.split("?")[0];
              const active = base !== "/" && pathname === base;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground",
                    active && "text-primary"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" asChild aria-label="Search">
              <Link href="/shop">
                <Search className="h-5 w-5" />
              </Link>
            </Button>
            <Button size="sm" asChild className="hidden sm:inline-flex">
              <Link href="/shop">Shop</Link>
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}

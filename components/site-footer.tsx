import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { InstagramIcon, FacebookIcon, YoutubeIcon } from "@/components/social-icons";
import { Logo } from "@/components/logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/products";

const columns = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/shop" },
      { label: "Face Wash", href: "/shop?category=Face+Wash" },
      { label: "Body Lotion", href: "/shop?category=Body+Lotion" },
      { label: "Skin Cream", href: "/shop?category=Skin+Cream" },
      { label: "Talc & Powder", href: "/shop?category=Talc+%26+Powder" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Ingredients", href: "/about#ingredients" },
      { label: "Reviews", href: "/#reviews" },
    ],
  },
  {
    title: "Where to Buy",
    links: [
      { label: "Amazon", href: "https://www.amazon.in/s?k=Gold+and+Glow+cosmetics" },
      { label: "Flipkart", href: "https://www.flipkart.com/search?q=Gold%20and%20Glow%20cosmetics" },
      { label: "Meesho", href: "https://www.meesho.com/search?q=Gold%20and%20Glow" },
      { label: "Contact & FAQs", href: "/contact" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t bg-secondary/40">
      {/* Newsletter */}
      <div className="container py-14">
        <div className="grid gap-8 rounded-3xl brand-gradient p-8 text-primary-foreground sm:p-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h3 className="font-serif text-2xl font-bold sm:text-3xl">
              Join the Glow Club
            </h3>
            <p className="mt-2 max-w-md text-sm text-primary-foreground/90">
              Be first to know about new launches, skincare rituals and where to find
              our products across your favourite shopping apps.
            </p>
          </div>
          <form className="flex w-full flex-col gap-3 sm:flex-row">
            <Input
              type="email"
              required
              placeholder="Enter your email"
              className="h-12 border-white/30 bg-white/95 text-foreground placeholder:text-muted-foreground"
            />
            <Button
              type="submit"
              size="lg"
              className="shrink-0 whitespace-nowrap"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </div>

      <div className="container grid gap-10 pb-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Logo withTagline />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Herbal-inspired cosmetics crafted for precise care and a poetic, golden
            glow — kind to skin, made in India.
          </p>
          <div className="mt-5 flex gap-2">
            {[InstagramIcon, FacebookIcon, YoutubeIcon].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="grid h-9 w-9 place-items-center rounded-full border bg-background transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="Social link"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold">{col.title}</h4>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t">
        <div className="container flex flex-col items-center justify-between gap-3 py-5 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Gold &amp; Glow Herbals Cosmetics. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href={`mailto:${BRAND.supportEmail}`} className="flex items-center gap-1.5 hover:text-primary">
              <Mail className="h-3.5 w-3.5" /> {BRAND.supportEmail}
            </a>
            <span className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" /> {BRAND.phone}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

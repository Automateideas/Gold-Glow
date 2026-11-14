import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { InstagramIcon, FacebookIcon, YoutubeIcon } from "@/components/social-icons";
import { Logo } from "@/components/logo";
import { NewsletterForm } from "@/components/newsletter-form";
import { InstallApp } from "@/components/install-app";
import type { SiteSettings } from "@/lib/settings";

const columns = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/shop" },
      { label: "Face Wash", href: "/shop/face-wash" },
      { label: "Body Lotion", href: "/shop/body-lotion" },
      { label: "Skin Cream", href: "/shop/skin-cream" },
      { label: "Talc & Powder", href: "/shop/talc-powder" },
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

const POLICY_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
  { label: "Return & Refund", href: "/refund-policy" },
  { label: "Payment Policy", href: "/payment-policy" },
];

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  const whatsappDigits = settings.whatsapp.replace(/\D/g, "");
  const socials = [
    { Icon: InstagramIcon, href: settings.instagram, label: "Instagram" },
    { Icon: FacebookIcon, href: settings.facebook, label: "Facebook" },
    { Icon: YoutubeIcon, href: settings.youtube, label: "YouTube" },
    {
      Icon: MessageCircle,
      href: whatsappDigits ? `https://wa.me/${whatsappDigits}` : "",
      label: "WhatsApp",
    },
  ].filter((s) => s.href);

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
          <NewsletterForm />
        </div>
      </div>

      <div className="container grid gap-10 pb-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Logo withTagline />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Herbal-inspired cosmetics crafted for precise care and a poetic, golden
            glow — kind to skin, made in India.
          </p>
          {settings.address && (
            <p className="mt-4 flex max-w-xs items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{settings.address}</span>
            </p>
          )}
          {socials.length > 0 && (
            <div className="mt-5 flex gap-2">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-9 w-9 place-items-center rounded-full border bg-background transition-colors hover:bg-primary hover:text-primary-foreground"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
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
        <div className="container py-5 text-xs text-muted-foreground">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p>© {new Date().getFullYear()} Gold &amp; Glow Herbals Cosmetics. All rights reserved.</p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              <a href={`mailto:${settings.email}`} className="flex items-center gap-1.5 hover:text-primary">
                <Mail className="h-3.5 w-3.5" /> {settings.email}
              </a>
              <span className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" /> {settings.phone}
              </span>
            </div>
          </div>

          <div className="mt-3 flex flex-col items-center justify-between gap-3 border-t pt-3 sm:flex-row">
            <nav aria-label="Policies" className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              {POLICY_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="hover:text-primary">
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
              <InstallApp />
            <p>
              Developed by{" "}
              <a
                href="http://automateideas.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline-offset-2 hover:text-primary hover:underline"
              >
                automateideas.in
              </a>
            </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

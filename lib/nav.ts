/** Storefront destinations, shared by the top header and the mobile bottom bar. */
export const ROUTES = {
  home: "/",
  shop: "/shop",
  contact: "/contact",
  about: "/about",
} as const;

/** Links in the top header (desktop bar and the phone hamburger menu). */
export const NAV = [
  { label: "Shop All", href: ROUTES.shop },
  { label: "Face Care", href: "/shop/face-wash" },
  { label: "Body Care", href: "/shop/body-lotion" },
  { label: "Talc", href: "/shop/talc-powder" },
  { label: "About", href: ROUTES.about },
  { label: "Contact", href: ROUTES.contact },
];

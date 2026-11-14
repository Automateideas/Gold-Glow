/**
 * Policy pages (Privacy, Terms, Return & Refund, Payment). The built-in text below
 * is only the starting point: everything can be edited from Admin → Pages.
 *
 * Body text mini-format (kept simple for non-technical editors):
 *   - a blank line starts a new paragraph
 *   - lines starting with "- " make a bullet list
 *   - **double stars** make words bold
 *   - [link text](/terms) or [email](mailto:hello@x.com) make a link
 *   - {{email}}, {{phone}}, {{address}} are filled from Admin → Settings
 */
export type PolicySection = { heading: string; body: string };

export type PolicyPage = {
  slug: string;
  title: string;
  metaDescription: string;
  intro: string;
  /** Shown as "Last updated". Display text for built-ins, ISO date once edited. */
  updated: string;
  sections: PolicySection[];
};

export type PolicyOverride = Partial<Omit<PolicyPage, "slug">>;

export const POLICY_PAGES: PolicyPage[] = [
  {
    slug: "privacy",
    title: "Privacy Policy",
    metaDescription:
      "How Gold & Glow collects, uses and protects your information when you browse our catalogue, message us or join the Glow Club newsletter.",
    intro:
      "This policy explains what information Gold & Glow (“we”, “us”) collects through this website, why we collect it and the choices you have. We keep it short because we collect very little.",
    updated: "13 November 2026",
    sections: [
      {
        heading: "Who we are",
        body:
          "Gold & Glow Herbals Cosmetics runs this website as a product catalogue. We do not sell products on this site. Each product links to Amazon, Flipkart or Meesho, where you can buy it.\n\nAddress: {{address}}\n\nEmail: [{{email}}](mailto:{{email}})",
      },
      {
        heading: "What we collect",
        body:
          "**Contact form.** If you write to us, we receive your name, email address, subject and message so we can reply.\n\n**Newsletter (“Join the Glow Club”).** If you subscribe, we store your email address and the date you joined.\n\n**Buy-button clicks.** When you tap a Buy on Amazon, Flipkart or Meesho button, we record which product, which marketplace and the time. This count is anonymous. It is not linked to your name, email or device, and it helps us see which products people are interested in.\n\n**Technical data.** Like any website, our hosting servers briefly see your IP address and browser details when you visit. We use your IP address only to keep the website secure and to limit spam on our forms, and we do not use it to identify you.\n\nWe do not ask for payment details, passwords or government IDs, and we do not use advertising or tracking cookies.",
      },
      {
        heading: "How we use it",
        body:
          "- To reply to your messages and questions.\n- To send you news about launches and where to buy our products, only if you subscribed.\n- To understand which products are popular and improve the website.\n- To keep the website secure and prevent spam or misuse.",
      },
      {
        heading: "Who we share it with",
        body:
          "We do not sell your information. We use trusted providers to run the website, for example our web host and our database and file-storage provider. They process data only on our behalf and under their own security commitments.\n\nWe may disclose information if the law requires it or to protect our rights and the safety of others.",
      },
      {
        heading: "Third-party websites",
        body:
          "When you click through to Amazon, Flipkart or Meesho, you leave our website. Those marketplaces have their own privacy policies and handle your orders, payments and delivery details. We do not see or control that information.",
      },
      {
        heading: "How long we keep it",
        body:
          "We keep messages and newsletter emails until you ask us to delete them or until we no longer need them for the reasons above. Anonymous click counts may be kept for reporting.",
      },
      {
        heading: "Your choices and rights",
        body:
          "You can ask us at any time to:\n\n- tell you what information we hold about you,\n- correct it,\n- delete it, or\n- remove you from our newsletter.\n\nJust email [{{email}}](mailto:{{email}}) from the address you used. We will respond within a reasonable time. If you are in India, you also have the rights described in the Digital Personal Data Protection Act, 2023, including the right to raise a grievance with us.",
      },
      {
        heading: "Security",
        body:
          "Our database is not open to the public and our admin area is password-protected. No website can promise perfect security, but we take reasonable steps to protect your information.",
      },
      {
        heading: "Children",
        body:
          "This website is meant for adults. We do not knowingly collect information from children under 18. If you think a child has sent us information, please email us and we will delete it.",
      },
      {
        heading: "Changes to this policy",
        body:
          "We may update this policy from time to time. The “Last updated” date at the top shows when it last changed. Please also read our [Terms of Use](/terms).",
      },
      {
        heading: "Contact us",
        body:
          "Questions about this policy? Write to [{{email}}](mailto:{{email}}) or use our [contact page](/contact).",
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms of Use",
    metaDescription:
      "The terms for using the Gold & Glow website: product information, marketplace purchases, acceptable use and liability.",
    intro:
      "By using the Gold & Glow website you agree to these terms. If you do not agree, please do not use the website.",
    updated: "13 November 2026",
    sections: [
      {
        heading: "About this website",
        body:
          "This website is a catalogue of Gold & Glow products. It is for information only. You cannot place an order or pay on this website.",
      },
      {
        heading: "Buying from marketplaces",
        body:
          "Each product links to Amazon, Flipkart or Meesho. If you buy there, your purchase is a contract between you and that marketplace (and its seller) and is governed by their terms and policies, including payment, delivery, returns and refunds. See also our [Return & Refund Policy](/refund-policy) and [Payment Policy](/payment-policy).\n\nWe are not responsible for the marketplaces, their listings or their service. To be sure a product is genuine, buy from our official Gold & Glow listings.",
      },
      {
        heading: "Product information and prices",
        body:
          "We try to keep product details accurate, but descriptions, images, sizes and ingredients may change, and mistakes can happen. Always check the label on the product you receive.\n\nPrices shown here are indicative only. The actual price and availability are set by the marketplace at the time you buy.",
      },
      {
        heading: "Skincare use",
        body:
          "Our products are cosmetics, not medicines. Results vary from person to person. Do a patch test before first use, stop using a product if irritation occurs, and speak to a doctor if you have a skin condition or allergies. Nothing on this website is medical advice.",
      },
      {
        heading: "Acceptable use",
        body:
          "- Do not misuse the website or try to disrupt or gain unauthorised access to it.\n- Do not send spam, harmful code or unlawful content through our forms.\n- Do not copy or scrape the website at scale without our written permission.",
      },
      {
        heading: "Messages you send us",
        body:
          "When you contact us or join the newsletter, please give accurate information. How we handle it is explained in our [Privacy Policy](/privacy).",
      },
      {
        heading: "Intellectual property",
        body:
          "The Gold & Glow name, logo, product images, text and design belong to Gold & Glow Herbals Cosmetics or its licensors. Marketplace names and logos belong to their owners. You may view and share links to this website, but you may not reuse our content commercially without permission.",
      },
      {
        heading: "Limits of liability",
        body:
          "The website is provided “as is”. To the extent the law allows, we are not liable for losses arising from your use of the website, from information on it, or from purchases made on third-party marketplaces. Nothing here limits any right you have under applicable consumer law.",
      },
      {
        heading: "Changes",
        body:
          "We may change the website or these terms at any time. The “Last updated” date shows the latest version, and continued use means you accept the changes.",
      },
      {
        heading: "Governing law and contact",
        body:
          "These terms are governed by the laws of India. Courts in India will have jurisdiction over any dispute.\n\nQuestions? Email [{{email}}](mailto:{{email}}) or visit our [contact page](/contact).",
      },
    ],
  },
  {
    slug: "refund-policy",
    title: "Return & Refund Policy",
    metaDescription:
      "How returns, replacements and refunds work for Gold & Glow products bought on Amazon, Flipkart or Meesho, and how to reach us for help.",
    intro:
      "You buy Gold & Glow products on Amazon, Flipkart or Meesho, so returns and refunds are handled by the marketplace you ordered from. This page explains how that works and how we can help.",
    updated: "13 November 2026",
    sections: [
      {
        heading: "Where your order is handled",
        body:
          "This website is a catalogue, not a shop. We do not take orders or payments here, so we do not hold your order. Returns, replacements and refunds follow the policy of the marketplace and seller you bought from.",
      },
      {
        heading: "How to return or replace an item",
        body:
          "- Open the Amazon, Flipkart or Meesho app or website and sign in.\n- Go to your orders and choose the Gold & Glow item.\n- Pick Return, Replace or Report a problem and follow the steps.\n\nThe return window and the reasons accepted are set by the marketplace and can differ by product type, so please check the order page for the exact dates.",
      },
      {
        heading: "Damaged, wrong or expired product",
        body:
          "If your item arrives damaged, leaking, different from what you ordered or past its expiry date, raise it with the marketplace first so it is covered by their guarantee. You can also email us at [{{email}}](mailto:{{email}}) with your order number, a short description and clear photos of the product and its packaging. We will do our best to help.",
      },
      {
        heading: "Refunds",
        body:
          "When a return or cancellation is approved, the marketplace sends the refund to your original payment method or as per its own rules. How long it takes depends on the marketplace and your bank. We cannot issue refunds for orders placed on other platforms.",
      },
      {
        heading: "Opened or used products",
        body:
          "Because Gold & Glow products are cosmetics, marketplaces often do not accept returns once a product has been opened or used, unless it is defective or wrong. Please do a patch test before regular use and read the label and ingredients.",
      },
      {
        heading: "Genuine products",
        body:
          "To avoid fake or expired stock, buy only from our official Gold & Glow listings, which you can reach from the Buy buttons on this website.",
      },
      {
        heading: "Contact us",
        body:
          "Need help with an order? Email [{{email}}](mailto:{{email}}) or call {{phone}}. You can also use our [contact page](/contact).",
      },
    ],
  },
  {
    slug: "payment-policy",
    title: "Payment Policy",
    metaDescription:
      "How payments work for Gold & Glow products: no payments on this website, secure payment on Amazon, Flipkart or Meesho, and how to stay safe.",
    intro:
      "Payments for Gold & Glow products are made on the marketplace where you buy. This page explains what that means for you.",
    updated: "13 November 2026",
    sections: [
      {
        heading: "No payments on this website",
        body:
          "You cannot pay on this website. We never ask for your card, UPI, bank or wallet details here. If anyone asks for payment in the name of Gold & Glow outside Amazon, Flipkart or Meesho, please do not pay and let us know.",
      },
      {
        heading: "Paying on the marketplaces",
        body:
          "When you tap a Buy button, you go to Amazon, Flipkart or Meesho. You pay there using the options they offer, which can include UPI, cards, net banking, wallets and cash on delivery where available. Payment is processed by the marketplace under its own security and terms.",
      },
      {
        heading: "Prices and taxes",
        body:
          "Prices on this website are indicative. The final price, offers, taxes and delivery charges are shown by the marketplace before you confirm your order.",
      },
      {
        heading: "Failed or double payments",
        body:
          "If a payment fails or you are charged twice, contact the marketplace or your bank first. They hold the transaction record and can fix it quickest. If you need help, you can also write to us at [{{email}}](mailto:{{email}}).",
      },
      {
        heading: "Stay safe",
        body:
          "- Buy only from our official Gold & Glow listings.\n- Never share your OTP, PIN or password with anyone.\n- Pay inside the marketplace app or website, not through links sent on chat or by strangers.",
      },
      {
        heading: "Related policies",
        body:
          "Please also read our [Return & Refund Policy](/refund-policy), [Terms of Use](/terms) and [Privacy Policy](/privacy).",
      },
      {
        heading: "Contact us",
        body:
          "Questions about payments? Email [{{email}}](mailto:{{email}}) or call {{phone}}.",
      },
    ],
  },
];

export const policyBySlug = (slug: string) => POLICY_PAGES.find((p) => p.slug === slug);

/** Saved edits win over the built-in text; blank or wrong-typed values are ignored. */
export function mergePolicy(base: PolicyPage, ov?: PolicyOverride | null): PolicyPage {
  if (!ov) return base;
  const str = (v: unknown, d: string) => (typeof v === "string" && v.trim() ? v.trim() : d);
  const sections = Array.isArray(ov.sections)
    ? ov.sections.filter(
        (s): s is PolicySection =>
          !!s && typeof s.heading === "string" && typeof s.body === "string" && s.heading.trim() !== ""
      )
    : [];
  return {
    ...base,
    title: str(ov.title, base.title),
    metaDescription: str(ov.metaDescription, base.metaDescription),
    intro: typeof ov.intro === "string" ? ov.intro.trim() : base.intro,
    updated: str(ov.updated, base.updated),
    sections: sections.length ? sections : base.sections,
  };
}

/** "2026-11-13" -> "13 November 2026"; anything else is shown as written. */
export function formatUpdated(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const d = new Date(`${value}T00:00:00Z`);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
    }
  }
  return value;
}

/** Replace {{email}}, {{phone}}, {{address}} with the values from Admin → Settings. */
export function fillTokens(text: string, values: { email: string; phone: string; address: string }) {
  return text
    .split("{{email}}")
    .join(values.email)
    .split("{{phone}}")
    .join(values.phone)
    .split("{{address}}")
    .join(values.address);
}

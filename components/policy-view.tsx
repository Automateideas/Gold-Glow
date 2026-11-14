import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage } from "@/components/legal-page";
import { RichBody } from "@/components/rich-body";
import { fillTokens, formatUpdated } from "@/lib/pages";
import { getPolicyPage, getSettings } from "@/lib/site-data";

/** SEO metadata for a policy page (title and description are editable in Admin → Pages). */
export async function policyMetadata(slug: string): Promise<Metadata> {
  const page = await getPolicyPage(slug);
  if (!page) return { title: "Page not found", robots: { index: false, follow: false } };
  return {
    title: page.title,
    description: page.metaDescription,
    alternates: { canonical: `/${page.slug}` },
  };
}

/** Renders one policy page from the database (or the built-in text). */
export async function PolicyView({ slug }: { slug: string }) {
  const [page, s] = await Promise.all([getPolicyPage(slug), getSettings()]);
  if (!page) notFound();
  const tokens = { email: s.email, phone: s.phone, address: s.address };

  return (
    <LegalPage
      title={page.title}
      updated={formatUpdated(page.updated)}
      intro={fillTokens(page.intro, tokens)}
      sections={page.sections.map((sec) => ({
        heading: sec.heading,
        body: <RichBody text={fillTokens(sec.body, tokens)} />,
      }))}
    />
  );
}

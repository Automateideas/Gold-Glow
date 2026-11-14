import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type LegalSection = { heading: string; body: React.ReactNode };

/** Shared layout for the Privacy Policy and Terms pages. */
export function LegalPage({
  title,
  intro,
  updated,
  sections,
}: {
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <div className="container py-10 sm:py-14">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">{title}</span>
      </nav>

      <article className="mt-6 max-w-3xl">
        <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {updated}</p>
        <p className="mt-6 text-muted-foreground">{intro}</p>

        <nav aria-label="On this page" className="mt-8 rounded-2xl border bg-card p-5">
          <p className="text-sm font-semibold">On this page</p>
          <ol className="mt-3 grid gap-1.5 text-sm sm:grid-cols-2">
            {sections.map((s, i) => (
              <li key={s.heading}>
                <a href={`#s${i + 1}`} className="text-muted-foreground hover:text-primary">
                  {i + 1}. {s.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-10 space-y-10">
          {sections.map((s, i) => (
            <section key={s.heading} id={`s${i + 1}`} className="scroll-mt-24">
              <h2 className="font-serif text-2xl font-bold">
                {i + 1}. {s.heading}
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground [&_a]:text-primary [&_a]:underline [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-foreground">
                {s.body}
              </div>
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}

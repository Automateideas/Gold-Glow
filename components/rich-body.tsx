import * as React from "react";
import Link from "next/link";

/** Only allow safe link targets, so an editor can never inject script links. */
function safeHref(href: string): string | null {
  const h = href.trim();
  if (/^(https?:\/\/|mailto:|tel:)/i.test(h)) return h;
  if (h.startsWith("/") && !h.startsWith("//")) return h;
  return null;
}

/** Inline formatting: **bold** and [text](link). Everything else is plain text. */
function inline(text: string, keyBase: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const key = `${keyBase}-${i++}`;
    if (m[1] !== undefined) {
      out.push(<strong key={key}>{m[1]}</strong>);
    } else {
      const href = safeHref(m[3]);
      if (!href) out.push(m[2]);
      else if (href.startsWith("/")) out.push(<Link key={key} href={href}>{m[2]}</Link>);
      else
        out.push(
          <a key={key} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
            {m[2]}
          </a>
        );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/**
 * Renders the simple editor format used for policy pages:
 * blank line = new paragraph, "- " lines = bullet list, **bold**, [text](link).
 */
export function RichBody({ text }: { text: string }) {
  const blocks = text
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  return (
    <>
      {blocks.map((block, bi) => {
        const lines = block.split("\n");
        if (lines.every((l) => /^\s*-\s+/.test(l))) {
          return (
            <ul key={bi}>
              {lines.map((l, li) => (
                <li key={li}>{inline(l.replace(/^\s*-\s+/, ""), `b${bi}l${li}`)}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={bi}>
            {lines.map((l, li) => (
              <React.Fragment key={li}>
                {li > 0 && <br />}
                {inline(l, `b${bi}l${li}`)}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </>
  );
}

import { ExternalLink } from "lucide-react";
import { MARKETPLACES, buyUrl, type Product } from "@/lib/products";
import { cn } from "@/lib/utils";

/** Full-width "Buy on <marketplace>" buttons — used on the product page. */
export function MarketplaceButtons({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-2.5", className)}>
      {MARKETPLACES.map((m) => (
        <a
          key={m.id}
          href={buyUrl(product, m.id)}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-between rounded-xl border bg-card px-4 py-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md"
        >
          <span className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg border bg-white p-1.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={m.logo}
                alt={`${m.name} logo`}
                className="h-full w-full object-contain"
              />
            </span>
            <span className="text-sm">
              Buy on <span className="font-semibold">{m.name}</span>
            </span>
          </span>
          <ExternalLink className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
        </a>
      ))}
    </div>
  );
}

/** Compact marketplace logo links — used on product cards. */
export function MarketplaceChips({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {MARKETPLACES.map((m) => (
        <a
          key={m.id}
          href={buyUrl(product, m.id)}
          target="_blank"
          rel="noopener noreferrer"
          title={`Buy on ${m.name}`}
          aria-label={`Buy ${product.name} on ${m.name}`}
          className="grid h-8 w-8 place-items-center rounded-md border bg-white p-1 shadow-sm transition-transform hover:scale-110"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={m.logo}
            alt={m.name}
            className="h-full w-full object-contain"
          />
        </a>
      ))}
    </div>
  );
}

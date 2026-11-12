import Image from "next/image";
import Link from "next/link";
import { type Product } from "@/lib/products";
import { formatINR } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/star-rating";
import { MarketplaceChips } from "@/components/marketplace-buttons";

export function ProductCard({ product }: { product: Product }) {
  const off =
    product.compareAt && product.compareAt > product.price
      ? Math.round((1 - product.price / product.compareAt) * 100)
      : 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden"
        style={{
          background: `radial-gradient(120% 120% at 50% 0%, hsl(${product.shade} / 0.14), transparent 70%)`,
        }}
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-5 transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.bestSeller && <Badge variant="default">Bestseller</Badge>}
          {product.new && <Badge variant="gold">New</Badge>}
          {off > 0 && (
            <Badge variant="soft" className="bg-emerald-100 text-emerald-700">
              {off}% off
            </Badge>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[0.68rem] font-semibold uppercase tracking-widest text-primary/90">
          {product.category}
        </p>
        <Link href={`/product/${product.slug}`} className="mt-1">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
            {product.name}
          </h3>
        </Link>
        <div className="mt-1.5 flex items-center gap-1.5">
          <StarRating rating={product.rating} />
          <span className="text-xs text-muted-foreground">({product.reviews})</span>
        </div>

        <div className="mt-auto flex items-end justify-between pt-3">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold text-foreground">
                {formatINR(product.price)}
              </span>
              {product.compareAt && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatINR(product.compareAt)}
                </span>
              )}
            </div>
            <span className="text-[0.7rem] text-muted-foreground">{product.size}</span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between border-t pt-3">
          <span className="text-[0.7rem] text-muted-foreground">Buy it on</span>
          <MarketplaceChips product={product} />
        </div>
      </div>
    </div>
  );
}

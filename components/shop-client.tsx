"use client";

import * as React from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { CATEGORIES, type Category, type Product } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type SortKey = "featured" | "price-asc" | "price-desc" | "rating";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "rating", label: "Top Rated" },
];

const ALL = "All" as const;

export function ShopClient({
  initialCategory,
  allProducts,
}: {
  initialCategory?: string;
  allProducts: Product[];
}) {
  const validInitial =
    initialCategory &&
    CATEGORIES.some((c) => c.name === initialCategory)
      ? (initialCategory as Category)
      : ALL;

  const [category, setCategory] = React.useState<Category | typeof ALL>(
    validInitial
  );
  const [sort, setSort] = React.useState<SortKey>("featured");
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    let list = allProducts.slice();
    if (category !== ALL) list = list.filter((p) => p.category === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.short.toLowerCase().includes(q) ||
          p.keyIngredients.some((i) => i.toLowerCase().includes(q))
      );
    }
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      default:
        list.sort(
          (a, b) => Number(b.bestSeller ?? 0) - Number(a.bestSeller ?? 0)
        );
    }
    return list;
  }, [category, sort, query, allProducts]);

  const chips: (Category | typeof ALL)[] = [ALL, ...CATEGORIES.map((c) => c.name)];

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col gap-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, ingredients…"
            className="pl-10"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Category chips */}
          <div className="flex flex-wrap gap-2">
            {chips.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                  category === c
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:bg-accent"
                )}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="h-10 rounded-xl border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
        {filtered.length === 1 ? "product" : "products"}
        {category !== ALL && ` in ${category}`}
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center gap-3 text-center">
          <p className="text-lg font-semibold">No products found</p>
          <p className="text-sm text-muted-foreground">
            Try a different search or category.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setQuery("");
              setCategory(ALL);
            }}
          >
            Reset filters
          </Button>
        </div>
      )}
    </div>
  );
}

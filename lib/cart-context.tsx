"use client";

import * as React from "react";
import { products, type Product } from "@/lib/products";

export type CartLine = { id: string; qty: number };

type CartState = {
  lines: CartLine[];
  isOpen: boolean;
};

type CartContextValue = {
  lines: CartLine[];
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  add: (id: string, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  savings: number;
  detailed: { product: Product; qty: number; lineTotal: number }[];
};

const CartContext = React.createContext<CartContextValue | null>(null);
const STORAGE_KEY = "gg-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = React.useState<CartLine[]>([]);
  const [isOpen, setOpen] = React.useState(false);
  const [hydrated, setHydrated] = React.useState(false);

  // hydrate from localStorage
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartLine[];
        if (Array.isArray(parsed)) setLines(parsed);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  // persist
  React.useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines, hydrated]);

  const add = React.useCallback((id: string, qty = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.id === id);
      if (existing) {
        return prev.map((l) =>
          l.id === id ? { ...l, qty: Math.min(l.qty + qty, 99) } : l
        );
      }
      return [...prev, { id, qty }];
    });
  }, []);

  const remove = React.useCallback((id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const setQty = React.useCallback((id: string, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.id !== id)
        : prev.map((l) => (l.id === id ? { ...l, qty: Math.min(qty, 99) } : l))
    );
  }, []);

  const clear = React.useCallback(() => setLines([]), []);

  const detailed = React.useMemo(() => {
    return lines
      .map((l) => {
        const product = products.find((p) => p.id === l.id);
        if (!product) return null;
        return { product, qty: l.qty, lineTotal: product.price * l.qty };
      })
      .filter(Boolean) as {
      product: Product;
      qty: number;
      lineTotal: number;
    }[];
  }, [lines]);

  const count = detailed.reduce((n, l) => n + l.qty, 0);
  const subtotal = detailed.reduce((n, l) => n + l.lineTotal, 0);
  const savings = detailed.reduce(
    (n, l) =>
      n + ((l.product.compareAt ?? l.product.price) - l.product.price) * l.qty,
    0
  );

  const value: CartContextValue = {
    lines,
    isOpen,
    setOpen,
    add,
    remove,
    setQty,
    clear,
    count,
    subtotal,
    savings,
    detailed,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

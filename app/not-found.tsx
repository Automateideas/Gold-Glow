import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-serif text-7xl font-bold gold-text">404</p>
      <h1 className="mt-4 font-serif text-2xl font-bold">Page not found</h1>
      <p className="mt-2 max-w-sm text-muted-foreground">
        The page you&apos;re looking for has drifted away. Let&apos;s get you back to
        the glow.
      </p>
      <div className="mt-8 flex gap-3">
        <Button asChild>
          <Link href="/">Back home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/shop">Shop products</Link>
        </Button>
      </div>
    </div>
  );
}

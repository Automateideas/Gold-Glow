import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  withTagline = false,
  onDark = false,
}: {
  className?: string;
  withTagline?: boolean;
  onDark?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex flex-col leading-none", className)}
      aria-label="Gold & Glow home"
    >
      <span className="flex items-baseline gap-1">
        <span
          className={cn(
            "font-serif text-2xl font-bold tracking-tight text-primary transition-colors sm:text-[1.65rem]",
            onDark && "text-white"
          )}
        >
          Gold
        </span>
        <span className="gold-text font-serif text-2xl font-bold sm:text-[1.65rem]">
          &amp;
        </span>
        <span
          className={cn(
            "font-serif text-2xl font-bold tracking-tight text-primary transition-colors sm:text-[1.65rem]",
            onDark && "text-white"
          )}
        >
          Glow
        </span>
      </span>
      {withTagline && (
        <span
          className={cn(
            "mt-0.5 text-[0.6rem] font-medium uppercase tracking-[0.28em] text-muted-foreground",
            onDark && "text-white/70"
          )}
        >
          precised care, poetic glow
        </span>
      )}
    </Link>
  );
}

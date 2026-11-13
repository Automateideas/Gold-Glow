import Link from "next/link";
import { MousePointerClick } from "lucide-react";
import type { Analytics } from "@/lib/site-data";
import { MARKETPLACES } from "@/lib/products";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { AdminError, EmptyState } from "@/components/admin/admin-notice";
import { cn } from "@/lib/utils";

const RANGES = [7, 30, 90];

export function AdminAnalytics({
  data,
  loadError,
}: {
  data: Analytics;
  loadError?: string;
}) {
  const maxDaily = Math.max(1, ...data.daily.map((d) => d.n));
  const maxMk = Math.max(1, ...data.byMarketplace.map((m) => m.n));

  return (
    <>
      <AdminPageHeader
        title="Analytics"
        description="How many visitors tapped a Buy on Amazon, Flipkart or Meesho button."
      >
        <div className="flex rounded-full border bg-card p-1 text-sm">
          {RANGES.map((d) => (
            <Link
              key={d}
              href={`/admin/analytics?days=${d}`}
              className={cn(
                "rounded-full px-3.5 py-1.5 font-medium transition-colors",
                data.days === d
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {d} days
            </Link>
          ))}
        </div>
      </AdminPageHeader>

      {loadError ? (
        <AdminError message={loadError} />
      ) : data.total === 0 ? (
        <EmptyState
          icon={MousePointerClick}
          title="No clicks recorded yet"
          text={`Nothing in the last ${data.days} days. Once visitors start tapping the marketplace buttons, you will see which products and marketplaces work best here.`}
        />
      ) : (
        <>
          {/* Summary */}
          <div className="mt-6 grid gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border bg-card p-5">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Total clicks
              </p>
              <p className="mt-1 font-serif text-3xl font-bold">{data.total}</p>
              <p className="text-xs text-muted-foreground">last {data.days} days</p>
            </div>
            {MARKETPLACES.map((m) => {
              const n = data.byMarketplace.find((x) => x.marketplace === m.id)?.n ?? 0;
              return (
                <div key={m.id} className="rounded-2xl border bg-card p-5">
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.logo} alt="" className="h-5 w-5 object-contain" />
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {m.name}
                    </p>
                  </div>
                  <p className="mt-1 font-serif text-3xl font-bold">{n}</p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(n / maxMk) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Daily */}
          <div className="mt-6 rounded-2xl border bg-card p-5">
            <p className="text-sm font-semibold">Clicks per day</p>
            <div className="mt-4 flex h-32 items-end gap-1" role="img" aria-label="Clicks per day bar chart">
              {data.daily.map((d) => (
                <div key={d.day} className="group relative flex h-full flex-1 items-end">
                  <div
                    className="w-full rounded-t bg-primary/70 transition-colors group-hover:bg-primary"
                    style={{ height: `${Math.max(4, (d.n / maxDaily) * 100)}%` }}
                  />
                  <span className="pointer-events-none absolute -top-6 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-2 py-0.5 text-[0.65rem] text-background group-hover:block">
                    {d.day}: {d.n}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top products */}
          <div className="mt-6 overflow-hidden rounded-2xl border bg-card">
            <p className="border-b px-5 py-3 text-sm font-semibold">Top products</p>
            <table className="w-full text-sm">
              <thead className="border-b bg-secondary/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 text-right font-semibold">Amazon</th>
                  <th className="px-4 py-3 text-right font-semibold">Flipkart</th>
                  <th className="px-4 py-3 text-right font-semibold">Meesho</th>
                  <th className="px-4 py-3 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {data.topProducts.map((p) => (
                  <tr key={p.product_id} className="border-b last:border-0">
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{p.amazon}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{p.flipkart}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{p.meesho}</td>
                    <td className="px-4 py-3 text-right font-semibold">{p.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}

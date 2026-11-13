import type { Metadata } from "next";
import { isAdminSession } from "@/lib/admin/auth";
import { getAnalytics } from "@/lib/site-data";
import { AdminAnalytics } from "@/components/admin/admin-analytics";

export const metadata: Metadata = {
  title: "Admin · Analytics",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  if (!(await isAdminSession())) return null;
  const { days } = await searchParams;
  const n = [7, 30, 90].includes(Number(days)) ? Number(days) : 30;
  const { data, error } = await getAnalytics(n);
  return <AdminAnalytics data={data} loadError={error} />;
}

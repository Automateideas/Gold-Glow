import type { Metadata } from "next";
import { isAdminSession } from "@/lib/admin/auth";
import { getAdminSubscribers } from "@/lib/site-data";
import { AdminSubscribers } from "@/components/admin/admin-subscribers";

export const metadata: Metadata = {
  title: "Admin · Subscribers",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function Page() {
  if (!(await isAdminSession())) return null;
  const { data, error } = await getAdminSubscribers();
  return <AdminSubscribers subscribers={data} loadError={error} />;
}

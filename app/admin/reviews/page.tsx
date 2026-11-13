import type { Metadata } from "next";
import { isAdminSession } from "@/lib/admin/auth";
import { getAdminReviews } from "@/lib/site-data";
import { AdminReviews } from "@/components/admin/admin-reviews";

export const metadata: Metadata = {
  title: "Admin · Reviews",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function Page() {
  if (!(await isAdminSession())) return null;
  const { data, error } = await getAdminReviews();
  return <AdminReviews reviews={data} loadError={error} />;
}

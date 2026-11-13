import type { Metadata } from "next";
import { isAdminSession } from "@/lib/admin/auth";
import { getAdminMessages } from "@/lib/site-data";
import { AdminMessages } from "@/components/admin/admin-messages";

export const metadata: Metadata = {
  title: "Admin · Messages",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function Page() {
  if (!(await isAdminSession())) return null;
  const { data, error } = await getAdminMessages();
  return <AdminMessages messages={data} loadError={error} />;
}

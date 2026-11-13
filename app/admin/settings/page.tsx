import type { Metadata } from "next";
import { isAdminSession } from "@/lib/admin/auth";
import { getSettings } from "@/lib/site-data";
import { AdminSettings } from "@/components/admin/admin-settings";

export const metadata: Metadata = {
  title: "Admin · Settings",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function Page() {
  if (!(await isAdminSession())) return null;
  const settings = await getSettings();
  return <AdminSettings initial={settings} />;
}

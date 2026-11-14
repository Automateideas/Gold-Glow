import type { Metadata } from "next";
import { isAdminSession } from "@/lib/admin/auth";
import { POLICY_PAGES } from "@/lib/pages";
import { getPolicyOverrides, getPolicyPages } from "@/lib/site-data";
import { AdminPolicies } from "@/components/admin/admin-policies";

export const metadata: Metadata = {
  title: "Admin · Pages",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function Page() {
  if (!(await isAdminSession())) return null;
  const [pages, overrides] = await Promise.all([getPolicyPages(), getPolicyOverrides()]);
  return <AdminPolicies pages={pages} defaults={POLICY_PAGES} overrides={overrides} />;
}

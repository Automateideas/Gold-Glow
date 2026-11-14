import type { Metadata } from "next";
import { isAdminSession } from "@/lib/admin/auth";
import { CATEGORY_PAGES } from "@/lib/categories";
import { getCategoryOverrides, getCategoryPages } from "@/lib/site-data";
import { AdminCategories } from "@/components/admin/admin-categories";

export const metadata: Metadata = {
  title: "Admin · Categories",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function Page() {
  if (!(await isAdminSession())) return null;
  const [pages, overrides] = await Promise.all([getCategoryPages(), getCategoryOverrides()]);
  return <AdminCategories pages={pages} defaults={CATEGORY_PAGES} overrides={overrides} />;
}

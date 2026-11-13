import type { Metadata } from "next";
import { isAdminSession } from "@/lib/admin/auth";
import { getAdminProducts } from "@/lib/catalog";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const metadata: Metadata = {
  title: "Admin · Products",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  if (!(await isAdminSession())) return null;
  const { items, error } = await getAdminProducts();
  return <AdminDashboard items={items} loadError={error} />;
}

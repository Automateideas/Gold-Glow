import type { Metadata } from "next";
import { adminConfigured, isAdminSession } from "@/lib/admin/auth";
import { getAdminProducts } from "@/lib/catalog";
import { AdminLogin } from "@/components/admin/admin-login";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { AdminNotConfigured } from "@/components/admin/admin-not-configured";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!adminConfigured()) return <AdminNotConfigured />;
  if (!(await isAdminSession())) return <AdminLogin />;

  const { items, error } = await getAdminProducts();
  return <AdminDashboard items={items} loadError={error} />;
}

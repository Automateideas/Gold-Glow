import { adminConfigured, isAdminSession } from "@/lib/admin/auth";
import { getUnreadMessageCount } from "@/lib/site-data";
import { AdminLogin } from "@/components/admin/admin-login";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminNotConfigured } from "@/components/admin/admin-not-configured";

export const dynamic = "force-dynamic";

/**
 * Gate for every /admin screen: setup notice → login → tabbed shell.
 * (Each page also re-checks the session, since layouts don't re-run on
 * client-side navigation.)
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!adminConfigured()) return <AdminNotConfigured />;
  if (!(await isAdminSession())) return <AdminLogin />;
  const unread = await getUnreadMessageCount();
  return <AdminShell unread={unread}>{children}</AdminShell>;
}

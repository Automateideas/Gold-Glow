import { isAdminSession } from "@/lib/admin/auth";
import { getAdminSubscribers } from "@/lib/site-data";

export const dynamic = "force-dynamic";

/** Admin-only CSV download of newsletter subscribers. */
export async function GET() {
  if (!(await isAdminSession())) return new Response("Unauthorized", { status: 401 });
  const { data } = await getAdminSubscribers();
  const esc = (s: string) => `"${s.replace(/"/g, '""')}"`;
  const csv = ["email,subscribed_at", ...data.map((r) => `${esc(r.email)},${r.created_at}`)].join("\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="gold-and-glow-subscribers.csv"',
    },
  });
}

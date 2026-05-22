import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { initDb, getAllRequests, RequestRow } from "@/lib/db";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  // Auth check
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (!session || session.value !== "1") {
    redirect("/admin");
  }

  // Ensure DB table exists
  await initDb();

  // Load all requests
  const rows: RequestRow[] = await getAllRequests();

  const needsCall = rows.filter((r) => r.status === "needs_call");
  const pending = rows.filter((r) => r.status === "pending");
  const approved = rows.filter((r) => r.status === "approved" || r.status === "shipped");
  const denied = rows.filter((r) => r.status === "denied");

  return (
    <DashboardClient
      needsCall={needsCall}
      pending={pending}
      approved={approved}
      denied={denied}
    />
  );
}

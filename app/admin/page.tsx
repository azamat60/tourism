import { redirect } from "next/navigation";
import { getStaff } from "@/lib/admin/auth";
import AdminDashboard from "@/components/admin/AdminDashboard";
export const dynamic = "force-dynamic";
export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const staff = await getStaff();
  if (!staff) redirect("/admin/login/");
  return (
    <AdminDashboard
      role={staff.role}
      email={staff.user.email || ""}
      initialTab={(await searchParams).tab}
    />
  );
}

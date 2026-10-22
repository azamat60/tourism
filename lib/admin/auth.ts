import "server-only";
import { serverSupabase } from "../supabase/server";
import type { StaffRole } from "../site-types";
export async function getStaff() {
  const supabase = await serverSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email_confirmed_at) return null;
  const { data, error } = await supabase.rpc("tourism_staff_role");
  if (error || !data) return null;
  return { supabase, user, role: data as StaffRole };
}
export async function requireStaff(
  roles: StaffRole[] = ["admin", "editor", "manager"],
) {
  const staff = await getStaff();
  if (!staff) throw new Error("UNAUTHORIZED");
  if (!roles.includes(staff.role)) throw new Error("FORBIDDEN");
  return staff;
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { requireStaff } from "@/lib/admin/auth";
import { apiError, jsonBody, sameOrigin } from "@/lib/http";
const patch = z.object({
  table: z.enum(["inquiries", "bookings"]),
  id: z.uuid(),
  version: z.number().int().positive(),
  status: z.string(),
  notes: z.string().max(10000),
  payment_status: z.enum(["unpaid", "partial", "paid"]).optional(),
});
export async function GET() {
  try {
    const { supabase } = await requireStaff(["admin", "manager"]);
    const results = await Promise.all([
      supabase
        .from("tourism_inquiries")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500),
      supabase
        .from("tourism_bookings")
        .select(
          "id,departure_id,travelers,form,receipt,waiver_version,policy_snapshot,status,payment_status,notes,version,created_at,updated_at",
        )
        .order("created_at", { ascending: false })
        .limit(500),
    ]);
    results.forEach((result) => {
      if (result.error) throw result.error;
    });
    return NextResponse.json(
      { inquiries: results[0].data, bookings: results[1].data },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    return apiError(error);
  }
}
export async function PATCH(request: Request) {
  try {
    sameOrigin(request);
    const { supabase } = await requireStaff(["admin", "manager"]);
    const input = patch.parse(await jsonBody(request));
    const allowed =
      input.table === "inquiries"
        ? ["new", "in_progress", "closed"]
        : ["pending", "confirmed", "cancelled", "completed"];
    if (!allowed.includes(input.status)) throw new Error("Invalid status");
    const values = {
      status: input.status,
      notes: input.notes,
      ...(input.table === "bookings"
        ? { payment_status: input.payment_status }
        : {}),
    };
    const mutation = input.table === "bookings" ? supabase.from("tourism_bookings").update(values) : supabase.from("tourism_inquiries").update({status:input.status,notes:input.notes});
    const { data, error } = await mutation
      .eq("id", input.id)
      .eq("version", input.version)
      .select("id")
      .maybeSingle();
    if (error) throw error;
    if (!data) throw new Error("CONFLICT");
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}

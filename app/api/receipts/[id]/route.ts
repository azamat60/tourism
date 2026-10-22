import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { publicSupabase } from "@/lib/supabase/server";
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const token = request.cookies.get(`tourism_receipt_${id}`)?.value;
  if (!z.uuid().safeParse(id).success || (!token || !z.uuid().safeParse(token).success))
    return NextResponse.json({ error: "Receipt unavailable" }, { status: 404 });
  const { data, error } = await publicSupabase().rpc("tourism_receipt", {
    p_id: id,
    p_token: token,
  });
  if (error || !data)
    return NextResponse.json({ error: "Receipt unavailable" }, { status: 404 });
  return NextResponse.json(data, {
    headers: { "Cache-Control": "private, no-store" },
  });
}

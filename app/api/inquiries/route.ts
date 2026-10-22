import { NextResponse } from "next/server";
import { publicSupabase } from "@/lib/supabase/server";
import { inquiryInput } from "@/lib/admin/validation";
import { apiError, jsonBody, sameOrigin } from "@/lib/http";
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const input = inquiryInput.parse(await jsonBody(request, 30000));
    const { data, error } = await publicSupabase().rpc(
      "tourism_submit_inquiry",
      { p_data: input },
    );
    if (error)
      return NextResponse.json(
        {
          error:
            "Request could not be saved. Check your details or try again later.",
        },
        { status: 400 },
      );
    return NextResponse.json({ id: data });
  } catch (error) {
    return apiError(error);
  }
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { publicSupabase } from "@/lib/supabase/server";
import { loadSiteData } from "@/lib/site-data";
import { createCheckout, emptyTraveler } from "@/lib/checkout";
import { apiError, jsonBody, sameOrigin } from "@/lib/http";
const traveler = z.object(
  Object.fromEntries(
    Object.keys(emptyTraveler()).map((key) => [
      key,
      ["extras", "initialed"].includes(key)
        ? z.array(z.string().max(200)).max(100)
        : z.string().max(key.includes("ignature") ? 300000 : 5000),
    ]),
  ),
);
const input = z.object({
  id: z.uuid(),
  token: z.uuid(),
  departureId: z.string().max(200),
  form: z.object({
    termsVersion: z.object({waiver:z.number().int().positive(),site:z.number().int().positive()}),
    travelers: z.array(traveler).min(1).max(100),
    specialRequests: z.string().max(5000),
    howHeard: z.string().max(100),
    howHeardOther: z.string().max(250),
    joinGroupId: z.literal(""),
  }),
  groupExtras: z.array(z.string().max(200)).max(100),
  policies: z.array(z.string()).max(50),
  expectedTotal: z.number().positive(),
});
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const value = input.parse(await jsonBody(request));
    const site = await loadSiteData();
    const { travelerError } = createCheckout(site.countries, site.checkout);
    const travelers = value.form.travelers as unknown as ReturnType<
      typeof emptyTraveler
    >[];
    const failure = travelers
      .map((person, index) =>
        travelerError(person, index, travelers, site.today),
      )
      .find(Boolean);
    if (failure) return NextResponse.json({ error: failure }, { status: 400 });
    const { data, error } = await publicSupabase().rpc("tourism_reserve", {
      p_id: value.id,
      p_token: value.token,
      p_departure: value.departureId,
      p_form: value.form,
      p_extras: value.groupExtras,
      p_policies: value.policies,
      p_expected_total: value.expectedTotal,
    });
    if (error) {
      const known = [
        "Not enough spaces",
        "Price changed",
        "Booking terms changed",
        "Booking has closed",
        "Departure unavailable",
        "Too many reservations",
      ];
      return NextResponse.json(
        {
          error: known.some((prefix) => error.message.startsWith(prefix))
            ? error.message
            : "Reservation could not be saved. Check your details and try again.",
        },
        { status: 409 },
      );
    }
    const response = NextResponse.json(data);
    response.cookies.set(`tourism_receipt_${value.id}`, value.token, {
      httpOnly: true,
      secure: new URL(request.url).protocol === "https:",
      sameSite: "lax",
      path: "/api/receipts/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return response;
  } catch (error) {
    return apiError(error);
  }
}

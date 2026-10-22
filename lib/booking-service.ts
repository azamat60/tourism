import type { Traveler } from "./checkout";
import type { quote } from "./catalog";
export type Inquiry = {
  name: string;
  email: string;
  whatsappNumber: string;
  date: string;
  tour: string;
  message: string;
  proposal?: {
    partnerName: string;
    setting: string;
    group: string;
    extras: string[];
  };
};
export type Receipt = {
  id: string;
  departureId: string;
  tourSlug: string;
  tourTitle: string;
  start: string;
  end: string;
  createdAt: string;
  travelers: number;
  quote: ReturnType<typeof quote>;
  currency: string;
  status: string;
  chargeAmount: number;
};
export type ReservationForm = {
  termsVersion: { waiver: number; site: number };
  travelers: Traveler[];
  specialRequests: string;
  howHeard: string;
  howHeardOther: string;
  joinGroupId: string;
};
async function send(path: string, body: unknown) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data;
}
export async function storeInquiry(inquiry: Inquiry): Promise<string> {
  return (await send("/api/inquiries", inquiry)).id;
}
export async function reserve(input: {
  id: string;
  token: string;
  departureId: string;
  form: ReservationForm;
  groupExtras: string[];
  policies: string[];
  expectedTotal: number;
}): Promise<Receipt> {
  return send("/api/reservations", input);
}
export async function getReceipt(id: string): Promise<Receipt | undefined> {
  const response = await fetch(`/api/receipts/${encodeURIComponent(id)}/`, {
    cache: "no-store",
  });
  if (!response.ok) return undefined;
  return response.json();
}

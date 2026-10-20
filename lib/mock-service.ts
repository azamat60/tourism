import type { Departure, Tour } from './mock-types';
import { quote } from './mock-data';
import type { Traveler } from './checkout';
import checkout from './mocks/checkout.mock.json';
import services from './mocks/services.mock.json';

export type Inquiry = {
  name: string; email: string; whatsappNumber: string; date: string; tour: string; message: string;
  proposal?: { partnerName: string; setting: string; group: string; extras: string[] };
};
export type MockReceipt = {
  id: string; departureId: string; tourSlug: string; tourTitle: string; start: string; end: string;
  createdAt: string; travelers: number; quote: ReturnType<typeof quote>; currency: string;
  status: 'simulated';
  chargeAmount: number;
};
export type ReservationForm = { travelers: Traveler[]; specialRequests: string; howHeard: string; howHeardOther: string; joinGroupId: string };
type StoredReservation = MockReceipt & { form?: ReservationForm; waiverVersion: string };
const REQUESTS_KEY = 'ecovalley:mock-inquiries:v1';
const RESERVATIONS_KEY = 'ecovalley:mock-reservations:v1';

function read<T>(key: string): T[] {
  try { return JSON.parse(sessionStorage.getItem(key) || '[]') as T[]; }
  catch { return []; }
}

export function storeInquiry(inquiry: Inquiry) {
  const record = { ...inquiry, id: crypto.randomUUID(), createdAt: new Date().toISOString(), status: 'local' };
  sessionStorage.setItem(REQUESTS_KEY, JSON.stringify([...read(REQUESTS_KEY), record].slice(-50)));
  return record.id;
}

export function getReceipt(id: string) {
  const record = read<StoredReservation>(RESERVATIONS_KEY).find((receipt) => receipt.id === id);
  if (!record) return undefined;
  const { form, waiverVersion, ...receipt } = record;
  void form; void waiverVersion;
  return { ...receipt, chargeAmount: receipt.chargeAmount ?? Math.round(receipt.quote.deposit * (receipt.currency === 'CAD' ? services.usdToCadRate : 1) * 100) / 100 };
}

export function simulatedSeats(departureId: string) {
  return read<MockReceipt>(RESERVATIONS_KEY).filter((record) => record.departureId === departureId)
    .reduce((sum, record) => sum + record.travelers, 0);
}

export function reserveLocally(input: {
  id: string; tour: Tour; departure: Departure; travelerExtras: string[][]; groupExtras: string[]; currency: string; form?: ReservationForm;
}) {
  const existing = getReceipt(input.id);
  if (existing) return existing;
  const count = input.travelerExtras.length;
  if (count < 1 || count + simulatedSeats(input.departure.id) > input.departure.capacity - input.departure.booked) {
    throw new Error('Not enough spaces remain for these travelers. Please choose another departure.');
  }
  const effectiveDeparture = { ...input.departure, booked: input.departure.booked + simulatedSeats(input.departure.id) };
  const cost = quote(input.tour, effectiveDeparture, input.travelerExtras, input.groupExtras);
  const receipt: MockReceipt = {
    id: input.id, departureId: input.departure.id, tourSlug: input.tour.slug, tourTitle: input.tour.title,
    start: input.departure.start, end: input.departure.end, createdAt: new Date().toISOString(), travelers: count,
    quote: cost, currency: input.currency, status: 'simulated',
    chargeAmount: Math.round(cost.deposit * (input.currency === 'CAD' ? services.usdToCadRate : 1) * 100) / 100,
  };
  sessionStorage.setItem(RESERVATIONS_KEY, JSON.stringify([...read<StoredReservation>(RESERVATIONS_KEY), { ...receipt, form: input.form, waiverVersion: checkout.WAIVER_VERSION }]));
  return receipt;
}

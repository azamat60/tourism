import type { Locale } from './content';
import type { TourSlug } from './tours';

export type Departure = {
  id: string;
  tour: TourSlug;
  start: string;
  price: number;
  booked: number;
  capacity: number;
};

export const sampleDepartures: Departure[] = [
  { id: 'sk-oct-12', tour: 'song-kul-escape', start: '2026-10-12', price: 320, booked: 2, capacity: 6 },
  { id: 'ks-oct-19', tour: 'kel-suu-wilderness', start: '2026-10-19', price: 890, booked: 1, capacity: 6 },
  { id: 'nt-oct-26', tour: 'nomad-trail', start: '2026-10-26', price: 1240, booked: 3, capacity: 8 },
  { id: 'sk-jun-12', tour: 'song-kul-escape', start: '2027-06-12', price: 340, booked: 1, capacity: 6 },
  { id: 'ks-jun-22', tour: 'kel-suu-wilderness', start: '2027-06-22', price: 920, booked: 0, capacity: 6 },
  { id: 'nt-jul-03', tour: 'nomad-trail', start: '2027-07-03', price: 1280, booked: 2, capacity: 8 },
  { id: 'sk-jul-18', tour: 'song-kul-escape', start: '2027-07-18', price: 350, booked: 0, capacity: 6 },
  { id: 'ks-aug-07', tour: 'kel-suu-wilderness', start: '2027-08-07', price: 940, booked: 2, capacity: 6 },
  { id: 'nt-aug-16', tour: 'nomad-trail', start: '2027-08-16', price: 1320, booked: 1, capacity: 8 },
];

export const dateLocale: Record<Locale, string> = {
  en: 'en-US', es: 'es-ES', fr: 'fr-FR', it: 'it-IT', ge: 'de-DE', ru: 'ru-RU', zh: 'zh-CN', ar: 'ar-SA',
};

export function dateFromIso(value: string) {
  return new Date(`${value}T12:00:00Z`);
}

export function endDate(start: string, days: number) {
  const value = dateFromIso(start);
  value.setUTCDate(value.getUTCDate() + days - 1);
  return value;
}

export function formatDepartureDate(locale: Locale, value: string | Date, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(dateLocale[locale], {
    day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC', ...options,
  }).format(typeof value === 'string' ? dateFromIso(value) : value);
}

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

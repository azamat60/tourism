import { site } from './mocks/site.mock';
import type { Locale } from '@/lib/content';

export const whatsappNumber = site.whatsappNumber;

export function whatsappLink(message: string) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function localeHref(locale: Locale, path = '/') {
  return `${locale === 'en' ? '' : `/${locale}`}${path}`;
}

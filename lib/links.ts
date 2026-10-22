import type { Locale } from './content';
export function whatsappLink(message: string, number: string) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
export function localeHref(locale: Locale, path = '/') {
  return `${locale === 'en' ? '' : `/${locale}`}${path}`;
}

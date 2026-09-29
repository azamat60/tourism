import type { Locale } from '@/lib/content';

export const whatsappNumber = '996559773283';

export function whatsappLink(message: string) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function localeHref(locale: Locale, path = '/') {
  return `${locale === 'en' ? '' : `/${locale}`}${path}`;
}

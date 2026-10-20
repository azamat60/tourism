import { notFound } from 'next/navigation';
import CheckoutPage from '@/components/CheckoutPage';
import { isTourSlug, tourSlugs } from '@/lib/tours';
import { isLocale, locales } from '@/lib/content';
export function generateStaticParams() { return locales.flatMap((locale) => tourSlugs.map((slug) => ({ locale, slug }))); }
export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isTourSlug(slug)) notFound();
  return <CheckoutPage locale={locale} slug={slug} />;
}

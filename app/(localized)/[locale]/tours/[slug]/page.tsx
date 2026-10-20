import { translate } from '@/lib/i18n';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import JourneyDetail from '@/components/JourneyDetail';
import { content, isLocale, locales } from '@/lib/content';
import { isTourSlug, tourBasics, tourSlugs } from '@/lib/tours';

export function generateStaticParams() {
  return locales.flatMap((locale) => tourSlugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isTourSlug(slug)) return {};
  const tour = tourBasics(content[locale], slug);
  return {
    title: `${translate(locale, tour.title)} | Nomad Discovery Tours`,
    description: translate(locale, tour.description),
    alternates: { languages: Object.fromEntries(locales.map((language) => [language === 'ge' ? 'de' : language, `/${language}/tours/${slug}/`])) },
  };
}

export default async function TourPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isTourSlug(slug)) notFound();
  return <JourneyDetail locale={locale} slug={slug} />;
}

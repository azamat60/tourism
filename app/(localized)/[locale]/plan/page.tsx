import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Planner from '@/components/Planner';
import { isLocale, locales } from '@/lib/content';
import { innerCopy } from '@/lib/innerCopy';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: `${innerCopy[locale].plannerTitle} | Nomad Discovery Tours`,
    description: innerCopy[locale].plannerDescription,
    alternates: { languages: Object.fromEntries(locales.map((language) => [language === 'ge' ? 'de' : language, `/${language}/plan/`])) },
  };
}

export default async function PlanPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <Planner locale={locale} />;
}

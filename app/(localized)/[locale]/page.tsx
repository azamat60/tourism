import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Home from '@/components/Home';
import { content, isLocale, locales } from '@/lib/content';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: `${content[locale].heroTitle} | Nomad Discovery Tours`,
    description: content[locale].heroDescription,
    alternates: { languages: Object.fromEntries(locales.map((language) => [language === 'ge' ? 'de' : language, `/${language}/`])) },
  };
}

export default async function LocalePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <Home locale={locale} copy={content[locale]} />;
}

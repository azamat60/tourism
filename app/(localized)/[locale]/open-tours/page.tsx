import { localizedPageMetadata } from '@/lib/page-metadata';
import { notFound } from 'next/navigation';
import DeparturesPage from '@/components/DeparturesPage';
import { isLocale, locales } from '@/lib/content';
export function generateStaticParams() { return locales.map((locale) => ({ locale })); }
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <DeparturesPage locale={locale} />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return isLocale(locale) ? localizedPageMetadata('departures', locale) : {};
}

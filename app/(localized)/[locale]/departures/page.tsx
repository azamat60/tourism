import { localizedPageMetadata } from '@/lib/page-metadata';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import DeparturesPage from '@/components/DeparturesPage';
import { isLocale } from '@/lib/content';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? localizedPageMetadata('departures', locale) : {};
}
export default async function Page({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; if (!isLocale(locale)) notFound(); return <DeparturesPage locale={locale} />; }

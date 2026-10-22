import { localizedPageMetadata } from '@/lib/page-metadata';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import TourCatalog from '@/components/TourCatalog';
import { isLocale } from '@/lib/content';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? localizedPageMetadata('tours', locale) : {};
}
export default async function Page({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; if (!isLocale(locale)) notFound(); return <TourCatalog locale={locale} />; }

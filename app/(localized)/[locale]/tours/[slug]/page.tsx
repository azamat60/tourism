import StructuredData from '@/components/StructuredData';
import { tourSchema } from '@/lib/structured-data';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { loadSiteData } from '@/lib/site-data';
import { createCatalog } from '@/lib/catalog';
import { tourMetadata } from '@/lib/page-metadata';
import { isLocale } from '@/lib/content';
import JourneyDetail from '@/components/JourneyDetail';
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  return tourMetadata(slug, locale);
}
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const data = await loadSiteData();
  const record = createCatalog(data).getTour(slug);
  if (!record) notFound();
  return (
    <>
      <StructuredData value={tourSchema(data, locale, record)} />
      <JourneyDetail locale={locale} slug={slug} />
    </>
  );
}

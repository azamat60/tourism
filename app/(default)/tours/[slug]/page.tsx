import StructuredData from '@/components/StructuredData';
import { tourSchema } from '@/lib/structured-data';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { loadSiteData } from '@/lib/site-data';
import { createCatalog } from '@/lib/catalog';
import { tourMetadata } from '@/lib/page-metadata';
import JourneyDetail from '@/components/JourneyDetail';
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return tourMetadata(slug, 'en');
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await loadSiteData();
  const record = createCatalog(data).getTour(slug);
  if (!record) notFound();
  return (
    <>
      <StructuredData value={tourSchema(data, 'en', record)} />
      <JourneyDetail locale={'en'} slug={slug} />
    </>
  );
}

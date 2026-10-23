import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { loadSiteData } from '@/lib/site-data';
import { createCatalog } from '@/lib/catalog';
import { tourMetadata } from '@/lib/page-metadata';
import CheckoutPage from '@/components/CheckoutPage';
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return tourMetadata(slug, 'en', true);
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await loadSiteData();
  if (!createCatalog(data).getTour(slug)) notFound();
  return <CheckoutPage locale={'en'} slug={slug} />;
}

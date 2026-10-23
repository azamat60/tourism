import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { loadSiteData } from '@/lib/site-data';
import { createCatalog } from '@/lib/catalog';
import { tourMetadata } from '@/lib/page-metadata';
import { isLocale } from '@/lib/content';
import CheckoutPage from '@/components/CheckoutPage';
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  return tourMetadata(slug, locale, true);
}
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const data = await loadSiteData();
  if (!createCatalog(data).getTour(slug)) notFound();
  return <CheckoutPage locale={locale} slug={slug} />;
}

import StructuredData from '@/components/StructuredData';
import { articleSchema } from '@/lib/structured-data';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { loadSiteData } from '@/lib/site-data';
import { createTourHelpers } from '@/lib/tours';
import { articleMetadata } from '@/lib/page-metadata';
import { isLocale } from '@/lib/content';
import { JournalDetail } from '@/components/JournalPage';
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  return articleMetadata(slug, locale);
}
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const data = await loadSiteData();
  const helpers = createTourHelpers(data);
  const record = helpers.getPost(slug);
  if (!record) notFound();
  return (
    <>
      <StructuredData value={articleSchema(data, locale, record)} />
      <JournalDetail locale={locale} slug={slug} />
    </>
  );
}

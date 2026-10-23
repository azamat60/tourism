import StructuredData from '@/components/StructuredData';
import { articleSchema } from '@/lib/structured-data';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { loadSiteData } from '@/lib/site-data';
import { createTourHelpers } from '@/lib/tours';
import { articleMetadata } from '@/lib/page-metadata';
import { JournalDetail } from '@/components/JournalPage';
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return articleMetadata(slug, 'en');
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await loadSiteData();
  const helpers = createTourHelpers(data);
  const record = helpers.getPost(slug);
  if (!record) notFound();
  return (
    <>
      <StructuredData value={articleSchema(data, 'en', record)} />
      <JournalDetail locale={'en'} slug={slug} />
    </>
  );
}

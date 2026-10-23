import PageStructuredData from '@/components/PageStructuredData';
import { localizedPageMetadata } from '@/lib/page-metadata';
import { notFound } from 'next/navigation';
import JournalPage from '@/components/JournalPage';
import { isLocale } from '@/lib/content';
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <>
      <PageStructuredData page="blog" locale={locale} />
      <JournalPage locale={locale} />
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return isLocale(locale) ? localizedPageMetadata('blog', locale) : {};
}

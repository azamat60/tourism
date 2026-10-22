import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { loadSiteData } from '@/lib/site-data';
import { createTourHelpers } from '@/lib/tours';
import { translate } from '@/lib/i18n';
import { isLocale } from '@/lib/content';
import { JournalDetail } from '@/components/JournalPage';
export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const data = await loadSiteData();
  const helpers = createTourHelpers(data);
  const record = helpers.getPost(slug);
  if (!record) return {};
  return { title: `${translate(locale, record.title)} | Nomad Discovery Tours`, description: translate(locale, record.summary) };
}
export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const data = await loadSiteData();
  const helpers = createTourHelpers(data);
  if (!helpers.getPost(slug)) notFound();
  return <JournalDetail locale={locale} slug={slug} />;
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { loadSiteData } from '@/lib/site-data';
import { createTourHelpers } from '@/lib/tours';
import { translate } from '@/lib/i18n';
import { JournalDetail } from '@/components/JournalPage';
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await loadSiteData();
  const helpers = createTourHelpers(data);
  const record = helpers.getPost(slug);
  if (!record) return {};
  return { title: `${translate('en', record.title)} | Nomad Discovery Tours`, description: translate('en', record.summary) };
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await loadSiteData();
  const helpers = createTourHelpers(data);
  if (!helpers.getPost(slug)) notFound();
  return <JournalDetail locale={'en'} slug={slug} />;
}

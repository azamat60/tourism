import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { loadSiteData } from '@/lib/site-data';
import { createCatalog } from '@/lib/catalog';
import { translate } from '@/lib/i18n';
import JourneyDetail from '@/components/JourneyDetail';
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await loadSiteData();
  const record = createCatalog(data).getTour(slug);
  if (!record) return {};
  return { title: `${translate('en', record.title)} | Nomad Discovery Tours`, description: translate('en', record.blurb) };
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await loadSiteData();
  if (!createCatalog(data).getTour(slug)) notFound();
  return <JourneyDetail locale={'en'} slug={slug} />;
}

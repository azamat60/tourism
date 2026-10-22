import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { loadSiteData } from '@/lib/site-data';
import { createCatalog } from '@/lib/catalog';
import { translate } from '@/lib/i18n';
import { isLocale } from '@/lib/content';
import CheckoutPage from '@/components/CheckoutPage';
export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const data = await loadSiteData();
  const record = createCatalog(data).getTour(slug);
  if (!record) return {};
  return { title: `${translate(locale, record.title)} | Nomad Discovery Tours`, description: translate(locale, record.blurb) };
}
export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const data = await loadSiteData();
  if (!createCatalog(data).getTour(slug)) notFound();
  return <CheckoutPage locale={locale} slug={slug} />;
}

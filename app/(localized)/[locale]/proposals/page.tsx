import { localizedPageMetadata } from '@/lib/page-metadata';
import { notFound } from 'next/navigation';
import ProposalsPage from '@/components/ProposalsPage';
import { isLocale } from '@/lib/content';
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <ProposalsPage locale={locale} />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return isLocale(locale) ? localizedPageMetadata('proposals', locale) : {};
}

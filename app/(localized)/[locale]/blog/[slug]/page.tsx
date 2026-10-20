import { notFound } from 'next/navigation';
import { JournalDetail } from '@/components/JournalPage';
import { isJournalSlug, journalSlugs } from '@/lib/journal';
import { isLocale, locales } from '@/lib/content';
export function generateStaticParams() { return locales.flatMap((locale) => journalSlugs.map((slug) => ({ locale, slug }))); }
export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isJournalSlug(slug)) notFound();
  return <JournalDetail locale={locale} slug={slug} />;
}

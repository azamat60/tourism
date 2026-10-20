import { translate } from '@/lib/i18n';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JournalDetail } from '@/components/JournalPage';
import { isLocale, locales } from '@/lib/content';
import { isJournalSlug, journalSlugs, journalStories } from '@/lib/journal';

export function generateStaticParams() { return locales.flatMap((locale) => journalSlugs.map((slug) => ({ locale, slug }))); }
export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> { const { locale, slug } = await params; return isLocale(locale) && isJournalSlug(slug) ? { title: `${translate(locale, journalStories[locale][slug].title)} | Nomad Discovery Tours`, description: translate(locale, journalStories[locale][slug].excerpt) } : {}; }
export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) { const { locale, slug } = await params; if (!isLocale(locale) || !isJournalSlug(slug)) notFound(); return <JournalDetail locale={locale} slug={slug} />; }

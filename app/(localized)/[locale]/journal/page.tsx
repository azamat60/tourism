import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import JournalPage from '@/components/JournalPage';
import { isLocale, locales } from '@/lib/content';
import { expandedCopy } from '@/lib/expandedCopy';

export function generateStaticParams() { return locales.map((locale) => ({ locale })); }
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> { const { locale } = await params; return isLocale(locale) ? { title: `${expandedCopy[locale].journalTitle} | Nomad Discovery Tours`, description: expandedCopy[locale].journalIntro } : {}; }
export default async function Page({ params }: { params: Promise<{ locale: string }> }) { const { locale } = await params; if (!isLocale(locale)) notFound(); return <JournalPage locale={locale} />; }

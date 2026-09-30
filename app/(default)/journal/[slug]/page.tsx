import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JournalDetail } from '@/components/JournalPage';
import { isJournalSlug, journalSlugs, journalStories } from '@/lib/journal';

export function generateStaticParams() { return journalSlugs.map((slug) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; return isJournalSlug(slug) ? { title: `${journalStories.en[slug].title} | Nomad Discovery Tours`, description: journalStories.en[slug].excerpt } : {}; }
export default async function Page({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; if (!isJournalSlug(slug)) notFound(); return <JournalDetail locale="en" slug={slug} />; }

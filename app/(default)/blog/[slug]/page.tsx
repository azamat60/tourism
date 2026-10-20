import { notFound } from 'next/navigation';
import { JournalDetail } from '@/components/JournalPage';
import { isJournalSlug, journalSlugs } from '@/lib/journal';
export function generateStaticParams() { return journalSlugs.map((slug) => ({ slug })); }
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isJournalSlug(slug)) notFound();
  return <JournalDetail locale="en" slug={slug} />;
}

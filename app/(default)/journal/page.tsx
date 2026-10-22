import { localizedPageMetadata } from '@/lib/page-metadata';
import type { Metadata } from 'next';
import JournalPage from '@/components/JournalPage';

export async function generateMetadata() { return localizedPageMetadata('blog'); }
export default function Page() { return <JournalPage locale="en" />; }

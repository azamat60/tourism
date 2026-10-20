import { pageMetadata } from '@/lib/page-metadata';
import type { Metadata } from 'next';
import JournalPage from '@/components/JournalPage';

export const metadata = pageMetadata.blog;
export default function Page() { return <JournalPage locale="en" />; }

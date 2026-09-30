import type { Metadata } from 'next';
import JournalPage from '@/components/JournalPage';
import { expandedCopy } from '@/lib/expandedCopy';

export const metadata: Metadata = { title: `${expandedCopy.en.journalTitle} | Nomad Discovery Tours`, description: expandedCopy.en.journalIntro };
export default function Page() { return <JournalPage locale="en" />; }

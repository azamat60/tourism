import { pageMetadata } from '@/lib/page-metadata';
import JournalPage from '@/components/JournalPage';
export default function Page() { return <JournalPage locale="en" />; }

export const metadata = pageMetadata.blog;

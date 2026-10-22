import { localizedPageMetadata } from '@/lib/page-metadata';
import JournalPage from '@/components/JournalPage';
export default function Page() { return <JournalPage locale="en" />; }

export async function generateMetadata() { return localizedPageMetadata('blog'); }

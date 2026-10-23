import PageStructuredData from '@/components/PageStructuredData';
import { localizedPageMetadata } from '@/lib/page-metadata';
import JournalPage from '@/components/JournalPage';
export default function Page() {
  return (
    <>
      <PageStructuredData page="blog" />
      <JournalPage locale="en" />
    </>
  );
}

export async function generateMetadata() {
  return localizedPageMetadata('blog');
}

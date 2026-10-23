import PageStructuredData from '@/components/PageStructuredData';
import { localizedPageMetadata } from '@/lib/page-metadata';
import Home from '@/components/Home';
import { content } from '@/lib/content';

export default function Page() {
  return (
    <>
      <PageStructuredData page="home" />
      <Home locale="en" copy={content.en} />
    </>
  );
}

export async function generateMetadata() {
  return localizedPageMetadata('home');
}

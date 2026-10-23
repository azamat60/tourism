import PageStructuredData from '@/components/PageStructuredData';
import { localizedPageMetadata } from '@/lib/page-metadata';
import type { Metadata } from 'next';
import AboutPage from '@/components/AboutPage';

export async function generateMetadata() {
  return localizedPageMetadata('about');
}
export default function Page() {
  return (
    <>
      <PageStructuredData page="about" />
      <AboutPage locale="en" />
    </>
  );
}

import PageStructuredData from '@/components/PageStructuredData';
import { localizedPageMetadata } from '@/lib/page-metadata';
import type { Metadata } from 'next';
import FaqPage from '@/components/FaqPage';

export async function generateMetadata() {
  return localizedPageMetadata('faq');
}
export default function Page() {
  return (
    <>
      <PageStructuredData page="faq" />
      <FaqPage locale="en" />
    </>
  );
}

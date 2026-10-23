import PageStructuredData from '@/components/PageStructuredData';
import { localizedPageMetadata } from '@/lib/page-metadata';
import type { Metadata } from 'next';
import BookingPage from '@/components/BookingPage';

export async function generateMetadata() {
  return localizedPageMetadata('booking');
}
export default function Page() {
  return (
    <>
      <PageStructuredData page="booking" />
      <BookingPage locale="en" />
    </>
  );
}

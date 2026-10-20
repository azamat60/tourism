import { pageMetadata } from '@/lib/page-metadata';
import type { Metadata } from 'next';
import BookingPage from '@/components/BookingPage';

export const metadata = pageMetadata.booking;
export default function Page() { return <BookingPage locale="en" />; }

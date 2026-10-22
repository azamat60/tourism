import { localizedPageMetadata } from '@/lib/page-metadata';
import type { Metadata } from 'next';
import BookingPage from '@/components/BookingPage';

export async function generateMetadata() { return localizedPageMetadata('booking'); }
export default function Page() { return <BookingPage locale="en" />; }

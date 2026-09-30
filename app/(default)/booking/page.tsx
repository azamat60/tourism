import type { Metadata } from 'next';
import BookingPage from '@/components/BookingPage';
import { expandedCopy } from '@/lib/expandedCopy';

export const metadata: Metadata = { title: `${expandedCopy.en.bookingTitle} | Nomad Discovery Tours`, description: expandedCopy.en.bookingIntro };
export default function Page() { return <BookingPage locale="en" />; }

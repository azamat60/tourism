import { pageMetadata } from '@/lib/page-metadata';
import type { Metadata } from 'next';
import FaqPage from '@/components/FaqPage';

export const metadata = pageMetadata.faq;
export default function Page() { return <FaqPage locale="en" />; }

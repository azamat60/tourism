import { localizedPageMetadata } from '@/lib/page-metadata';
import type { Metadata } from 'next';
import FaqPage from '@/components/FaqPage';

export async function generateMetadata() { return localizedPageMetadata('faq'); }
export default function Page() { return <FaqPage locale="en" />; }

import type { Metadata } from 'next';
import FaqPage from '@/components/FaqPage';
import { expandedCopy } from '@/lib/expandedCopy';

export const metadata: Metadata = { title: `${expandedCopy.en.faqTitle} | Nomad Discovery Tours`, description: expandedCopy.en.faqIntro };
export default function Page() { return <FaqPage locale="en" />; }

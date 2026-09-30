import type { Metadata } from 'next';
import AboutPage from '@/components/AboutPage';
import { expandedCopy } from '@/lib/expandedCopy';

export const metadata: Metadata = { title: `${expandedCopy.en.aboutTitle} | Nomad Discovery Tours`, description: expandedCopy.en.aboutIntro };
export default function Page() { return <AboutPage locale="en" />; }

import type { Metadata } from 'next';
import DeparturesPage from '@/components/DeparturesPage';
import { expandedCopy } from '@/lib/expandedCopy';

export const metadata: Metadata = { title: `${expandedCopy.en.datesTitle} | Nomad Discovery Tours`, description: expandedCopy.en.datesIntro };
export default function Page() { return <DeparturesPage locale="en" />; }

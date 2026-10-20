import { pageMetadata } from '@/lib/page-metadata';
import type { Metadata } from 'next';
import DeparturesPage from '@/components/DeparturesPage';

export const metadata = pageMetadata.departures;
export default function Page() { return <DeparturesPage locale="en" />; }

import { localizedPageMetadata } from '@/lib/page-metadata';
import type { Metadata } from 'next';
import DeparturesPage from '@/components/DeparturesPage';

export async function generateMetadata() { return localizedPageMetadata('departures'); }
export default function Page() { return <DeparturesPage locale="en" />; }

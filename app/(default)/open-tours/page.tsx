import { pageMetadata } from '@/lib/page-metadata';
import DeparturesPage from '@/components/DeparturesPage';
export default function Page() { return <DeparturesPage locale="en" />; }

export const metadata = pageMetadata.departures;

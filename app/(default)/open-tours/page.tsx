import { localizedPageMetadata } from '@/lib/page-metadata';
import DeparturesPage from '@/components/DeparturesPage';
export default function Page() { return <DeparturesPage locale="en" />; }

export async function generateMetadata() { return localizedPageMetadata('departures'); }

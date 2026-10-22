import { localizedPageMetadata } from '@/lib/page-metadata';
import ProposalsPage from '@/components/ProposalsPage';
export default function Page() { return <ProposalsPage locale="en" />; }

export async function generateMetadata() { return localizedPageMetadata('proposals'); }

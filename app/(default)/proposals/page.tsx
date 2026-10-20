import { pageMetadata } from '@/lib/page-metadata';
import ProposalsPage from '@/components/ProposalsPage';
export default function Page() { return <ProposalsPage locale="en" />; }

export const metadata = pageMetadata.proposals;

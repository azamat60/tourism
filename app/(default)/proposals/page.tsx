import PageStructuredData from '@/components/PageStructuredData';
import { localizedPageMetadata } from '@/lib/page-metadata';
import ProposalsPage from '@/components/ProposalsPage';
export default function Page() {
  return (
    <>
      <PageStructuredData page="proposals" />
      <ProposalsPage locale="en" />
    </>
  );
}

export async function generateMetadata() {
  return localizedPageMetadata('proposals');
}

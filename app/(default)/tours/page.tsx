import type { Metadata } from 'next';
import TourCatalog from '@/components/TourCatalog';
import { expandedCopy } from '@/lib/expandedCopy';

export const metadata: Metadata = { title: `${expandedCopy.en.catalogTitle} | Nomad Discovery Tours`, description: expandedCopy.en.catalogIntro };
export default function Page() { return <TourCatalog locale="en" />; }

import { pageMetadata } from '@/lib/page-metadata';
import type { Metadata } from 'next';
import TourCatalog from '@/components/TourCatalog';

export const metadata = pageMetadata.tours;
export default function Page() { return <TourCatalog locale="en" />; }

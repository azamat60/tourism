import { localizedPageMetadata } from '@/lib/page-metadata';
import type { Metadata } from 'next';
import TourCatalog from '@/components/TourCatalog';

export async function generateMetadata() { return localizedPageMetadata('tours'); }
export default function Page() { return <TourCatalog locale="en" />; }

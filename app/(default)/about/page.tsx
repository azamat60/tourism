import { pageMetadata } from '@/lib/page-metadata';
import type { Metadata } from 'next';
import AboutPage from '@/components/AboutPage';

export const metadata = pageMetadata.about;
export default function Page() { return <AboutPage locale="en" />; }

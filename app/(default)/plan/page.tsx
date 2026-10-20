import { pageMetadata } from '@/lib/page-metadata';
import type { Metadata } from 'next';
import Planner from '@/components/Planner';

export const metadata = pageMetadata.booking;
export default function PlanPage() {
  return <Planner locale="en" />;
}

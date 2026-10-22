import { localizedPageMetadata } from '@/lib/page-metadata';
import type { Metadata } from 'next';
import Planner from '@/components/Planner';

export async function generateMetadata() { return localizedPageMetadata('booking'); }
export default function PlanPage() {
  return <Planner locale="en" />;
}

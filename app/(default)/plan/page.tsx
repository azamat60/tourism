import type { Metadata } from 'next';
import Planner from '@/components/Planner';
import { innerCopy } from '@/lib/innerCopy';

export const metadata: Metadata = {
  title: `${innerCopy.en.plannerTitle} | Nomad Discovery Tours`,
  description: innerCopy.en.plannerDescription,
};

export default function PlanPage() {
  return <Planner locale="en" />;
}

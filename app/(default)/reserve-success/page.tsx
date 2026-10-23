export const metadata = { robots: { index: false, follow: false } };
import SuccessPage from '@/components/SuccessPage';
export default function Page() {
  return <SuccessPage locale="en" reservation />;
}

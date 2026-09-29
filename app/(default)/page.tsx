import Home from '@/components/Home';
import { content } from '@/lib/content';

export default function Page() {
  return <Home locale="en" copy={content.en} />;
}

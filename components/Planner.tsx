import BookingPage from './BookingPage';
import type { Locale } from '@/lib/content';
export default function Planner({ locale }: { locale: Locale }) { return <BookingPage locale={locale} />; }

import { notFound } from 'next/navigation';
import SuccessPage from '@/components/SuccessPage';
import { isLocale } from '@/lib/content';
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <SuccessPage locale={locale} reservation />;
}

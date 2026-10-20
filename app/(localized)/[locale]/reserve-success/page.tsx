import { notFound } from 'next/navigation';
import SuccessPage from '@/components/SuccessPage';
import { isLocale, locales } from '@/lib/content';
export function generateStaticParams() { return locales.map((locale) => ({ locale })); }
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <SuccessPage locale={locale} reservation />;
}

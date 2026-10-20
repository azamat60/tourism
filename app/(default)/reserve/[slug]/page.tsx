import { notFound } from 'next/navigation';
import CheckoutPage from '@/components/CheckoutPage';
import { isTourSlug, tourSlugs } from '@/lib/tours';
export function generateStaticParams() { return tourSlugs.map((slug) => ({ slug })); }
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isTourSlug(slug)) notFound();
  return <CheckoutPage locale="en" slug={slug} />;
}

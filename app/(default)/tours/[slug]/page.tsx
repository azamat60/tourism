import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import JourneyDetail from '@/components/JourneyDetail';
import { content } from '@/lib/content';
import { isTourSlug, tourBasics, tourSlugs } from '@/lib/tours';

export function generateStaticParams() {
  return tourSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!isTourSlug(slug)) return {};
  const tour = tourBasics(content.en, slug);
  return { title: `${tour.title} | Nomad Discovery Tours`, description: tour.description };
}

export default async function TourPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isTourSlug(slug)) notFound();
  return <JourneyDetail locale="en" slug={slug} />;
}

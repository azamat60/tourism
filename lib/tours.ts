import type { Copy } from './content';
import { createCatalog, durationDays } from './catalog';
import type { SiteData } from './site-types';
export type TourSlug = string;
export function createTourHelpers(data: SiteData) {
  const { activeTours, asset, getTour, tourAliases, blogPosts } = createCatalog(data);
  const tourSlugs = [...activeTours.map((tour) => tour.slug), ...Object.keys(tourAliases)];
  const tourConfig = Object.fromEntries(activeTours.map((tour, index) => [tour.slug, {
    days: durationDays(tour), nights: Math.max(0, durationDays(tour) - 1), image: asset(tour.image), number: String(index + 1).padStart(2, '0'),
  }]));
  const aliases: Record<string, string> = { 'packing-for-the-highlands': 'packing-tips-trek', 'a-night-in-a-yurt': 'yurt-life-nomads', 'your-first-horse-trek': 'horse-trekking-kyrgyzstan' };
  const getPost = (slug: string) => blogPosts.find((post) => post.slug === (aliases[slug] || slug));
  function tourBasics(_copy: Copy, slug: string) {
    const tour = getTour(slug)!;
    return { title: tour.title, place: tour.locations.join(', '), tag: tour.category || '', description: tour.blurb,
      days: durationDays(tour), nights: Math.max(0, durationDays(tour) - 1), image: asset(tour.image), number: String(activeTours.indexOf(tour) + 1).padStart(2, '0') };
  }
  return { tourSlugs, tourConfig, tourBasics, getPost, isTourSlug: (slug: string) => Boolean(getTour(slug)), isJournalSlug: (slug: string) => Boolean(getPost(slug)) };
}

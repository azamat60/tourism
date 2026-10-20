import type { Copy } from './content';
import { activeTours, asset, durationDays, getTour, tourAliases } from './mock-data';

export const tourSlugs = [...activeTours.map((tour) => tour.slug), ...Object.keys(tourAliases)];
export type TourSlug = string;
export const tourConfig = Object.fromEntries(activeTours.map((tour, index) => [tour.slug, {
  days: durationDays(tour), nights: Math.max(0, durationDays(tour) - 1), image: asset(tour.image), number: String(index + 1).padStart(2, '0'),
}]));
export function isTourSlug(value: string): value is TourSlug { return Boolean(getTour(value)); }
export function tourBasics(_copy: Copy, slug: TourSlug) {
  const tour = getTour(slug)!;
  return { title: tour.title, place: tour.locations.join(', '), tag: tour.category || '', description: tour.blurb,
    days: durationDays(tour), nights: Math.max(0, durationDays(tour) - 1), image: asset(tour.image), number: String(activeTours.indexOf(tour) + 1).padStart(2, '0') };
}

import type { Copy } from '@/lib/content';

export const tourSlugs = ['song-kul-escape', 'kel-suu-wilderness', 'nomad-trail'] as const;
export type TourSlug = (typeof tourSlugs)[number];

export const tourConfig: Record<TourSlug, { days: number; nights: number; image: string; number: string }> = {
  'song-kul-escape': { days: 3, nights: 2, image: '/images/song-kul.jpg', number: '01' },
  'kel-suu-wilderness': { days: 5, nights: 4, image: '/images/kel-suu.jpg', number: '02' },
  'nomad-trail': { days: 7, nights: 6, image: '/images/hero.jpg', number: '03' },
};

export function isTourSlug(value: string): value is TourSlug {
  return tourSlugs.includes(value as TourSlug);
}

export function tourBasics(copy: Copy, slug: TourSlug) {
  const index = tourSlugs.indexOf(slug) + 1;
  const key = `tour${index}` as 'tour1' | 'tour2' | 'tour3';
  return {
    title: copy[`${key}Title`],
    place: copy[`${key}Place`],
    tag: copy[`${key}Tag`],
    description: copy[`${key}Description`],
    ...tourConfig[slug],
  };
}

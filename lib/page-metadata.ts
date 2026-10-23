import { notFound } from 'next/navigation';
import { translate } from './i18n';
import { loadSiteData } from './site-data';
import { createCatalog } from './catalog';
import { createTourHelpers } from './tours';
import { buildPageMetadata } from './seo';
import { pagePaths, seoCopy, type PageKey } from './seo-copy';
import type { Locale } from './content';
import type { SiteData } from './site-types';

export function translateContent(data: SiteData, locale: Locale, text: string) {
  const custom = data.translations[locale]?.[text];
  return custom && custom !== text ? custom : translate(locale, text);
}

export async function localizedPageMetadata(
  key: PageKey,
  locale: Locale = 'en',
) {
  const data = await loadSiteData();
  const page =
    key in data.pages ? data.pages[key as keyof typeof data.pages] : undefined;
  const blocks = page?.sections[0]?.blocks;
  const copy = seoCopy[locale][key];
  return buildPageMetadata({
    title:
      copy?.title ||
      translateContent(
        data,
        locale,
        blocks?.[0]?.text || 'Tours in Kyrgyzstan',
      ),
    description:
      copy?.description ||
      translateContent(
        data,
        locale,
        blocks?.[1]?.text || data.site.description,
      ),
    path: pagePaths[key],
    locale,
    siteName: data.site.name,
    image: data.site.heroPoster,
  });
}

export async function tourMetadata(
  slug: string,
  locale: Locale = 'en',
  checkout = false,
) {
  const data = await loadSiteData();
  const catalog = createCatalog(data);
  const tour = catalog.getTour(slug);
  if (!tour) notFound();
  return buildPageMetadata({
    title:
      locale === 'en'
        ? tour.title.replace(/Lake Ride\b/, 'Lake Horse Trek')
        : translateContent(data, locale, tour.title),
    description: translateContent(data, locale, tour.blurb),
    path: `/${checkout ? 'reserve' : 'tours'}/${tour.slug}/`,
    locale,
    siteName: data.site.name,
    image: catalog.asset(tour.image),
    index: !checkout,
  });
}

export async function articleMetadata(slug: string, locale: Locale = 'en') {
  const data = await loadSiteData();
  const post = createTourHelpers(data).getPost(slug);
  if (!post) notFound();
  return buildPageMetadata({
    title: translateContent(data, locale, post.title),
    description: translateContent(data, locale, post.summary),
    path: `/blog/${post.slug}/`,
    locale,
    siteName: data.site.name,
    image: createCatalog(data).asset(post.image),
    article: true,
  });
}

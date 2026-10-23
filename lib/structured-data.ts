import { createCatalog, itineraryFor } from './catalog';
import { translate } from './i18n';
import { localeHref } from './links';
import { absoluteUrl, languageCode } from './seo';
import { pagePaths, seoCopy, type PageKey } from './seo-copy';
import type { Locale } from './content';
import type { SiteData } from './site-types';
import type { BlogPost, Tour } from './types';

type Schema = Record<string, unknown>;
const organizationId = () => absoluteUrl('/#organization');
const websiteId = () => absoluteUrl('/#website');
const translated = (data: SiteData, locale: Locale, text: string) => {
  const custom = data.translations[locale]?.[text];
  return custom && custom !== text ? custom : translate(locale, text);
};

export function siteSchema(data: SiteData): Schema {
  const { site } = data;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': organizationId(),
        name: site.name,
        url: absoluteUrl('/'),
        logo: {
          '@type': 'ImageObject',
          url: absoluteUrl('/images/nomad-logo.svg'),
          width: 256,
          height: 256,
        },
        description: site.description,
        telephone: site.phone || undefined,
        email: site.email || undefined,
        sameAs: site.instagram ? [site.instagram] : undefined,
      },
      {
        '@type': 'WebSite',
        '@id': websiteId(),
        name: site.name,
        url: absoluteUrl('/'),
        publisher: { '@id': organizationId() },
      },
    ],
  };
}

function breadcrumbs(
  data: SiteData,
  locale: Locale,
  path: string,
  title: string,
  parent?: PageKey,
): Schema {
  const items = [{ name: data.site.name, path: '/' }];
  if (parent)
    items.push({
      name: translated(data, locale, parent === 'tours' ? 'Tours' : 'Journal'),
      path: pagePaths[parent],
    });
  items.push({ name: title, path });
  return {
    '@type': 'BreadcrumbList',
    '@id': `${absoluteUrl(localeHref(locale, path))}#breadcrumbs`,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(localeHref(locale, item.path)),
    })),
  };
}

function webpage(
  locale: Locale,
  path: string,
  title: string,
  description: string,
): Schema {
  const url = absoluteUrl(localeHref(locale, path));
  return {
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: title,
    description,
    inLanguage: languageCode(locale),
    isPartOf: { '@id': websiteId() },
    publisher: { '@id': organizationId() },
    breadcrumb: path === '/' ? undefined : { '@id': `${url}#breadcrumbs` },
  };
}

function tourList(data: SiteData, locale: Locale): Schema {
  return {
    '@type': 'ItemList',
    itemListElement: data.tours
      .filter((tour) => tour.active !== false)
      .map((tour, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: translated(data, locale, tour.title),
        url: absoluteUrl(localeHref(locale, `/tours/${tour.slug}/`)),
      })),
  };
}

export function pageSchema(
  data: SiteData,
  locale: Locale,
  key: PageKey,
): Schema {
  const blocks =
    key in data.pages
      ? data.pages[key as keyof typeof data.pages].sections[0]?.blocks
      : undefined;
  const title = translated(
    data,
    locale,
    blocks?.[0]?.text || seoCopy[locale][key]?.title || 'Tours',
  );
  const description = translated(
    data,
    locale,
    blocks?.[1]?.text ||
      seoCopy[locale][key]?.description ||
      data.site.description,
  );
  const page = webpage(locale, pagePaths[key], title, description);
  if (key === 'tours')
    Object.assign(page, {
      '@type': 'CollectionPage',
      mainEntity: tourList(data, locale),
    });
  if (key === 'faq')
    Object.assign(page, {
      '@type': 'FAQPage',
      mainEntity: data.faq.map((item) => ({
        '@type': 'Question',
        name: translated(data, locale, item.question),
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            typeof item.answer === 'string'
              ? translated(data, locale, item.answer)
              : item.answer.items
                  .map((line) => translated(data, locale, line))
                  .join('\n'),
        },
      })),
    });
  return {
    '@context': 'https://schema.org',
    '@graph':
      key === 'home'
        ? [page]
        : [page, breadcrumbs(data, locale, pagePaths[key], title)],
  };
}

export function tourSchema(data: SiteData, locale: Locale, tour: Tour): Schema {
  const path = `/tours/${tour.slug}/`;
  const url = absoluteUrl(localeHref(locale, path));
  const title = translated(data, locale, tour.title);
  const description = translated(data, locale, tour.blurb);
  const days = itineraryFor(tour);
  const trip = {
    '@type': 'TouristTrip',
    '@id': `${url}#trip`,
    name: title,
    description,
    url,
    image: absoluteUrl(createCatalog(data).asset(tour.image)),
    provider: { '@id': organizationId() },
    itinerary: days.length
      ? {
          '@type': 'ItemList',
          itemListElement: days.map((day, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'Place',
              name: translated(data, locale, day.place || day.title),
            },
          })),
        }
      : undefined,
  };
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        ...webpage(locale, path, title, description),
        mainEntity: { '@id': `${url}#trip` },
      },
      trip,
      breadcrumbs(data, locale, path, title, 'tours'),
    ],
  };
}

export function articleSchema(
  data: SiteData,
  locale: Locale,
  post: BlogPost,
): Schema {
  const path = `/blog/${post.slug}/`;
  const url = absoluteUrl(localeHref(locale, path));
  const title = translated(data, locale, post.title);
  const description = translated(data, locale, post.summary);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        ...webpage(locale, path, title, description),
        mainEntity: { '@id': `${url}#article` },
      },
      {
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        headline: title,
        description,
        url,
        image: absoluteUrl(createCatalog(data).asset(post.image)),
        inLanguage: languageCode(locale),
        author: {
          '@type': 'Organization',
          '@id': organizationId(),
          name: data.site.name,
          url: absoluteUrl('/about/'),
        },
        publisher: { '@id': organizationId() },
        mainEntityOfPage: { '@id': `${url}#webpage` },
      },
      breadcrumbs(data, locale, path, title, 'blog'),
    ],
  };
}

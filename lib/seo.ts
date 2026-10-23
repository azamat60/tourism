import type { Metadata, MetadataRoute } from 'next';
import { locales, type Locale } from './content';
import { localeHref } from './links';
import { pagePaths } from './seo-copy';
import type { SiteData } from './site-types';

export const languageCode = (locale: Locale) =>
  locale === 'ge' ? 'de' : locale;
const ogLocales: Record<Locale, string> = {
  en: 'en_US',
  es: 'es_ES',
  fr: 'fr_FR',
  it: 'it_IT',
  ge: 'de_DE',
  ru: 'ru_RU',
  zh: 'zh_CN',
  ar: 'ar_AR',
};

export function siteUrl() {
  const value =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    'https://nomaddiscoverytours.com';
  const url = new URL(value);
  if (
    !['https:', 'http:'].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== '/' ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      'NEXT_PUBLIC_SITE_URL must be an HTTP(S) origin without a path, credentials, query or fragment.',
    );
  }
  return url;
}

export function indexingEnabled() {
  return (
    process.env.SEO_INDEXING_ENABLED !== 'false' &&
    (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === 'production')
  );
}

export function absoluteUrl(path: string) {
  return new URL(path, siteUrl()).href;
}

export function languageAlternates(path: string) {
  return Object.fromEntries([
    ...locales.map((locale) => [
      languageCode(locale),
      absoluteUrl(localeHref(locale, path)),
    ]),
    ['x-default', absoluteUrl(path)],
  ]);
}

export function metadataRobots(index = true): Metadata['robots'] {
  return {
    index: index && indexingEnabled(),
    follow: true,
    googleBot: {
      index: index && indexingEnabled(),
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  };
}

export function rootMetadata(): Metadata {
  return {
    metadataBase: siteUrl(),
    applicationName: 'Nomad Discovery Tours',
    category: 'travel',
    robots: metadataRobots(),
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
      other: process.env.YANDEX_SITE_VERIFICATION
        ? { 'yandex-verification': process.env.YANDEX_SITE_VERIFICATION }
        : undefined,
    },
  };
}

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  locale: Locale;
  siteName: string;
  image?: string;
  article?: boolean;
  index?: boolean;
};

export function buildPageMetadata(input: PageMetadataInput): Metadata {
  const { path, locale, siteName, article = false, index = true } = input;
  const title = `${input.title} | ${siteName}`;
  const description = input.description.replace(/\s+/g, ' ').trim();
  const url = absoluteUrl(localeHref(locale, path));
  const image = absoluteUrl(input.image || '/images/hero.jpg');
  return {
    title,
    description,
    robots: metadataRobots(index),
    alternates: index
      ? { canonical: url, languages: languageAlternates(path) }
      : undefined,
    openGraph: {
      type: article ? 'article' : 'website',
      title,
      description,
      url,
      siteName,
      locale: ogLocales[locale],
      alternateLocale: locales
        .filter((value) => value !== locale)
        .map((value) => ogLocales[value]),
      images: [{ url: image, alt: input.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export function buildSitemap(
  data: Pick<SiteData, 'tours' | 'blogPosts'>,
): MetadataRoute.Sitemap {
  if (!indexingEnabled()) return [];
  const paths = [
    ...Object.values(pagePaths),
    ...data.tours
      .filter((tour) => tour.active !== false)
      .map((tour) => `/tours/${tour.slug}/`),
    ...data.blogPosts.map((post) => `/blog/${post.slug}/`),
  ];
  return [...new Set(paths)].flatMap((path) =>
    locales.map((locale) => ({
      url: absoluteUrl(localeHref(locale, path)),
    })),
  );
}

export function buildRobots(): MetadataRoute.Robots {
  if (!indexingEnabled()) return { rules: { userAgent: '*', disallow: '/' } };
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/auth/'],
    },
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

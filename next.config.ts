import type { NextConfig } from 'next';
import { locales } from './lib/content';
import { localeHref } from './lib/links';
import { tourAliases, postAliases } from './lib/route-aliases';

const nextConfig: NextConfig = {
  agentRules: false,
  trailingSlash: true,
  images: { formats: ['image/avif', 'image/webp'] },
  async redirects() {
    const aliases = [
      ['/journal/', '/blog/'],
      ['/departures/', '/open-tours/'],
      ['/plan/', '/booking/'],
      ...Object.entries(tourAliases).map(([alias, slug]) => [
        `/tours/${alias}/`,
        `/tours/${slug}/`,
      ]),
      ...Object.entries(postAliases).flatMap(([alias, slug]) => [
        [`/blog/${alias}/`, `/blog/${slug}/`],
        [`/journal/${alias}/`, `/blog/${slug}/`],
      ]),
      ['/journal/:slug/', '/blog/:slug/'],
    ];
    return [
      {
        source: '/:path(.*)',
        has: [{ type: 'host', value: 'www.nomaddiscoverytours.com' }],
        destination: 'https://nomaddiscoverytours.com/:path*',
        statusCode: 301,
      },
      { source: '/en/:path*', destination: '/:path*', permanent: true },
      ...locales.flatMap((locale) =>
        aliases.map(([source, destination]) => ({
          source: localeHref(locale, source),
          destination: localeHref(locale, destination),
          permanent: true,
        })),
      ),
    ];
  },
  async headers() {
    const privatePaths = [
      '/admin/:path*',
      '/api/:path*',
      '/auth/:path*',
      ...locales.flatMap((locale) =>
        ['/reserve/:path*', '/success/', '/reserve-success/'].map((path) =>
          localeHref(locale, path),
        ),
      ),
    ];
    return privatePaths.map((source) => ({
      source,
      headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
    }));
  },
};

export default nextConfig;

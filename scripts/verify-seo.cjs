const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const ts = require('typescript');

require.extensions['.ts'] = (module, filename) => {
  const result = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      esModuleInterop: true,
      target: ts.ScriptTarget.ES2020,
    },
  });
  module._compile(result.outputText, filename);
};

const seo = require('../lib/seo.ts');
const { locales } = require('../lib/content.ts');
const { seoCopy, pagePaths } = require('../lib/seo-copy.ts');
const {
  siteSchema,
  pageSchema,
  tourSchema,
  articleSchema,
} = require('../lib/structured-data.ts');
const data = {
  site: require('../lib/mocks/site.mock.ts').site,
  tours: require('../lib/mocks/tours.mock.json'),
  blogPosts: require('../lib/mocks/blog.mock.json'),
  assets: require('../lib/mocks/assets.mock.json'),
  pages: require('../lib/mocks/pages.mock.json'),
  faq: require('../lib/mocks/faq.mock.json'),
  translations: {},
};

function withEnv(values, run) {
  const previous = Object.fromEntries(
    Object.keys(values).map((key) => [key, process.env[key]]),
  );
  try {
    for (const [key, value] of Object.entries(values)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    run();
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

test('canonical and reciprocal language alternatives use the confirmed origin and German de code', () => {
  withEnv(
    {
      NEXT_PUBLIC_SITE_URL: undefined,
      SEO_INDEXING_ENABLED: 'true',
      VERCEL_ENV: 'production',
    },
    () => {
      for (const locale of locales) {
        const copy = seoCopy[locale].home;
        const metadata = seo.buildPageMetadata({
          ...copy,
          path: '/',
          locale,
          siteName: data.site.name,
        });
        assert.equal(
          metadata.alternates.canonical,
          `https://nomaddiscoverytours.com/${locale === 'en' ? '' : locale + '/'}`,
        );
        assert.equal(Object.keys(metadata.alternates.languages).length, 9);
        assert.equal(
          metadata.alternates.languages.de,
          'https://nomaddiscoverytours.com/ge/',
        );
        assert.equal(metadata.alternates.languages.ge, undefined);
        assert.equal(
          metadata.alternates.languages.en,
          metadata.alternates.languages['x-default'],
        );
        assert.equal(metadata.robots.index, true);
        assert.equal(metadata.openGraph.title, metadata.title);
        assert.equal(metadata.twitter.description, metadata.description);
      }
      for (const page of Object.keys(pagePaths)) {
        assert.ok(seoCopy.en[page]?.title && seoCopy.ru[page]?.description);
      }
    },
  );
});

test('checkout is noindex without inherited canonical; previews and indexing switch fail closed', () => {
  withEnv({ VERCEL_ENV: 'preview', SEO_INDEXING_ENABLED: 'true' }, () => {
    assert.equal(seo.indexingEnabled(), false);
    assert.deepEqual(seo.buildSitemap(data), []);
    assert.deepEqual(seo.buildRobots().rules, {
      userAgent: '*',
      disallow: '/',
    });
    assert.equal(seo.rootMetadata().robots.index, false);
  });
  withEnv({ VERCEL_ENV: 'production', SEO_INDEXING_ENABLED: 'false' }, () =>
    assert.equal(seo.indexingEnabled(), false),
  );
  const metadata = seo.buildPageMetadata({
    title: 'Checkout',
    description: 'Reserve',
    path: '/reserve/tour/',
    locale: 'ru',
    siteName: data.site.name,
    index: false,
  });
  assert.equal(metadata.robots.index, false);
  assert.equal(metadata.alternates, undefined);
});

test('sitemap includes only unique canonical active records across all eight languages', () => {
  withEnv(
    {
      NEXT_PUBLIC_SITE_URL: 'https://nomaddiscoverytours.com',
      SEO_INDEXING_ENABLED: 'true',
      VERCEL_ENV: 'production',
    },
    () => {
      const catalog = {
        ...data,
        tours: [
          ...data.tours,
          { ...data.tours[0], slug: 'draft', active: false },
        ],
      };
      const sitemap = seo.buildSitemap(catalog);
      const urls = sitemap.map((entry) => entry.url);
      assert.equal(
        urls.length,
        (Object.keys(pagePaths).length +
          data.tours.length +
          data.blogPosts.length) *
          locales.length,
      );
      assert.equal(new Set(urls).size, urls.length);
      assert.ok(
        urls.every(
          (url) =>
            url.endsWith('/') &&
            !/\/(reserve|success|admin|api|auth|journal|departures|plan|en|draft)\//.test(
              url,
            ),
        ),
      );
      assert.ok(!urls.some((url) => url.includes('/song-kul-escape/')));
      assert.ok(sitemap.every((entry) => !entry.lastModified));
      assert.equal(
        seo.buildRobots().sitemap,
        'https://nomaddiscoverytours.com/sitemap.xml',
      );
      assert.ok(
        !seo
          .buildRobots()
          .rules.disallow.some((path) => path.includes('reserve')),
      );
    },
  );
});

test('schema uses visible translated content, actual itinerary and canonical entity links', () => {
  const organization = siteSchema(data)['@graph'][0];
  assert.equal(organization.name, data.site.name);
  assert.equal(organization.aggregateRating, undefined);
  const customized = {
    ...data,
    translations: { ru: { [data.tours[0].title]: 'Название из CMS' } },
  };
  const graph = tourSchema(customized, 'ru', data.tours[0])['@graph'];
  const trip = graph.find((node) => node['@type'] === 'TouristTrip');
  assert.equal(trip.name, 'Название из CMS');
  assert.ok(trip.itinerary.itemListElement.length > 0);
  assert.ok(trip.url.includes(`/ru/tours/${data.tours[0].slug}/`));
  const crumbs = graph.find(
    (node) => node['@type'] === 'BreadcrumbList',
  ).itemListElement;
  assert.equal(crumbs[1].item, 'https://nomaddiscoverytours.com/ru/tours/');
  assert.equal(crumbs[2].item, trip.url);
  const faq = pageSchema(data, 'ru', 'faq')['@graph'][0];
  assert.equal(faq.mainEntity.length, data.faq.length);
  assert.notEqual(faq.mainEntity[0].name, data.faq[0].question);
  const article = articleSchema(data, 'ge', data.blogPosts[0])['@graph'][1];
  assert.equal(article.inLanguage, 'de');
  assert.ok(article.url.includes(`/ge/blog/${data.blogPosts[0].slug}/`));
  assert.equal(article.datePublished, undefined);
});

test('JSON-LD escapes CMS script injection and preserves payload after parsing', () => {
  const payload = {
    name: '</script><script>alert(1)</script>',
    text: '\u2028\u2029',
  };
  const serialized = seo.serializeJsonLd(payload);
  assert.ok(!serialized.includes('<'));
  assert.deepEqual(JSON.parse(serialized), payload);
});

test('origin validation rejects path, query, credentials and non-web schemes', () => {
  for (const value of [
    'javascript:alert(1)',
    'https://example.com/path',
    'https://example.com/?a=1',
    'https://user:pass@example.com',
  ]) {
    withEnv({ NEXT_PUBLIC_SITE_URL: value }, () =>
      assert.throws(() => seo.siteUrl()),
    );
  }
});

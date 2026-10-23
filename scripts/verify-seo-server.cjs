const assert = require('node:assert/strict');
const base = (process.env.SITE_URL || 'http://localhost:3001').replace(
  /\/$/,
  '',
);
const origin = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://nomaddiscoverytours.com'
).replace(/\/$/, '');
const locales = ['en', 'es', 'fr', 'it', 'ge', 'ru', 'zh', 'ar'];

function attribute(tag, name) {
  return tag.match(new RegExp(`\\b${name}="([^"]*)"`, 'i'))?.[1];
}
function links(html, rel) {
  return [...html.matchAll(/<link\b[^>]*>/g)]
    .map(([tag]) => tag)
    .filter((tag) => attribute(tag, 'rel') === rel);
}
function metadata(html, name) {
  return [...html.matchAll(/<meta\b[^>]*>/g)]
    .map(([tag]) => tag)
    .filter(
      (tag) =>
        attribute(tag, 'name') === name || attribute(tag, 'property') === name,
    )
    .map((tag) => attribute(tag, 'content'));
}

(async () => {
  const robots = await fetch(`${base}/robots.txt`);
  assert.equal(robots.status, 200);
  const robotsText = await robots.text();
  assert.ok(robotsText.includes(`Sitemap: ${origin}/sitemap.xml`));
  assert.ok(
    !/^Disallow: \/$/m.test(robotsText),
    'Indexing disabled on this server',
  );
  const sitemap = await fetch(`${base}/sitemap.xml`);
  assert.equal(sitemap.status, 200);
  const xml = await sitemap.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => match[1],
  );
  assert.ok(urls.length >= 8 * 8);
  assert.equal(new Set(urls).size, urls.length);
  assert.ok(
    !urls.some((url) =>
      /\/(en|reserve|success|reserve-success|admin|api|journal|departures|plan)\//.test(
        url,
      ),
    ),
  );
  let checked = 0;
  for (const locale of locales) {
    const prefix = locale === 'en' ? '' : `/${locale}`;
    await Promise.all(
      [
        '/',
        '/tours/',
        '/tours/3-day-song-kul-lake-ride/',
        '/blog/horse-trekking-kyrgyzstan/',
      ].map(async (path) => {
        const response = await fetch(`${base}${prefix}${path}`, {
          headers: { 'User-Agent': 'Googlebot' },
        });
        assert.equal(response.status, 200, prefix + path);
        const html = await response.text();
        assert.ok(
          !html.includes('"digest":"'),
          prefix + path + ' server error',
        );
        const canonicals = links(html, 'canonical');
        assert.equal(canonicals.length, 1, prefix + path);
        assert.equal(
          attribute(canonicals[0], 'href'),
          `${origin}${prefix}${path}`,
        );
        const alternates = links(html, 'alternate').filter((tag) =>
          attribute(tag, 'hreflang'),
        );
        assert.equal(alternates.length, 9, prefix + path);
        assert.ok(
          alternates.some((tag) => attribute(tag, 'hreflang') === 'de'),
        );
        assert.ok(
          alternates.every((tag) => attribute(tag, 'hreflang') !== 'ge'),
        );
        assert.ok(metadata(html, 'description')[0]?.length > 20);
        assert.ok(metadata(html, 'og:image')[0]?.startsWith('https://'));
        assert.ok(
          metadata(html, 'twitter:card').includes('summary_large_image'),
        );
        assert.ok(
          metadata(html, 'robots').every((value) => !value.includes('noindex')),
        );
        assert.equal((html.match(/<h1\b/g) || []).length, 1, prefix + path);
        const graphs = [
          ...html.matchAll(
            /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
          ),
        ].map((match) => JSON.parse(match[1]));
        const entities = graphs.flatMap((graph) => graph['@graph'] || [graph]);
        assert.ok(entities.some((node) => node['@type'] === 'Organization'));
        assert.ok(entities.some((node) => node['@type'] === 'WebSite'));
        if (path.includes('/tours/3-day'))
          assert.ok(entities.some((node) => node['@type'] === 'TouristTrip'));
        if (path.includes('/blog/horse'))
          assert.ok(entities.some((node) => node['@type'] === 'BlogPosting'));
        assert.ok(html.includes(`lang="${locale === 'ge' ? 'de' : locale}"`));
        checked++;
      }),
    );
  }
  for (const [path, destination] of [
    ['/en/', '/'],
    ['/journal/', '/blog/'],
    ['/departures/', '/open-tours/'],
    ['/plan/', '/booking/'],
    [
      '/ru/journal/your-first-horse-trek/',
      '/ru/blog/horse-trekking-kyrgyzstan/',
    ],
    ['/tours/song-kul-escape/', '/tours/3-day-song-kul-lake-ride/'],
  ]) {
    const response = await fetch(base + path + '?utm_source=seo-check', {
      redirect: 'manual',
    });
    assert.equal(response.status, 308, path);
    const url = new URL(response.headers.get('location'), base);
    assert.equal(url.pathname, destination);
    assert.equal(url.searchParams.get('utm_source'), 'seo-check');
  }
  for (const path of [
    '/reserve/3-day-song-kul-lake-ride/',
    '/ru/reserve/3-day-song-kul-lake-ride/',
    '/success/',
    '/ru/reserve-success/',
    '/admin/login/',
  ]) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200, path);
    assert.ok(response.headers.get('x-robots-tag')?.includes('noindex'), path);
    const html = await response.text();
    assert.ok(
      metadata(html, 'robots').some((value) => value.includes('noindex')),
      path,
    );
    assert.equal(links(html, 'canonical').length, 0, path);
  }
  const missing = await fetch(`${base}/tours/this-tour-does-not-exist/`, {
    headers: { 'User-Agent': 'Googlebot' },
  });
  assert.equal(missing.status, 404);
  assert.ok((await missing.text()).includes('noindex'));
  const image = await fetch(
    `${base}/_next/image/?url=%2Fimages%2Fhero.jpg&w=640&q=75`,
    { headers: { Accept: 'image/avif,image/webp' } },
  );
  assert.equal(image.status, 200);
  assert.ok(/image\/(avif|webp)/.test(image.headers.get('content-type')));
  console.log(
    `${checked} rendered pages across eight languages, ${urls.length} sitemap URLs, redirects, private pages, 404 and image optimization passed.`,
  );
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

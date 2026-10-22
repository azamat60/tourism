const assert = require('node:assert/strict');
const base = process.env.SITE_URL || 'http://localhost:3001';
const tours = require('../lib/mocks/tours.mock.json');
const locales = ['en', 'es', 'fr', 'it', 'ge', 'ru', 'zh', 'ar'];
(async () => {
  let count = 0;
  for (const locale of locales) {
    const prefix = locale === 'en' ? '' : `/${locale}`;
    for (const path of ['', '/tours/', '/faq/', '/booking/', '/about/', '/proposals/', '/open-tours/', '/blog/']) {
      const response = await fetch(base + prefix + path);
      assert.equal(response.status, 200, prefix + path);
      const html = await response.text();
      assert.ok(!html.includes('"digest":"'), prefix + path + ' server error');
      if (path === '/tours/') assert.ok(html.includes(tours[0].slug), 'Missing imported tour');
      count++;
    }
  }
  for (const path of tours
    .map((t) => `/tours/${t.slug}/`)
    .concat(['/blog/horse-trekking-kyrgyzstan/', '/reserve/3-day-song-kul-lake-ride/', '/admin/login/'])) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200, path);
    count++;
  }
  for (const path of ['/api/admin/content/', '/api/admin/operations/', '/api/admin/media/']) {
    const response = await fetch(base + path);
    assert.equal(response.status, 401, path);
  }
  const admin = await fetch(base + '/admin/', { redirect: 'manual' });
  assert.equal(admin.status, 307);
  assert.equal(new URL(admin.headers.get('location'), base).pathname, '/admin/login/');
  const receipt = await fetch(base + '/api/receipts/00000000-0000-4000-8000-000000000001/');
  assert.equal(receipt.status, 404);
  const invalid = await fetch(base + '/api/inquiries/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'invalid' }),
  });
  assert.equal(invalid.status, 400);
  const csrf = await fetch(base + '/api/inquiries/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: 'https://foreign.invalid' },
    body: '{}',
  });
  assert.equal(csrf.status, 403);
  console.log(`${count} server pages, admin protection, private receipt, validation and origin checks passed.`);
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

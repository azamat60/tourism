const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => {
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText;
  module._compile(code, filename);
};
const data = require('../lib/mock-data.ts');
const checkout = require('../lib/checkout.ts');
const service = require('../lib/mock-service.ts');
const snapshot = require('../lib/mocks/source.mock.json');
const faq = require('../lib/mocks/faq.mock.json');
const assets = require('../lib/mocks/assets.mock.json');
const now = new Date('2026-10-20T06:00:00Z');

test('snapshot has every published tour, FAQ, article and local media file', () => {
  assert.equal(data.activeTours.length, 11);
  assert.equal(faq.length, 13);
  assert.equal(data.blogPosts.length, 3);
  assert.equal(data.publicDepartures.length, 7);
  assert.equal(new Set(data.activeTours.map((tour) => tour.slug)).size, 11);
  for (const local of Object.values(assets)) {
    const filename = path.resolve(__dirname, '../public' + local);
    assert.ok(fs.existsSync(filename), `Missing ${filename}`);
    assert.ok(fs.statSync(filename).size > 100, `Empty ${filename}`);
  }
  for (const tour of data.activeTours) {
    assert.ok(tour.title && tour.description && tour.blurb && tour.image);
    assert.ok(!('defaultCompanySplit' in tour));
    assert.ok(!('defaultShergazySplit' in tour));
    assert.equal(data.itineraryFor(tour).length, data.durationDays(tour), tour.slug);
    assert.ok(!data.normalizedDescription(tour.description).includes('\\n'));
  }
});

test('date validation, season boundaries, timezone and booking cutoff', () => {
  assert.equal(data.validDate('2026-02-30'), false);
  assert.equal(data.validDate('2028-02-29'), true);
  assert.equal(data.validDate('2026-2-01'), false);
  assert.equal(data.shiftDate('2026-12-31', 1), '2027-01-01');
  assert.equal(data.dayKey(new Date('2026-10-19T20:00:00Z')), '2026-10-20');
  assert.equal(data.openDepartures(now).length, 5);
  const tour = data.getTour('3-day-song-kul-lake-ride');
  const departures = data.departuresFor(tour, now);
  assert.ok(!departures.some((item) => item.start === '2026-10-21'));
  assert.ok(departures.some((item) => item.start === '2026-10-23'));
  assert.ok(!departures.some((item) => item.start === '2027-03-31'));
  assert.equal(departures.filter((item) => item.start === '2026-11-13').length, 1);
  assert.equal(departures.find((item) => item.start === '2026-11-13').booked, 1);
  const sample = { ...tour, manualJoinableDates: ['2026-10-21', '2026-12-28'], seasonEnd: '12-28' };
  assert.equal(data.departuresFor(sample, now).some((item) => item.manual && item.start === '2026-12-28'), false);
  assert.equal(data.departuresFor({ ...sample, bookingCutoffDays: 1 }, now).some((item) => item.start === '2026-10-21'), true);
});

test('multiple live departures on same date remain distinct', () => {
  const source = data.publicDepartures.find((item) => item.id === 'dep_3-day-song-kul-lake-ride_2026-11-13');
  data.publicDepartures.push({ ...source, id: 'test-distinct-departure' });
  try { assert.equal(data.departuresFor(data.getTour('3-day-song-kul-lake-ride'), now).filter((item) => item.start === '2026-11-13').length, 2); }
  finally { data.publicDepartures.pop(); }
});

test('group pricing, solo price, tiers, per-day extras and deposit rules', () => {
  const tour = data.getTour('3-day-song-kul-lake-ride');
  assert.equal(data.startingPrice(tour), 310);
  assert.equal(data.tierValue(tour.pricesEnglish, 1), 590);
  assert.equal(data.tierValue(tour.pricesEnglish, 7), 310);
  assert.equal(data.tierValue({}, 2), null);
  const departure = data.departuresFor(tour, now).find((item) => item.start === '2026-11-13');
  const cost = data.quote(tour, departure, [['Helmet Rental'], []], ['Airport Pickup']);
  assert.equal(cost.totalPeople, 3);
  assert.equal(cost.perPerson, 320);
  assert.equal(cost.extras, 35);
  assert.equal(cost.subtotal, 675);
  assert.equal(cost.deposit, 50);
  assert.equal(cost.remaining, 625);
  assert.equal(data.quote(tour, { ...departure, customDeposit: 40 }, [[], []], []).deposit, 80);
  const shared = { ...tour, optionalAddOns: [{ name: 'Shared transfer', cost: 10, description: '', scope: 'group', chargeMode: 'perPerson' }] };
  assert.equal(data.quote(shared, departure, [[], []], ['Shared transfer']).extras, 20);
});

test('aliases resolve to original source content', () => {
  assert.equal(data.getTour('song-kul-escape').slug, '3-day-song-kul-lake-ride');
  assert.equal(data.getTour('unknown-tour'), undefined);
});

test('traveler validation includes strict DOB, guardian, consent and emergency rules', () => {
  assert.equal(checkout.ageOnDate('2026-02-30', '2026-10-20'), null);
  assert.equal(checkout.ageOnDate('2010-10-21', '2026-10-20'), 15);
  const traveler = { ...checkout.emptyTraveler(), firstName: 'Test', lastName: 'Traveler', nationality: 'US',
    email: 'traveler@example.net', phone: '2025550195', dob: '1990-01-01',
    emergencyName: 'Test Contact', emergencyEmail: 'contact@example.net', emergencyPhone: '2025550137',
    addressLine: 'Example Street', city: 'Example City', postal: '10001', addressCountry: 'US',
    initials: 'TT', initialed: checkout.waiverClauses.map((clause) => clause.key), mediaConsent: 'no', signature: 'mock-signature',
  };
  assert.equal(checkout.travelerError(traveler, 0, [traveler], '2026-10-20'), '');
  assert.match(checkout.travelerError({ ...traveler, emergencyName: 'Test Traveler' }, 0, [traveler], '2026-10-20'), /not traveling/);
  assert.match(checkout.travelerError({ ...traveler, dob: '2010-01-01' }, 0, [traveler], '2026-10-20'), /guardian/);
  assert.match(checkout.travelerError({ ...traveler, signature: '' }, 0, [traveler], '2026-10-20'), /sign the waiver/);
  assert.match(checkout.travelerError({ ...traveler, mediaConsent: '' }, 0, [traveler], '2026-10-20'), /photography/);
});

test('local reservations enforce capacity and idempotency without production calls', () => {
  const values = new Map();
  global.sessionStorage = { getItem: (key) => values.get(key) || null, setItem: (key, value) => values.set(key, value), removeItem: (key) => values.delete(key) };
  const tour = data.getTour('3-day-song-kul-lake-ride');
  const departure = data.departuresFor(tour, now).find((item) => item.start === '2026-11-13');
  const input = { id: 'test-reservation', tour, departure, travelerExtras: [[], []], groupExtras: [], currency: 'USD', form: { travelers: [checkout.emptyTraveler(), checkout.emptyTraveler()], specialRequests: 'Test request', howHeard: 'google', howHeardOther: '', joinGroupId: '' } };
  const receipt = service.reserveLocally(input);
  assert.equal(receipt.status, 'simulated');
  assert.deepEqual(service.reserveLocally(input), receipt);
  assert.equal(service.simulatedSeats(departure.id), 2);
  assert.throws(() => service.reserveLocally({ ...input, id: 'too-many', travelerExtras: [[], [], [], []] }), /Not enough spaces/);
  assert.ok(!JSON.stringify(receipt).includes('signature'));
  const saved = JSON.parse([...values.values()][0]);
  assert.equal(saved[0].form.specialRequests, 'Test request');
  assert.equal(saved[0].form.travelers.length, 2);
  assert.equal(saved[0].waiverVersion, '2026-07-01');
  const second = service.reserveLocally({ ...input, id: 'cad-reservation', currency: 'CAD', travelerExtras: [[]] });
  assert.equal(second.quote.totalPeople, 4);
  assert.equal(second.chargeAmount, 33.75);
  delete global.sessionStorage;
});

test('every source sitemap URL and reserve URL has exported HTML', () => {
  for (const route of [...snapshot.routes, ...data.activeTours.map((tour) => `/reserve/${tour.slug}`), '/success', '/reserve-success']) {
    const filename = path.resolve(__dirname, '../out', route.replace(/^\//, ''), 'index.html');
    assert.ok(fs.existsSync(filename), `Missing route ${route}`);
  }
});

function renderedText(filename) {
  return fs.readFileSync(filename, 'utf8').replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
}

test('all rendered tour programs and article bodies preserve source content', () => {
  const normalize = (value) => value.replace(/\s+/g, ' ').trim();
  for (const tour of data.activeTours) {
    const html = renderedText(path.resolve(__dirname, '../out/tours', tour.slug, 'index.html'));
    const expected = [tour.title, tour.blurb, data.introduction(tour), ...(tour.inclusions || []), ...(tour.exclusions || [])];
    data.itineraryFor(tour).forEach((day) => expected.push(day.title, ...day.notes.split('\n').filter(Boolean)));
    for (const value of expected) assert.ok(html.includes(normalize(value)), `${tour.slug}: missing ${value.slice(0, 90)}`);
  }
  for (const post of data.blogPosts) {
    const html = renderedText(path.resolve(__dirname, '../out/blog', post.slug, 'index.html'));
    const lines = post.content.split('\n').map((line) => line.replace(/^#{1,6}\s+|^-\s+|^>\s+/g, '').replace(/\*\*/g, '').trim()).filter((line) => line && line !== '---');
    for (const line of lines) assert.ok(html.includes(normalize(line)), `${post.slug}: missing ${line.slice(0, 90)}`);
  }
});

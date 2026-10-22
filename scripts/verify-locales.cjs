const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const ts = require('typescript');

require.extensions['.ts'] = (module, filename) => {
  const result = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2020 },
  });
  module._compile(result.outputText, filename);
};
const { locales } = require('../lib/content.ts');
const { translate, countryName, formatCount } = require('../lib/i18n.ts');
const source = require('../lib/translations/source.json');
const placeholders = (value) => (value.match(/\{\d+\}/g) || []).sort();

for (const locale of locales.filter((value) => value !== 'en')) {
  test(`${locale}: complete local dictionary and interpolation placeholders`, () => {
    const dictionary = require(`../lib/translations/${locale}.json`);
    assert.equal(dictionary.length, source.length);
    dictionary.forEach((text, index) => {
      assert.ok(typeof text === 'string' && text.trim(), `${locale}[${index}]: ${source[index]}`);
      assert.deepEqual(placeholders(text), placeholders(source[index]), `${locale}[${index}]: placeholders`);
      assert.equal((text.match(/\n/g) || []).length, (source[index].match(/\n/g) || []).length, `${locale}[${index}]: paragraph boundaries`);
      assert.equal((text.match(/\\n/g) || []).length, (source[index].match(/\\n/g) || []).length, `${locale}[${index}]: legacy line breaks`);
      if (source[index].length > 100 && /[A-Za-z]{3} [A-Za-z]{3}/.test(source[index])) {
        assert.notEqual(text, source[index], `${locale}[${index}]: English prose fallback`);
      }
    });
    for (const label of ['Book Now', 'Clear filters', 'Send Message', 'Your name', 'Tour photos', 'Reset view']) {
      assert.notEqual(translate(locale, label), label, `${locale}: untranslated ${label}`);
    }
    assert.notEqual(translate(locale, 'Traveler 2 signature'), 'Traveler 2 signature');
    assert.match(translate(locale, 'Traveler 2 signature'), /2/);
    assert.notEqual(translate(locale, 'View all 12 photos'), 'View all 12 photos');
    assert.match(translate(locale, 'View all 12 photos'), /12/);
    assert.equal(translate(locale, 'custom-private-tour'), 'custom-private-tour');
    assert.equal(translate(locale, 310), 310);
    assert.equal(translate(locale, undefined), undefined);
    assert.equal(translate(locale, 'user-input@example.net'), 'user-input@example.net');
  });


}

test('English source, currency, canonical records and locale country names stay intact', () => {
  assert.equal(translate('en', 'Book Now'), 'Book Now');
  assert.equal(translate('ru', 'USD'), 'USD');
  assert.equal(countryName('ru', 'KG', 'Kyrgyzstan'), 'Киргизия');
  assert.equal(countryName('ge', 'DE', 'Germany'), 'Deutschland');
  const tours = require('../lib/mocks/tours.mock.json');
  assert.ok(tours.every((tour) => /^[a-z0-9-]+$/.test(tour.slug)));
});

test('count labels use language plural rules', () => {
  assert.equal(formatCount('ru', 1, 'tour'), '1 тур');
  assert.equal(formatCount('ru', 4, 'day'), '4 дня');
  assert.equal(formatCount('ru', 11, 'destination'), '11 мест');
  assert.equal(formatCount('fr', 2, 'day'), '2 jours');
  assert.equal(formatCount('ge', 1, 'photo'), '1 Foto');
});

test('compound itinerary facts translate templates inside separators', () => {
  const facts = translate('ru', '5 hours · Highest: 3200 m');
  assert.ok(!facts.includes('hours') && !facts.includes('Highest'));
  assert.match(facts, /5/);
  assert.match(facts, /3200/);
});

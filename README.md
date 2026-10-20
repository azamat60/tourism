# Nomad Discovery Tours

Next.js static website using a local snapshot of the public content at https://ecovalleytours.com/.
The source content is presented under the Nomad Discovery Tours brand; this work focuses on content, routes, and public interactions.

## Run and verify

```bash
npm install
npm run dev
npm run lint
npx tsc --noEmit
npm run build
npm test
```

`npm run build` exports the website into `out/`. Run `npm test` after building: it also checks exported routes.
No backend, Firebase account, or payment credentials are needed.

## Where to edit content

All source records are in `lib/mocks/`:

- `tours.mock.json`: all 11 active public tours, exact source titles/slugs, full descriptions, structured or legacy itineraries, season boundaries, manually scheduled dates, price tiers, deposits, optional extras, inclusions, exclusions, photos and captions.
- `departures.mock.json`: 7 sanitized active public departure records. Started departures remain in the snapshot but are hidden by date at runtime.
- `blog.mock.json`: all 3 complete original Markdown articles.
- `faq.mock.json`: all 13 original questions, answers, and packing-list items.
- `pages.mock.json`: original home, about, guides, testimonials, proposal settings/story/ideas/FAQs, booking, FAQ, and blog copy.
- `tour-page.mock.json`: tour-page explanations and shared content.
- `checkout.mock.json`: original waiver version, all ten clauses and subclauses, and gender options.
- `countries.mock.json`: original country and dialing-code dataset.
- `site.mock.ts`: contacts, navigation, home video, booking steps, and original policies.
- `assets.mock.json`: original URL to local file mapping. Photos and the original preparation PDF are saved in `public/`. The home banner uses a Kyrgyzstan horse-riding video by JishinnRaJ, embedded from YouTube; map tiles load from OpenStreetMap, with muted styling and accessible destination markers.
- `services.mock.json`: explicit local service fixtures, illustrative CAD rate, and empty friend-group fixtures.
- `source.mock.json`: origin, capture time, route inventory, counts, and exclusions.

Add or edit records directly. Preserve unique `slug` and `id` values. For new assets, put the file in `public/images/` and use `/images/filename.webp`. The `asset()` helper also resolves the original source URLs to local copies.

`tours.mock.json` intentionally retains source strings, numeric strings, legacy escaped line breaks, spelling, and capitalization. Normalization belongs in `lib/mock-data.ts`; source records remain editable without rewriting original content. Structured itinerary days take precedence over legacy description days.

Public pages, tour descriptions, itineraries, articles, FAQs, forms, validation and map controls use local translation dictionaries in `lib/translations/` for English, Spanish, French, Italian, German (`ge`, retained for route compatibility), Russian, Simplified Chinese and Arabic. Source records and submitted form values stay canonical. Language changes preserve query parameters and anchors. Arabic pages use RTL; dates and country names use locale-aware browser formatting. Translation resources are indexed against `source.json`; keep array order and placeholders aligned when editing.

## Pages and behavior

Original public routes are available: `/`, `/tours/`, `/tours/[slug]/`, `/open-tours/`, `/proposals/`, `/about/`, `/booking/`, `/faq/`, `/blog/`, `/blog/[slug]/`, `/reserve/[slug]/`, `/success/`, and `/reserve-success/`.

Existing `/departures/`, `/journal/`, `/plan/`, three old tour slugs, and three old article slugs remain working aliases. `/plan/` opens the original inquiry flow.

Implemented behavior includes catalog filters/sorting and location map; captioned photo galleries with keyboard/swipe navigation; complete day programs; optional route/altitude views when coordinates/altitudes exist; group dates, capacity, month calendar and filters; tour/date inquiry prefilling; proposal setting selection and inquiry; checkout travelers, per-person/group/day extras, tier prices, deposits, CAD display, waiver/media consent, drawn signatures, guardian fields, policies, saved drafts, confirmation, receipt, and print.

Availability follows the source rules: Bishkek timezone; started tours hidden; source season boundaries checked for both start and end; default two-day cutoff for empty scheduled dates and one-day cutoff for occupied departures; positive per-tour cutoff overrides both. Live departures replace manual templates on the same date without merging distinct live groups.

## Local service boundary

`lib/mock-service.ts` handles inquiries and reservations entirely in browser `sessionStorage`. Checkout drafts save after 400 ms. A successful demo reservation clears its draft and retains the entered traveler form and waiver version only in that browser session. Receipts omit personal traveler data. Closing the browser session clears local records.

Payment is simulated. No card details are requested, no Stripe requests are made, and no message reaches Nomad Discovery Tours. The local reservation service checks capacity and reuses reservation IDs to prevent duplicate reservations. The CAD rate is an illustrative fixture, not a live exchange rate.

The private `getJoinableGroups` service is unavailable; its fixture is empty. To test joining friends, add records to `services.mock.json`:

```json
{
  "groupId": "local-demo-party",
  "label": "Demo party",
  "size": 2,
  "spotsLeft": 3,
  "departureId": "dep_3-day-song-kul-lake-ride_2026-11-13",
  "includedGroupAddOns": ["Airport Pickup"]
}
```

Only public content was imported. Customer identities, contacts, passports, private reservations, admin functions, internal commission splits, and production credentials were excluded. Future server integration can replace `lib/mock-service.ts` and the data imports without embedding network requests in page components.

Source wording contains inconsistencies, deliberately preserved: passport timing is “at booking” on tour pages, “at least 2 weeks” at checkout, and “beforehand” in policies. Public records and manually scheduled dates may also disagree about the advertised season; existing occupied departures follow the source's live-departure rules. Review those business rules before enabling a real backend.

Homepage curation: Custom Private Tour remains in the catalog and is excluded from featured tours. Testimonials and blog promotion are temporarily hidden by `site.visibility`; the underlying data and article routes remain available. Public contacts currently use WhatsApp +996 559 773283; source-company email and Instagram are not advertised.

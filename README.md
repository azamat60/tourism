# Nomad Discovery Tours

Next.js 16 website and staff admin backed by Supabase Postgres, Auth and Storage.
Public routes and existing tour/article aliases are preserved across eight languages.

## Run

```bash
npm install
cp .env.example .env.local
# Fill in the Supabase project URL and publishable key.
npm run dev -- --port 3001
```

The current workspace is configured for the `tourism` Supabase project.
Open `http://localhost:3001/admin/login/`. Port 3000 may be occupied by another local project.

The app needs a Next.js server. It no longer exports static HTML to `out/`.
For production, set both variables from `.env.example`, run `npm run build`, then `npm start`.
Configure the production Site URL and exact `/auth/callback/` URL in Supabase Authentication → URL Configuration.
The local Supabase Site URL is `http://localhost:3001`; its allowed callback is `http://localhost:3001/auth/callback/`.
Never put a secret or service-role key in a `NEXT_PUBLIC_` variable. This app uses only a publishable key and RLS-protected operations.

## Admin

At first login, choose **Первый вход**, create an account with the assigned email, and confirm the Supabase email.
The first administrator is `aza.alt.com@gmail.com`. The password is set by the account owner.
Creating an arbitrary account does not grant staff access.

- **Overview:** published tours, upcoming departures, new inquiries and pending bookings.
- **Content:** tours, itineraries, prices, extras, departure dates/capacity, articles, FAQs, pages and site settings.
- **Publication:** create drafts; publish or archive content. Core pages/settings stay published because public layouts require them.
- **Languages:** translations are stored alongside their record. Content edits preserve the translated fields; UI dictionaries remain in `lib/translations/`.
- **Operations:** contact details, inquiry statuses, traveler information, signed waiver version, booking notes and manual deposit status.
- **Media:** upload JPG/PNG/WebP/PDF up to 10 MB to the `tourism-media` bucket, then paste the returned URL into an image/document field.
- **Conflicts:** saves compare record versions. Reload before retrying if another employee changed the record.

Roles are checked on the server and in Postgres: `admin` accesses everything, `editor` manages public content/media, and `manager` handles inquiries/bookings.
Staff assignments live in `tourism_private.staff`; registration invitations live in `tourism_private.invites`.
Only an authorized database administrator can change these assignments. Roles never come from user-editable metadata.
To invite another staff member, add their lowercase email and role to `tourism_private.invites` through the Supabase SQL editor, then have them register and confirm their email.

## Data and booking behavior

`lib/site-data.ts` loads published content directly from Supabase on server requests. Database failures are visible; there is no silent fixture fallback.
`lib/catalog.ts` owns shared price, date and availability calculations; page components consume a request-scoped data provider.
New tours and articles become accessible without a rebuild. Existing slugs are kept stable.

The initial import contains 11 tours, 324 departures (including materialized schedule templates), 13 FAQs, 3 articles, 7 pages and 5 settings documents.
The import preserves the original public content; it does not invent customer identities or historical booking records.
Initial photos/PDFs still ship in `public/`; newly uploaded media lives in Supabase Storage.

Inquiries and submitted reservations are stored in Postgres. Only unfinished checkout drafts stay in browser `sessionStorage`.
Reservation creation locks departure inventory and calculates prices/extras/deposits inside a transaction.
A changed total requires review, duplicate submissions reuse their reservation, and cancellation releases seats exactly once.
Cancelled bookings cannot be reopened; create a new booking instead.
Availability uses `Asia/Bishkek` and each tour's booking cutoff. Manage actual departure rows in admin; legacy date templates no longer recreate archived departures.

Reservations start as `pending`. No card is collected or charged. Employees arrange the deposit and update payment status manually.
Only USD is offered; the old illustrative CAD exchange rate and mock friend groups are no longer used.
Public receipts omit traveler details and require an unguessable token stored in an HttpOnly cookie.
Submitted traveler/waiver data is restricted to administrators and managers. Do not upload personal documents to the public media bucket.

## Migrations and importing fixtures

SQL migrations are tracked in `supabase/migrations/` and were applied to the `tourism` project.
Every exposed table has RLS and explicit grants. Private helpers handle constrained public inquiry/reservation operations.
`lib/supabase/database.types.ts` contains generated database types.

`lib/mocks/` is retained only as the original import archive, type references and regression fixtures. Editing these files does not change the live site.
To generate an idempotent initial import for another empty project:

```bash
node scripts/seed-supabase.cjs /tmp/tourism-seed.sql
```

Apply the generated SQL using an authorized Supabase database connection after applying migrations.
It uses `ON CONFLICT DO NOTHING`, so rerunning it preserves existing edits. Never use it to overwrite production content.
For large imports, split the generated rows into bounded batches to stay within your SQL client's request/output limits.

Rollback: keep a database backup before schema changes. The original fixtures remain available for content recovery; they do not include submitted customer data.
Restoring the previous static application requires restoring its previous Git revision and redeploying it. Do not drop the Supabase tables as part of an application rollback.

## Verify

```bash
npm run lint
npx tsc --noEmit
npm test
npm run build
npm run start -- --port 3001
npm run test:server
```

`npm test` covers source preservation, pricing, dates, aliases, traveler validation and locale dictionaries.
`npm run test:server` checks live server routes in every locale, protected admin endpoints, private receipts, input validation and request origins.
Set `SITE_URL` to target a different running server.

Run `scripts/verify-supabase.sql` in the Supabase SQL editor or an authorized SQL client.
It verifies server pricing, required policies, idempotency, capacity, cancellation, receipt tokens and anonymous/nonstaff access.
All its test data is inside a transaction that ends with `ROLLBACK`.

## SEO

Production canonical origin is `https://nomaddiscoverytours.com`; override it with `NEXT_PUBLIC_SITE_URL`.
Set `SEO_INDEXING_ENABLED=false` on staging. Vercel preview deployments are automatically noindex.
Optional `GOOGLE_SITE_VERIFICATION` and `YANDEX_SITE_VERIFICATION` values add verification tags.
See [SEO setup, keyword targets and launch steps](docs/SEO.md).
Run `npm run test:seo` against a running server (`SITE_URL=http://localhost:3002` to change its address).

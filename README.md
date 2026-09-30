# Nomad Discovery Tours

Multilingual Kyrgyzstan travel website built with Next.js and exported as static pages.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Run `npm run build` to export static pages into `out/`.

## Pages

- `/tours/` — tour catalog with destination, duration, and sort controls.
- `/tours/[slug]/` — itinerary, practical information, and sample departures.
- `/departures/` — sample departure calendar, filters, and dates.
- `/plan/` — route planner.
- `/booking/` — enquiry form that prepares a WhatsApp message. No payment or confirmed reservation happens on the website.
- `/about/`, `/faq/`, `/journal/`, `/journal/[slug]/` — company information, answers, and travel stories.

Every page is available in English, Spanish, French, Italian, German (`/ge/`), Russian, Chinese, and Arabic.

**Before using the site for real bookings:** replace the demonstration dates, prices, and places in `lib/departures.ts`, confirm tour details, and review localized copy in `lib/expandedCopy.ts` and `lib/journal.ts`. The WhatsApp number is in `lib/links.ts`. No business email is published yet.

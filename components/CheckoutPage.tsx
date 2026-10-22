'use client';

import { useCatalog, useTranslation } from './SiteData';



import { useEffect, useState, type FormEvent } from 'react';
import SiteChrome, { localeHref } from './SiteChrome';
import { PageHero } from './ContentBlocks';
import TravelerFields from './TravelerFields';
import { content, type Locale } from '@/lib/content';
import { formatDate, quote, addOnPrice } from '@/lib/catalog';
import { emptyTraveler, type Traveler } from '@/lib/checkout';
import { useBishkekDay, useBrowserQuery } from '@/lib/browser-state';
import { reserve } from '@/lib/booking-service';


import type { Departure, Tour } from '@/lib/types';

type Draft = { travelers: Traveler[]; groupExtras: string[]; specialRequests: string; howHeard: string; howHeardOther: string; policies: string[]; id: string; token: string };
function readDraft(key: string): Partial<Draft> {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(sessionStorage.getItem(key) || '{}'); } catch { return {}; }
}

export default function CheckoutPage({ locale, slug }: { locale: Locale; slug: string }) {
  const { departuresFor, getTour } = useCatalog();
  const t = useTranslation();

  const params = useBrowserQuery();
  const today = useBishkekDay();
  const tour = getTour(slug)!;
  const dates = departuresFor(tour, new Date(`${today}T12:00:00Z`));
  const date = params.get('date') || params.get('startDateKey') || '';
  const bookingId = params.get('bookingId');
  const departure = dates.find((item) => (bookingId ? item.id === bookingId : true) && (date ? item.start === date : Boolean(bookingId)));
  return <SiteChrome locale={locale} copy={content[locale]} path={`/reserve/${tour.slug}/`}>
    <PageHero locale={locale} label={t(locale, "Reserve your adventure")} title={t(locale, tour.title)} description={t(locale, departure ? `${formatDate(departure.start, locale)} – ${formatDate(departure.end, locale)}` : 'Choose a departure date to continue.')} />
    {departure ? <CheckoutForm key={departure.id} tour={tour} departure={departure} locale={locale} today={today} /> : <section className="section-pad page-width"><p>{t(locale, date || bookingId ? 'This departure is unavailable or booking has closed. Please choose another date.' : 'Select a departure from the tour page.')}</p><a className="button button-dark" href={localeHref(locale, `/tours/${tour.slug}/#departure-dates`)}>{t(locale, "See available dates")}</a></section>}
  </SiteChrome>;
}

function CheckoutForm({ tour, departure, locale, today }: { tour: Tour; departure: Departure; locale: Locale; today: string }) {
  const { site, travelerError, bookingTermsVersion } = useCatalog();
  const t = useTranslation();

  const draftKey = `ecovalley:checkout:${departure.id}`;
  const [draft] = useState(() => readDraft(draftKey));
  const validExtraNames = (tour.optionalAddOns || []).map((item) => item.name);
  const [travelers, setTravelers] = useState<Traveler[]>(() => draft.travelers?.length ? draft.travelers.map((item) => ({ ...emptyTraveler(), ...item, extras: (item.extras || []).filter((name) => validExtraNames.includes(name)) })) : [emptyTraveler()]);
  const [groupExtras, setGroupExtras] = useState<string[]>(() => (draft.groupExtras || []).filter((name) => validExtraNames.includes(name)));
  const [specialRequests, setSpecialRequests] = useState(draft.specialRequests || '');
  const [howHeard, setHowHeard] = useState(draft.howHeard || '');
  const [howHeardOther, setHowHeardOther] = useState(draft.howHeardOther || '');
  const [policies, setPolicies] = useState<string[]>(draft.policies || []);
  const [id] = useState(() => draft.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : ''));
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const [review, setReview] = useState(false);
  const [token] = useState(() => draft.token || crypto.randomUUID());
  const total = quote(tour, { ...departure, booked: departure.booked }, travelers.map((traveler) => traveler.extras), groupExtras);
  const capacity = departure.capacity - departure.booked;
  const policyTexts = [...site.paymentPolicy, ...(tour.passportNeeded ? ['Scanned passports of each guest must be emailed beforehand for this tour. Failure to do so will result in tour cancellation or modification to a different itinerary.'] : []), 'I agree to the booking terms and confirm the traveler details above are correct.'];
  useEffect(() => {
    const timer = setTimeout(() => { try { sessionStorage.setItem(draftKey, JSON.stringify({ travelers, groupExtras, specialRequests, howHeard, howHeardOther, policies, id, token })); } catch { /* Storage can be unavailable in private browsing. */ } }, 400);
    return () => clearTimeout(timer);
  }, [draftKey, travelers, groupExtras, specialRequests, howHeard, howHeardOther, policies, id, token]);
  const update = (index: number, value: Traveler) => { setTravelers(travelers.map((item, current) => current === index ? value : item)); setReview(false); };
  const addTraveler = () => {
    const failure = travelers.map((traveler, index) => travelerError(traveler, index, travelers, today)).find(Boolean);
    if (failure) { setError(failure); return; }
    if (travelers.length >= capacity) { setError('This departure has no more spaces.'); return; }
    setTravelers([...travelers, emptyTraveler()]); setReview(false); setError('');
  };
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError('');
    const failure = travelers.map((traveler, index) => travelerError(traveler, index, travelers, today)).find(Boolean);
    if (failure) { setError(failure); return; }
    if (!policyTexts.every((_, index) => policies.includes(String(index)))) { setError('Please acknowledge every booking policy.'); return; }
    if (howHeard === 'other' && !howHeardOther.trim()) { setError('Please tell us how you heard about us.'); return; }
    if (travelers.length > departure.capacity - departure.booked) { setError('Not enough spaces remain. Please choose another departure.'); return; }
    if (!review) { setReview(true); return; }
    setPending(true);
    try {
      const receipt = await reserve({ id: id || crypto.randomUUID(), token, departureId: departure.id, groupExtras, policies, expectedTotal: total.subtotal, form: { travelers, specialRequests, howHeard, howHeardOther, joinGroupId: '', termsVersion: bookingTermsVersion } });
      sessionStorage.removeItem(draftKey);
      window.location.assign(localeHref(locale, `/reserve-success/?reservationId=${receipt.id}`));
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Reservation could not be saved. Please try again.'); setPending(false); }
  }
  return <section className="section-pad page-width"><div className="source-notice">{t(locale, site.mockNotice)}</div>{tour.passportNeeded && <p className="source-notice">{t(locale, "Scanned copies of your passports MUST be emailed or sent at least 2 weeks before a scheduled departure or there is a risk of cancellation.")}</p>}
    <form onSubmit={submit} className="source-checkout"><fieldset disabled={pending} className="source-checkout-fields"><section className="source-traveler"><h2>{t(locale, "Your group")}</h2><p>{t(locale, departure.booked)} {t(locale, " already booked · ")}{t(locale, capacity)} {t(locale, " spaces available")}</p></section>
      {travelers.map((traveler, index) => <TravelerFields locale={locale} key={index} traveler={traveler} index={index} lead={travelers[0]} today={today} tour={tour} contactRequired={index === 0} update={(next) => update(index, next)} remove={() => { setTravelers(travelers.filter((_, current) => current !== index)); setReview(false); }} />)}
      {travelers.length < capacity && <button type="button" className="source-action" onClick={addTraveler}>{t(locale, "+ Add traveler")}</button>}
      <section className="source-traveler"><h2>{t(locale, "Group add-ons")}</h2>{tour.optionalAddOns?.filter((item) => item.scope === 'group').map((item) => <label className="source-check" key={item.name}><input type="checkbox" checked={groupExtras.includes(item.name)} onChange={() => { setGroupExtras(groupExtras.includes(item.name) ? groupExtras.filter((name) => name !== item.name) : [...groupExtras, item.name]); setReview(false); }} /><span><strong>{t(locale, item.name)} · ${t(locale, addOnPrice(item, tour))} {t(locale, item.chargeMode === 'perPerson' ? 'per person' : 'per group')}</strong><small>{t(locale, item.description)}</small></span></label>)}<label className="source-search">{t(locale, "Special requests")}<textarea rows={3} value={specialRequests} onChange={(event) => setSpecialRequests(event.target.value)} /></label><label className="source-search">{t(locale, "How did you hear about us?")}<select value={howHeard} onChange={(event) => setHowHeard(event.target.value)}><option value="">{t(locale, "Select (optional)")}</option>{[['instagram', 'Instagram'], ['google', 'Google'], ['tripadvisor', 'TripAdvisor'], ['friend', 'A friend'], ['blog', 'A blog post'], ['other', 'Other']].map(([value, label]) => <option key={value} value={value}>{t(locale, label)}</option>)}</select></label>{howHeard === 'other' && <label className="source-search">{t(locale, "Please tell us")}<input value={howHeardOther} onChange={(event) => setHowHeardOther(event.target.value)} required /></label>}</section>
      <section className="source-traveler"><h2>{t(locale, "Policies")}</h2>{policyTexts.map((text, index) => <label className="source-check source-clause" key={text}><input type="checkbox" required checked={policies.includes(String(index))} onChange={() => setPolicies(policies.includes(String(index)) ? policies.filter((key) => key !== String(index)) : [...policies, String(index)])} />{t(locale, text)}</label>)}</section>
    </fieldset>
    <aside className="source-checkout-summary"><h2>{t(locale, "Your reservation")}</h2><h3>{t(locale, tour.title)}</h3><p>{t(locale, formatDate(departure.start, locale))} – {t(locale, formatDate(departure.end, locale))}</p><p>{t(locale, travelers.length)} {t(locale, " new travelers · ")}{t(locale, total.totalPeople)} {t(locale, " people in total")}</p><dl><div><dt>{t(locale, "Per person")}</dt><dd>${t(locale, total.perPerson.toFixed(2))}</dd></div><div><dt>{t(locale, "Tour subtotal")}</dt><dd>${t(locale, total.base.toFixed(2))}</dd></div><div><dt>{t(locale, "Add-ons")}</dt><dd>${t(locale, total.extras.toFixed(2))}</dd></div><div><dt>{t(locale, "Your total")}</dt><dd>${t(locale, total.subtotal.toFixed(2))}</dd></div><div><dt>{t(locale, "Deposit due after confirmation")}</dt><dd>${t(locale, total.deposit.toFixed(2))}</dd></div><div><dt>{t(locale, "Remaining on arrival")}</dt><dd>${t(locale, total.remaining.toFixed(2))}</dd></div></dl><p>{t(locale, "Currency: USD. Our team will arrange the deposit after confirmation.")}</p>
      <p className="source-note">{t(locale, site.mockNotice)}</p>{error && <p className="source-error" role="alert">{t(locale, error)}</p>}{review && <p className="source-notice" role="status">{t(locale, "Review the total and deposit above. Confirm to send your reservation request.")}</p>}<button type="submit" className="button button-dark" disabled={pending || capacity < 1}>{t(locale, pending ? 'Saving...' : review ? 'Confirm reservation request' : 'Review reservation')}</button><p>{t(locale, "Guest Preparation Guide")}</p><a href={site.preparationGuide} target="_blank" rel="noopener noreferrer">{t(locale, "Download PDF")}</a>
    </aside></form>
  </section>;
}

'use client';

import { translate as t } from '@/lib/i18n';

import { useEffect, useState, type FormEvent } from 'react';
import SiteChrome, { localeHref } from './SiteChrome';
import { PageHero } from './ContentBlocks';
import TravelerFields from './TravelerFields';
import { content, type Locale } from '@/lib/content';
import { departuresFor, formatDate, getTour, quote, addOnPrice } from '@/lib/mock-data';
import { emptyTraveler, travelerError, type Traveler } from '@/lib/checkout';
import { useBishkekDay, useBrowserQuery } from '@/lib/browser-state';
import { reserveLocally, simulatedSeats } from '@/lib/mock-service';
import { site } from '@/lib/mocks/site.mock';
import services from '@/lib/mocks/services.mock.json';
import type { Departure, Tour } from '@/lib/mock-types';

type MockGroup = { groupId: string; label: string; size: number; spotsLeft: number; departureId?: string; includedGroupAddOns?: string[] };
type Draft = { travelers: Traveler[]; groupExtras: string[]; specialRequests: string; howHeard: string; howHeardOther: string; policies: string[]; id: string };
function readDraft(key: string): Partial<Draft> {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(sessionStorage.getItem(key) || '{}'); } catch { return {}; }
}

export default function CheckoutPage({ locale, slug }: { locale: Locale; slug: string }) {
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
  const [joiningFriends, setJoiningFriends] = useState(false);
  const [joinGroupId, setJoinGroupId] = useState('');
  const groups = (services.joinableGroups as MockGroup[]).filter((group) => !group.departureId || group.departureId === departure.id);
  const joinGroup = joiningFriends ? groups.find((group) => group.groupId === joinGroupId) : undefined;
  const inheritedExtras = joinGroup?.includedGroupAddOns || [];
  const [localBooked] = useState(() => typeof window === 'undefined' ? 0 : simulatedSeats(departure.id));
  const [currencyChoice, setCurrencyChoice] = useState('');
  const currency = currencyChoice || (travelers[0].addressCountry === 'CA' ? 'CAD' : 'USD');
  const total = quote(tour, { ...departure, booked: departure.booked + localBooked }, travelers.map((traveler) => traveler.extras), groupExtras.filter((name) => !inheritedExtras.includes(name)));
  const capacity = Math.min(departure.capacity - departure.booked - localBooked, joinGroup?.spotsLeft ?? Infinity);
  const policyTexts = [...site.paymentPolicy, ...(tour.passportNeeded ? ['Scanned passports of each guest must be emailed beforehand for this tour. Failure to do so will result in tour cancellation or modification to a different itinerary.'] : []), 'I agree to the booking terms and confirm the traveler details above are correct.'];
  useEffect(() => {
    const timer = setTimeout(() => { try { sessionStorage.setItem(draftKey, JSON.stringify({ travelers, groupExtras, specialRequests, howHeard, howHeardOther, policies, id })); } catch { /* Storage can be unavailable in private browsing. */ } }, 400);
    return () => clearTimeout(timer);
  }, [draftKey, travelers, groupExtras, specialRequests, howHeard, howHeardOther, policies, id]);
  const update = (index: number, value: Traveler) => { setTravelers(travelers.map((item, current) => current === index ? value : item)); setReview(false); };
  const addTraveler = () => {
    const failure = travelers.map((traveler, index) => travelerError(traveler, index, travelers, today, joiningFriends)).find(Boolean);
    if (failure) { setError(failure); return; }
    if (travelers.length >= capacity) { setError('This departure has no more spaces.'); return; }
    setTravelers([...travelers, emptyTraveler()]); setReview(false); setError('');
  };
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError('');
    const failure = travelers.map((traveler, index) => travelerError(traveler, index, travelers, today, joiningFriends)).find(Boolean);
    if (failure) { setError(failure); return; }
    if (joiningFriends && !joinGroup) { setError('No joinable friend groups are configured in the local mock. Continue as a new party.'); return; }
    if (!policyTexts.every((_, index) => policies.includes(String(index)))) { setError('Please acknowledge every booking policy.'); return; }
    if (howHeard === 'other' && !howHeardOther.trim()) { setError('Please tell us how you heard about us.'); return; }
    if (travelers.length + simulatedSeats(departure.id) > departure.capacity - departure.booked) { setError('Not enough spaces remain. Please choose another departure.'); return; }
    if (!review) { setReview(true); return; }
    setPending(true);
    try {
      const receipt = reserveLocally({ id: id || crypto.randomUUID(), tour, departure, travelerExtras: travelers.map((traveler) => traveler.extras), groupExtras: groupExtras.filter((name) => !inheritedExtras.includes(name)), currency, form: { travelers, specialRequests, howHeard, howHeardOther, joinGroupId } });
      sessionStorage.removeItem(draftKey);
      window.location.assign(localeHref(locale, `/reserve-success/?reservationId=${receipt.id}`));
    } catch (failure) { setError(failure instanceof Error && failure.message.startsWith('Not enough spaces') ? 'Not enough spaces remain. Please choose another departure.' : 'Reservation could not be saved. Please try again.'); setPending(false); }
  }
  return <section className="section-pad page-width"><div className="source-notice">{t(locale, site.mockNotice)}</div>{tour.passportNeeded && <p className="source-notice">{t(locale, "Scanned copies of your passports MUST be emailed or sent at least 2 weeks before a scheduled departure or there is a risk of cancellation.")}</p>}
    <form onSubmit={submit} className="source-checkout"><fieldset disabled={pending} className="source-checkout-fields"><section className="source-traveler"><h2>{t(locale, "Your group")}</h2><p>{t(locale, departure.booked)} {t(locale, " already booked · ")}{t(locale, capacity)} {t(locale, " spaces available")}</p><label className="source-check"><input type="checkbox" checked={joiningFriends} onChange={(event) => { setJoiningFriends(event.target.checked); setReview(false); }} />{t(locale, "I’m joining friends who have already booked")}</label>{joiningFriends && (groups.length ? <label className="source-search">{t(locale, "Choose your friends’ group")}<select value={joinGroupId} onChange={(event) => { setJoinGroupId(event.target.value); setReview(false); }} required><option value="">{t(locale, "Select group")}</option>{groups.map((group) => <option key={group.groupId} value={group.groupId}>{t(locale, group.label)} · {t(locale, group.size)} {t(locale, " travelers · ")}{t(locale, group.spotsLeft)} {t(locale, " spaces")}</option>)}</select></label> : <p>{t(locale, "No friend groups are configured in this local snapshot.")}</p>)}</section>
      {travelers.map((traveler, index) => <TravelerFields locale={locale} key={index} traveler={traveler} index={index} lead={travelers[0]} today={today} tour={tour} contactRequired={index === 0 || joiningFriends} update={(next) => update(index, next)} remove={() => { setTravelers(travelers.filter((_, current) => current !== index)); setReview(false); }} />)}
      {travelers.length < capacity && <button type="button" className="source-action" onClick={addTraveler}>{t(locale, "+ Add traveler")}</button>}
      <section className="source-traveler"><h2>{t(locale, "Group add-ons")}</h2>{tour.optionalAddOns?.filter((item) => item.scope === 'group').map((item) => <label className="source-check" key={item.name}><input type="checkbox" checked={groupExtras.includes(item.name) || inheritedExtras.includes(item.name)} disabled={inheritedExtras.includes(item.name)} onChange={() => { setGroupExtras(groupExtras.includes(item.name) ? groupExtras.filter((name) => name !== item.name) : [...groupExtras, item.name]); setReview(false); }} /><span><strong>{t(locale, item.name)} · ${t(locale, addOnPrice(item, tour))} {t(locale, item.chargeMode === 'perPerson' ? 'per person' : 'per group')}</strong><small>{t(locale, inheritedExtras.includes(item.name) ? 'Included with your friends’ group · no extra charge' : item.description)}</small></span></label>)}<label className="source-search">{t(locale, "Special requests")}<textarea rows={3} value={specialRequests} onChange={(event) => setSpecialRequests(event.target.value)} /></label><label className="source-search">{t(locale, "How did you hear about us?")}<select value={howHeard} onChange={(event) => setHowHeard(event.target.value)}><option value="">{t(locale, "Select (optional)")}</option>{[['instagram', 'Instagram'], ['google', 'Google'], ['tripadvisor', 'TripAdvisor'], ['friend', 'A friend'], ['blog', 'A blog post'], ['other', 'Other']].map(([value, label]) => <option key={value} value={value}>{t(locale, label)}</option>)}</select></label>{howHeard === 'other' && <label className="source-search">{t(locale, "Please tell us")}<input value={howHeardOther} onChange={(event) => setHowHeardOther(event.target.value)} required /></label>}</section>
      <section className="source-traveler"><h2>{t(locale, "Policies")}</h2>{policyTexts.map((text, index) => <label className="source-check source-clause" key={text}><input type="checkbox" required checked={policies.includes(String(index))} onChange={() => setPolicies(policies.includes(String(index)) ? policies.filter((key) => key !== String(index)) : [...policies, String(index)])} />{t(locale, text)}</label>)}</section>
    </fieldset>
    <aside className="source-checkout-summary"><h2>{t(locale, "Your reservation")}</h2><h3>{t(locale, tour.title)}</h3><p>{t(locale, formatDate(departure.start, locale))} – {t(locale, formatDate(departure.end, locale))}</p><p>{t(locale, travelers.length)} {t(locale, " new travelers · ")}{t(locale, total.totalPeople)} {t(locale, " people in total")}</p><dl><div><dt>{t(locale, "Per person")}</dt><dd>${t(locale, total.perPerson.toFixed(2))}</dd></div><div><dt>{t(locale, "Tour subtotal")}</dt><dd>${t(locale, total.base.toFixed(2))}</dd></div><div><dt>{t(locale, "Add-ons")}</dt><dd>${t(locale, total.extras.toFixed(2))}</dd></div><div><dt>{t(locale, "Your total")}</dt><dd>${t(locale, total.subtotal.toFixed(2))}</dd></div><div><dt>{t(locale, "Deposit now")}</dt><dd>${t(locale, total.deposit.toFixed(2))}</dd></div><div><dt>{t(locale, "Remaining on arrival")}</dt><dd>${t(locale, total.remaining.toFixed(2))}</dd></div></dl><label className="source-search">{t(locale, "Deposit currency")}<select value={currency} onChange={(event) => { setCurrencyChoice(event.target.value); setReview(false); }}><option value="USD">{t(locale, "USD")}</option><option value="CAD">{t(locale, "CAD")}</option></select></label>{currency === 'CAD' && <p>{t(locale, "Demo deposit: CA$")}{t(locale, (total.deposit * services.usdToCadRate).toFixed(2))} · {t(locale, services.exchangeRateLabel)} ({t(locale, services.usdToCadRate)})</p>}
      <p className="source-note">{t(locale, site.mockNotice)}</p>{error && <p className="source-error" role="alert">{t(locale, error)}</p>}{review && <p className="source-notice" role="status">{t(locale, "Review the total and deposit above. Confirm to create a local demo reservation.")}</p>}<button type="submit" className="button button-dark" disabled={pending || capacity < 1}>{t(locale, pending ? 'Saving...' : review ? 'Confirm demo reservation' : 'Review reservation')}</button><p>{t(locale, "Guest Preparation Guide")}</p><a href={site.preparationGuide} target="_blank" rel="noopener noreferrer">{t(locale, "Download PDF")}</a>
    </aside></form>
  </section>;
}

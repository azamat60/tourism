'use client';

import { bookedCount, formatCount, translate as t } from '@/lib/i18n';

import { useState } from 'react';
import type { Locale } from '@/lib/content';
import type { Departure } from '@/lib/mock-types';
import { departuresFor, formatDate, getTour, openDepartures, shiftDate, tierValue } from '@/lib/mock-data';
import { useBishkekDay } from '@/lib/browser-state';
import { localeHref } from '@/lib/links';

function price(departure: Departure) { return tierValue(departure.prices, departure.booked + 1); }
function length(departure: Departure) { return Math.round((Date.parse(departure.end) - Date.parse(departure.start)) / 86400000) + 1; }
export function reservationHref(locale: Locale, departure: Departure) {
  const params = new URLSearchParams({ date: departure.start, bookingId: departure.id });
  return localeHref(locale, departure.slug ? `/reserve/${departure.slug}/?${params}` : `/booking/?${params}&tour=${encodeURIComponent(departure.title)}`);
}

function DepartureCard({ departure, locale, selected }: { departure: Departure; locale: Locale; selected: boolean }) {
  const full = departure.booked >= departure.capacity;
  const value = price(departure);
  const inquiry = localeHref(locale, `/booking/?tour=${departure.slug}&date=${departure.start}`);
  return <article className={`source-departure ${selected ? 'source-selected' : ''}`} id={`departure-${departure.id}`}>
    <div><p className="eyebrow dark">{t(locale, departure.manual ? 'Scheduled departure' : 'Group departure')}</p><h3>{t(locale, departure.title)}</h3><p>{t(locale, formatDate(departure.start, locale))} – {t(locale, formatDate(departure.end, locale))}</p><p>{t(locale, departure.locations.join(', '))} · {t(locale, length(departure))} {t(locale, " days")}</p>
      {departure.description && <details><summary>{t(locale, "Tour description")}</summary><p className="source-preline">{t(locale, departure.description)}</p></details>}
      <a href={localeHref(locale, `/tours/${departure.slug || 'custom-private-tour'}/`)}>{t(locale, "Tour info")}</a>
    </div>
    <div><strong>{full ? t(locale, 'Fully booked') : formatCount(locale, departure.capacity - departure.booked, 'space')}</strong><p>{bookedCount(locale, departure.booked, departure.capacity)}</p><p>{t(locale, value == null ? 'Contact us' : `$${value} per person`)}</p><a className="button button-dark" href={full ? inquiry : reservationHref(locale, departure)}>{t(locale, full ? 'Ask about this tour' : 'Join Tour')}</a></div>
  </article>;
}

function Calendar({ departures, today, selected, onSelect, locale }: { locale: Locale; departures: Departure[]; today: string; selected: string; onSelect: (id: string) => void }) {
  const [month, setMonth] = useState(today.slice(0, 7));
  const [expanded, setExpanded] = useState(true);
  const first = `${month}-01`;
  const date = new Date(`${first}T12:00:00Z`);
  const prefix = date.getUTCDay();
  const last = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
  const move = (amount: number) => {
    const next = new Date(`${first}T12:00:00Z`); next.setUTCMonth(next.getUTCMonth() + amount); setMonth(next.toISOString().slice(0, 7));
  };
  const events = departures.filter((item) => item.booked < item.capacity);
  return <div className="source-calendar-wrap"><div className="source-toolbar"><button onClick={() => move(-1)} aria-label={t(locale, "Previous month")}>←</button><h3>{t(locale, date.toLocaleDateString(locale === 'ge' ? 'de' : locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }))}</h3><button onClick={() => move(1)} aria-label={t(locale, "Next month")}>→</button><button onClick={() => setMonth(today.slice(0, 7))}>{t(locale, "Today")}</button><button onClick={() => setExpanded(!expanded)}>{t(locale, expanded ? 'Hide calendar' : 'Show calendar')}</button></div>
    {expanded && <><div className="source-calendar">{Array.from({ length: 7 }, (_, day) => <strong key={day}>{new Intl.DateTimeFormat(locale === 'ge' ? 'de' : locale, { weekday: 'short', timeZone: 'UTC' }).format(new Date(Date.UTC(2026, 0, 4 + day)))}</strong>)}{Array.from({ length: prefix + last }, (_, index) => {
      const current = index - prefix + 1;
      if (current < 1) return <div className="calendar-blank" key={index} />;
      const key = `${month}-${String(current).padStart(2, '0')}`;
      return <div key={key} className={key === today ? 'calendar-today' : ''}><span>{t(locale, current)}</span>{events.filter((event) => event.start <= key && event.end >= key).map((event) => <button key={event.id} className={selected === event.id ? 'selected' : ''} onClick={() => onSelect(event.id)} title={t(locale, `${event.title} — ${formatDate(event.start, locale)} — $${price(event)}`)} aria-label={t(locale, `${event.title}, ${key}, ${event.capacity - event.booked} spaces`)}><span className="calendar-event-title">{t(locale, event.title)}</span><span className="calendar-event-price" aria-hidden="true">{t(locale, price(event) == null ? 'View' : `$${price(event)}`)}</span></button>)}</div>;
    })}</div><p>{t(locale, "Choose a departure in the calendar to see its details.")}</p></>}
  </div>;
}

export default function DepartureExplorer({ locale, tourSlug }: { locale: Locale; tourSlug?: string }) {
  const today = useBishkekDay();
  const tour = tourSlug ? getTour(tourSlug) : undefined;
  const source = tour ? departuresFor(tour, new Date(`${today}T12:00:00Z`)) : openDepartures(new Date(`${today}T12:00:00Z`));
  const [tourFilter, setTourFilter] = useState('');
  const [days, setDays] = useState('');
  const [location, setLocation] = useState('');
  const [month, setMonth] = useState('');
  const [hideEmpty, setHideEmpty] = useState(false);
  const [hideFull, setHideFull] = useState(false);
  const [sort, setSort] = useState('date-asc');
  const [visible, setVisible] = useState(8);
  const [selected, setSelected] = useState('');
  const filtered = source.filter((item) => (!tourFilter || item.title === tourFilter) && (!days || length(item) === Number(days)) &&
    (!location || item.locations.includes(location)) && (!month || item.start.startsWith(month)) &&
    (!hideEmpty || item.booked > 0) && (!hideFull || item.booked < item.capacity)).sort((a, b) => {
    const difference = sort.startsWith('price') ? (price(a) ?? Infinity) - (price(b) ?? Infinity) : sort.startsWith('days') ? length(a) - length(b) : a.start.localeCompare(b.start);
    return sort.endsWith('desc') ? -difference : difference;
  });
  const reset = () => { setTourFilter(''); setDays(''); setLocation(''); setMonth(''); setHideEmpty(false); setHideFull(false); setSort('date-asc'); setVisible(8); };
  const select = (id: string) => { setSelected(id); setVisible(filtered.length); requestAnimationFrame(() => document.getElementById(`departure-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })); };
  return <div className="page-width" id="departure-dates">
    <div className="source-filter-grid">
      {!tour && <label className="filter-tour">{t(locale, "Tour")}<select value={tourFilter} onChange={(event) => setTourFilter(event.target.value)}><option value="">{t(locale, "Any")}</option>{[...new Set(source.map((item) => item.title))].sort().map((title) => <option key={title} value={title}>{t(locale, title)}</option>)}</select></label>}
      <label>{t(locale, "Duration")}<select value={days} onChange={(event) => setDays(event.target.value)}><option value="">{t(locale, "Any")}</option>{[...new Set(source.map(length))].sort((a, b) => a - b).map((value) => <option key={value} value={value}>{formatCount(locale, value, 'day')}</option>)}</select></label>
      <label>{t(locale, "Location")}<select value={location} onChange={(event) => setLocation(event.target.value)}><option value="">{t(locale, "Any")}</option>{[...new Set(source.flatMap((item) => item.locations))].sort().map((value) => <option key={value} value={value}>{t(locale, value)}</option>)}</select></label>
      <label>{t(locale, "Month")}<input type="month" value={month} onChange={(event) => setMonth(event.target.value)} /></label>
      <label>{t(locale, "Sort by")}<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="date-asc">{t(locale, "Earliest first")}</option><option value="date-desc">{t(locale, "Latest first")}</option><option value="days-asc">{t(locale, "Shortest first")}</option><option value="days-desc">{t(locale, "Longest first")}</option><option value="price-asc">{t(locale, "Price: low to high")}</option><option value="price-desc">{t(locale, "Price: high to low")}</option></select></label>
    </div>
    <div className="source-toolbar"><label className="source-check"><input type="checkbox" checked={hideEmpty} onChange={(event) => setHideEmpty(event.target.checked)} />{t(locale, "Hide empty departures")}</label><label className="source-check"><input type="checkbox" checked={hideFull} onChange={(event) => setHideFull(event.target.checked)} />{t(locale, "Hide fully booked")}</label><button onClick={reset}>{t(locale, "Clear filters")}</button><span role="status">{formatCount(locale, filtered.length, 'departure')}</span></div>
    {!tour && <Calendar locale={locale} departures={filtered} today={today} selected={selected} onSelect={select} />}
    {filtered.length ? <><div className="source-departure-list">{filtered.filter((item) => item.booked < item.capacity).slice(0, visible).map((item) => <DepartureCard key={item.id} departure={item} locale={locale} selected={selected === item.id} />)}</div>{filtered.some((item) => item.booked >= item.capacity) && <><h3>{t(locale, "Fully booked tours")}</h3>{filtered.filter((item) => item.booked >= item.capacity).map((item) => <DepartureCard key={item.id} departure={item} locale={locale} selected={selected === item.id} />)}</>}{filtered.length > visible && <button className="source-action" onClick={() => setVisible(filtered.length)}>{t(locale, "Show all departures")}</button>}</> : <div className="source-empty"><h3>{t(locale, "No departures match your filters.")}</h3><p>{t(locale, "Ask us about other dates or a private tour.")}</p><a className="button button-dark" href={localeHref(locale, `/booking/${tour ? `?tour=${tour.slug}` : ''}`)}>{t(locale, "Plan your trip")}</a></div>}
    <p className="source-note">{t(locale, "Prices and spaces reflect the saved website snapshot. Availability is not updated live.")}</p>
    {tour && <p>{t(locale, "Bookings close ")}{t(locale, tour.bookingCutoffDays || 2)} {t(locale, " days before departure. Tour dates use ")}{t(locale, tour.timeZone || 'Asia/Bishkek')} {t(locale, " time.")}</p>}
    <a className="text-link" href={localeHref(locale, `/booking/?tour=${tour?.slug || ''}&date=${shiftDate(today, 7)}`)}>{t(locale, "Need another date? Contact us")}</a>
  </div>;
}

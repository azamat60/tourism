'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Locale } from '@/lib/content';
import { content } from '@/lib/content';
import { dateFromIso, dateLocale, endDate, formatDepartureDate, sampleDepartures, type Departure } from '@/lib/departures';
import { expandedCopy } from '@/lib/expandedCopy';
import { localeHref } from '@/lib/links';
import { tourBasics, tourSlugs, type TourSlug } from '@/lib/tours';
import { ArrowIcon } from './SiteChrome';

function moveMonth(value: string, step: number) {
  const [year, month] = value.split('-').map(Number);
  const next = new Date(Date.UTC(year, month - 1 + step, 1));
  return `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, '0')}`;
}

function Calendar({ locale, month, tour, selected, onMonth, onSelect }: {
  locale: Locale; month: string; tour: TourSlug | 'all'; selected: string;
  onMonth: (value: string) => void; onSelect: (date: string) => void;
}) {
  const ui = expandedCopy[locale];
  const [year, monthNumber] = month.split('-').map(Number);
  const first = new Date(Date.UTC(year, monthNumber - 1, 1));
  const offset = (first.getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
  const label = new Intl.DateTimeFormat(dateLocale[locale], { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(first);
  const weekdays = Array.from({ length: 7 }, (_, index) => new Intl.DateTimeFormat(dateLocale[locale], { weekday: 'short', timeZone: 'UTC' }).format(new Date(Date.UTC(2026, 8, 28 + index))));
  const active = sampleDepartures.filter((item) => (tour === 'all' || item.tour === tour) && item.start.startsWith(month));

  return <div className="departure-calendar" aria-label={ui.calendar}>
    <div className="calendar-top"><div><span className="eyebrow dark"><span className="eyebrow-line" />{ui.calendar}</span><h2>{label}</h2></div><div className="calendar-nav"><button type="button" onClick={() => onMonth(moveMonth(month, -1))} aria-label={ui.prev}>←</button><button type="button" onClick={() => onMonth('2026-10')} aria-label={formatDepartureDate(locale, '2026-10-01', { month: 'long', year: 'numeric' })}>↺</button><button type="button" onClick={() => onMonth(moveMonth(month, 1))} aria-label={ui.next}>→</button></div></div>
    <div className="calendar-grid">{weekdays.map((day, index) => <span className="weekday" key={`${day}-${index}`}>{day}</span>)}{Array.from({ length: offset }, (_, index) => <span className="calendar-blank" key={`blank-${index}`} />)}{Array.from({ length: days }, (_, index) => {
      const value = `${month}-${String(index + 1).padStart(2, '0')}`;
      const count = active.filter((item) => item.start === value).length;
      return <button type="button" className={`calendar-day${count ? ' has-date' : ''}${selected === value ? ' selected' : ''}`} key={value} onClick={() => onSelect(selected === value ? '' : value)} aria-label={`${formatDepartureDate(locale, value)}${count ? ` · ${count} ${ui.list}` : ''}`} aria-pressed={selected === value}><span>{index + 1}</span>{count > 0 && <i aria-hidden="true" />}</button>;
    })}</div>
  </div>;
}

function DepartureCard({ locale, departure }: { locale: Locale; departure: Departure }) {
  const copy = content[locale];
  const ui = expandedCopy[locale];
  const tour = tourBasics(copy, departure.tour);
  const remaining = departure.capacity - departure.booked;
  const bookingUrl = localeHref(locale, `/booking/?tour=${departure.tour}&date=${departure.start}`);
  return <article className="departure-card">
    <div className="departure-image"><Image src={tour.image} alt={tour.place} width={1448} height={1086} sizes="(max-width: 680px) 100vw, 270px" /><span>{tour.place}</span></div>
    <div className="departure-body"><div className="departure-topline"><span>{tour.days} {copy.days}</span><span>{ui.price} · ${departure.price}</span></div><h3>{tour.title}</h3><div className="departure-dates"><div><small>{ui.date}</small><strong>{formatDepartureDate(locale, departure.start)}</strong></div><span aria-hidden="true">→</span><div><small>{ui.end}</small><strong>{formatDepartureDate(locale, endDate(departure.start, tour.days))}</strong></div></div><div className="seat-row"><span>{ui.seats}</span><strong>{remaining} / {departure.capacity} {ui.available}</strong></div><div className="seat-track"><span style={{ width: `${(departure.booked / departure.capacity) * 100}%` }} /></div><div className="departure-actions"><a href={bookingUrl} className="button button-dark">{ui.enquire}<ArrowIcon diagonal /></a><a className="text-link" href={localeHref(locale, `/tours/${departure.tour}/`)}>{ui.viewTour}<ArrowIcon diagonal /></a></div></div>
  </article>;
}

export default function DepartureExplorer({ locale }: { locale: Locale }) {
  const ui = expandedCopy[locale];
  const copy = content[locale];
  const [tour, setTour] = useState<TourSlug | 'all'>('all');
  const [month, setMonth] = useState('2026-10');
  const [selectedDate, setSelectedDate] = useState('');
  const [sort, setSort] = useState<'date' | 'duration' | 'price'>('date');
  const [descending, setDescending] = useState(false);
  const available = sampleDepartures
    .filter((item) => tour === 'all' || item.tour === tour)
    .filter((item) => !selectedDate || item.start === selectedDate)
    .sort((a, b) => {
      const difference = sort === 'price' ? a.price - b.price : sort === 'duration' ? tourBasics(copy, a.tour).days - tourBasics(copy, b.tour).days : dateFromIso(a.start).getTime() - dateFromIso(b.start).getTime();
      return difference * (descending ? -1 : 1);
    });

  return <div className="page-width departure-explorer">
    <div className="demo-banner"><span aria-hidden="true">✳</span><p>{ui.demoNotice}</p></div>
    <div className="departure-filters"><label>{ui.tour}<select value={tour} onChange={(event) => { setTour(event.target.value as TourSlug | 'all'); setSelectedDate(''); }}><option value="all">{ui.allTours}</option>{tourSlugs.map((slug) => <option key={slug} value={slug}>{tourBasics(copy, slug).title}</option>)}</select></label><label>{ui.sort}<select value={sort} onChange={(event) => setSort(event.target.value as 'date' | 'duration' | 'price')}><option value="date">{ui.date}</option><option value="duration">{ui.duration}</option><option value="price">{ui.price}</option></select></label><button type="button" className="sort-direction" onClick={() => setDescending(!descending)} aria-label={`${ui.sort}: ${descending ? '↑' : '↓'}`}>{descending ? '↑' : '↓'}</button>{selectedDate && <button type="button" className="filter-reset" onClick={() => setSelectedDate('')}>{ui.reset}</button>}</div>
    <Calendar locale={locale} month={month} tour={tour} selected={selectedDate} onMonth={(value) => { setMonth(value); setSelectedDate(''); }} onSelect={setSelectedDate} />
    <div className="departure-results"><div className="departure-results-head"><p className="eyebrow dark"><span className="eyebrow-line" />{ui.list}</p><span>{available.length}</span></div>{available.length ? <div className="departure-list">{available.map((item) => <DepartureCard key={item.id} locale={locale} departure={item} />)}</div> : <p className="filter-empty">{ui.noDates}</p>}</div>
  </div>;
}

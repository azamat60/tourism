'use client';

import { useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import type { Locale } from '@/lib/content';
import { content } from '@/lib/content';
import { formatDepartureDate, sampleDepartures } from '@/lib/departures';
import { expandedCopy } from '@/lib/expandedCopy';
import { whatsappLink } from '@/lib/links';
import { isTourSlug, tourBasics, tourSlugs, type TourSlug } from '@/lib/tours';
import { ArrowIcon } from './SiteChrome';

function subscribeToLocation(callback: () => void) {
  window.addEventListener('popstate', callback);
  return () => window.removeEventListener('popstate', callback);
}

function currentQuery() {
  return window.location.search;
}

function serverQuery() {
  return '';
}

export default function BookingForm({ locale }: { locale: Locale }) {
  const copy = content[locale];
  const ui = expandedCopy[locale];
  const query = useSyncExternalStore(subscribeToLocation, currentQuery, serverQuery);
  const queryParams = new URLSearchParams(query);
  const queryTour = queryParams.get('tour') || '';
  const queryDate = queryParams.get('date') || '';
  const [tourChoice, setTourChoice] = useState<TourSlug | '' | null>(null);
  const [dateChoice, setDateChoice] = useState<string | null>(null);
  const tour = tourChoice ?? (isTourSlug(queryTour) ? queryTour : '');
  const date = dateChoice ?? (/^\d{4}-\d{2}-\d{2}$/.test(queryDate) ? queryDate : '');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [guests, setGuests] = useState(2);
  const [message, setMessage] = useState('');
  const selected = tour ? tourBasics(copy, tour) : null;
  const selectedDeparture = sampleDepartures.find((item) => item.tour === tour && item.start === date);
  const ready = Boolean(tour && date && name.trim() && phone.trim() && guests > 0);
  const requestText = [
    copy.inquiryMessage,
    `${ui.tour}: ${selected?.title ?? ''}`,
    `${ui.date}: ${date ? formatDepartureDate(locale, date) : ''}`,
    `${ui.guests}: ${guests}`,
    `${ui.name}: ${name.trim()}`,
    `${ui.phone}: ${phone.trim()}`,
    email.trim() ? `${ui.email}: ${email.trim()}` : '',
    message.trim() ? `${ui.message}: ${message.trim()}` : '',
  ].filter(Boolean).join('\n');

  return <div className="page-width booking-layout">
    <div className="booking-fields"><div className="booking-heading"><span>01 / 02</span><h2>{ui.bookingTitle}</h2></div>
      <div className="booking-field-grid"><label>{ui.tour}<select value={tour} onChange={(event) => setTourChoice(event.target.value as TourSlug | '')} required><option value="">{ui.allTours}</option>{tourSlugs.map((slug) => <option key={slug} value={slug}>{tourBasics(copy, slug).title}</option>)}</select></label><label>{ui.date}<input type="date" value={date} onChange={(event) => setDateChoice(event.target.value)} required /></label><label>{ui.name}<input type="text" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required /></label><label>{ui.phone}<input type="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} required /></label><label>{ui.email} <small>{ui.optional}</small><input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label><label>{ui.guests}<input type="number" min="1" max="20" value={guests} onChange={(event) => setGuests(Math.max(1, Math.min(20, Number(event.target.value) || 1)))} required /></label><label className="wide">{ui.message} <small>{ui.optional}</small><textarea rows={5} value={message} onChange={(event) => setMessage(event.target.value)} /></label></div>
    </div>
    <aside className="booking-summary"><span className="booking-step">02 / 02</span>{selected ? <><div className="booking-photo"><Image src={selected.image} alt={selected.place} width={1448} height={1086} sizes="(max-width: 900px) 100vw, 360px" /></div><p className="eyebrow light"><span className="eyebrow-line" />{selected.place}</p><h2>{selected.title}</h2><div className="booking-facts"><div><span>{ui.date}</span><strong>{date ? formatDepartureDate(locale, date) : '—'}</strong></div><div><span>{ui.guests}</span><strong>{guests}</strong></div>{selectedDeparture && <div><span>{ui.price}</span><strong>${selectedDeparture.price}</strong></div>}</div></> : <><span className="booking-placeholder">✳</span><h2>{ui.tour}</h2><p>{ui.bookingIntro}</p></>}
      {ready ? <a className="button button-light" href={whatsappLink(requestText)} target="_blank" rel="noopener noreferrer">{ui.sendRequest}<ArrowIcon diagonal /></a> : <span className="button button-light booking-disabled" aria-disabled="true">{ui.sendRequest}<ArrowIcon diagonal /></span>}{selectedDeparture && <p className="booking-note">{ui.demoNotice}</p>}<p className="booking-note">{ui.bookingNote}</p>
    </aside>
  </div>;
}

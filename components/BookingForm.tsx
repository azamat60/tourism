'use client';

import { translate as t } from '@/lib/i18n';

import { useState, type FormEvent } from 'react';
import type { Locale } from '@/lib/content';
import { activeTours, getTour, shiftDate, validDate } from '@/lib/mock-data';
import { useBishkekDay, useBrowserQuery } from '@/lib/browser-state';
import { localeHref } from '@/lib/links';
import { storeInquiry } from '@/lib/mock-service';
import { site } from '@/lib/mocks/site.mock';

export default function BookingForm({ locale }: { locale: Locale }) {
  const params = useBrowserQuery();
  const today = useBishkekDay();
  return <InquiryForm key={params.toString()} locale={locale} today={today} tour={getTour(params.get('tour') || '')?.title || params.get('tour') || ''} date={params.get('date') || ''} message={params.get('message') || ''} />;
}

function InquiryForm({ locale, today, tour, date, message }: { locale: Locale; today: string; tour: string; date: string; message: string }) {
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError('');
    const data = new FormData(event.currentTarget);
    const value = (key: string) => String(data.get(key) || '').trim();
    if (value('_gotcha')) return;
    if (!/^\+?[1-9]\d{6,14}$/.test(value('whatsappNumber').replace(/[\s\-()]/g, ''))) { setError('Please enter a valid WhatsApp number.'); return; }
    if (!validDate(value('date')) || value('date') < today || value('date') > shiftDate(today, 730)) { setError('Please select a date between today and 2 years from now.'); return; }
    setPending(true);
    try {
      const id = storeInquiry({ name: value('name'), email: value('email'), whatsappNumber: value('whatsappNumber'), date: value('date'), tour: value('tour'), message: value('message') });
      window.location.assign(localeHref(locale, `/success/?requestId=${id}`));
    } catch { setError('Your request could not be saved in this browser. Please allow browser storage and try again.'); setPending(false); }
  }
  return <div className="page-width booking-layout">
    <form className="booking-fields" onSubmit={submit}><div className="booking-heading"><h2>{t(locale, "Send us a message")}</h2></div><p>{t(locale, "Include the dates you're interested in, how many people are travelling and anything else we should know.")}</p>
      <input name="_gotcha" className="source-honeypot" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="booking-field-grid"><label>{t(locale, "Your name")}<input name="name" autoComplete="name" placeholder={t(locale, "Full name")} required maxLength={100} /></label><label>{t(locale, "Email")}<input name="email" type="email" autoComplete="email" placeholder="you@email.com" required /></label><label>{t(locale, "WhatsApp number")}<input name="whatsappNumber" type="tel" autoComplete="tel" placeholder="+1 555 123 4567" required /></label><label>{t(locale, "Anticipated tour date")}<input name="date" type="date" min={today} max={shiftDate(today, 730)} defaultValue={validDate(date) ? date : ''} required /></label><label className="wide">{t(locale, "Tour")}<select name="tour" defaultValue={tour.includes('(CUSTOM)') ? 'Custom Private Tour' : tour} required><option value="">{t(locale, "Select Tour")}</option>{activeTours.toSorted((a, b) => a.title.localeCompare(b.title)).map((item) => <option key={item.slug} value={item.title}>{t(locale, item.title)}</option>)}</select></label><label className="wide">{t(locale, "Your message")}<textarea name="message" rows={5} defaultValue={message} placeholder={t(locale, "Your Message. Include dates interested, number of people, and any other important information.")} maxLength={5000} required /></label></div>
      <p className="source-note">{t(locale, site.mockNotice)}</p>{error && <p role="alert" className="source-error">{t(locale, error)}</p>}<button type="submit" className="button button-dark" disabled={pending}>{t(locale, pending ? 'Saving...' : 'Send Message')}</button>
    </form>
    <aside className="source-aside"><h2>{t(locale, "What happens next?")}</h2><ol>{site.bookingSteps.map((item) => <li key={item.title}><strong>{t(locale, item.title)}</strong><p>{t(locale, item.text)}</p></li>)}</ol><h3>{t(locale, "Or contact us directly")}</h3><p><a href={`https://wa.me/${site.whatsappNumber}`} target="_blank" rel="noopener noreferrer">{t(locale, site.phone)}</a></p>{site.email && <p><a href={`mailto:${site.email}`}>{t(locale, site.email)}</a></p>}{site.instagram && <p><a href={site.instagram} target="_blank" rel="noopener noreferrer">{t(locale, "Instagram")}</a></p>}</aside>
  </div>;
}

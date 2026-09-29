'use client';

import { useState, useSyncExternalStore } from 'react';
import type { Copy, Locale } from '@/lib/content';
import type { InnerCopy } from '@/lib/innerCopy';
import { whatsappLink } from '@/lib/links';
import { tourConfig, tourSlugs, type TourSlug } from '@/lib/tours';

type TourOption = { slug: TourSlug; title: string };
type Interest = 'riding' | 'yurts' | 'landscapes' | 'culture';

function subscribeToLocation(callback: () => void) {
  window.addEventListener('popstate', callback);
  return () => window.removeEventListener('popstate', callback);
}

function getQueryTour(): TourSlug | '' {
  const value = new URLSearchParams(window.location.search).get('tour');
  return value && tourSlugs.includes(value as TourSlug) ? value as TourSlug : '';
}

function getServerTour(): TourSlug | '' {
  return '';
}

export default function PlannerForm({ locale, copy, ui, options }: {
  locale: Locale;
  copy: Copy;
  ui: InnerCopy;
  options: TourOption[];
}) {
  const queryJourney = useSyncExternalStore(subscribeToLocation, getQueryTour, getServerTour);
  const [journeyChoice, setJourneyChoice] = useState<TourSlug | '' | null>(null);
  const journey = journeyChoice ?? queryJourney;
  const [month, setMonth] = useState('');
  const [travelers, setTravelers] = useState(2);
  const [durationChoice, setDurationChoice] = useState<number | null>(null);
  const duration = durationChoice ?? (journey ? tourConfig[journey].days : 5);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [notes, setNotes] = useState('');

  const interestOptions: { id: Interest; label: string }[] = [
    { id: 'riding', label: ui.riding },
    { id: 'yurts', label: ui.yurts },
    { id: 'landscapes', label: ui.landscapes },
    { id: 'culture', label: ui.culture },
  ];
  const selectedTitle = options.find((option) => option.slug === journey)?.title ?? ui.custom;
  const selectedInterests = interestOptions.filter((option) => interests.includes(option.id)).map((option) => option.label);

  const message = [
    copy.inquiryMessage,
    `${ui.journey}: ${selectedTitle}`,
    `${ui.duration}: ${duration} ${ui.days}`,
    `${ui.month}: ${month || ui.noMonth}`,
    `${ui.travelers}: ${travelers}`,
    selectedInterests.length ? `${ui.interests}: ${selectedInterests.join(', ')}` : '',
    notes.trim() ? `${ui.notes}: ${notes.trim()}` : '',
  ].filter(Boolean).join('\n');

  function toggleInterest(id: Interest) {
    setInterests((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  return (
    <div className="planner-grid page-width">
      <form className="planner-form" onSubmit={(event) => event.preventDefault()}>
        <div className="form-section"><span className="form-number">01</span><div><label htmlFor="plan-journey">{ui.journey}</label><select id="plan-journey" value={journey} onChange={(event) => { const value = event.target.value as TourSlug | ''; setJourneyChoice(value); setDurationChoice(value ? tourConfig[value].days : 5); }}><option value="">{ui.custom}</option>{options.map((option) => <option value={option.slug} key={option.slug}>{option.title}</option>)}</select></div></div>
        <div className="form-section"><span className="form-number">02</span><div><div className="form-row"><div><label htmlFor="plan-month">{ui.month} <span>{ui.optional}</span></label><input id="plan-month" type="month" value={month} onChange={(event) => setMonth(event.target.value)} lang={locale === 'ge' ? 'de' : locale} /></div><div><label htmlFor="plan-travelers">{ui.travelers}</label><input id="plan-travelers" type="number" min="1" max="20" value={travelers} onChange={(event) => setTravelers(Math.max(1, Math.min(20, Number(event.target.value) || 1)))} /></div></div><label htmlFor="plan-duration">{ui.duration}</label><div className="duration-control"><input id="plan-duration" type="range" min="2" max="14" value={duration} onChange={(event) => setDurationChoice(Number(event.target.value))} /><strong>{duration} {ui.days}</strong></div></div></div>
        <div className="form-section"><span className="form-number">03</span><div><fieldset><legend>{ui.interests}</legend><div className="interest-grid">{interestOptions.map((option) => <label className={`interest-option${interests.includes(option.id) ? ' selected' : ''}`} key={option.id}><input type="checkbox" checked={interests.includes(option.id)} onChange={() => toggleInterest(option.id)} /><span>{option.label}</span><span aria-hidden="true">{interests.includes(option.id) ? '✓' : '+'}</span></label>)}</div></fieldset><label htmlFor="plan-notes">{ui.notes} <span>{ui.optional}</span></label><textarea id="plan-notes" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder={ui.notesPlaceholder} rows={4} /></div></div>
      </form>
      <aside className="planner-summary"><p className="eyebrow light"><span className="eyebrow-line" />{ui.summary}</p><span className="summary-mark">✳</span><h2>{selectedTitle}</h2><div className="summary-list"><div><span>{ui.duration}</span><strong>{duration} {ui.days}</strong></div><div><span>{ui.month}</span><strong>{month || ui.noMonth}</strong></div><div><span>{ui.travelers}</span><strong>{travelers}</strong></div>{selectedInterests.length > 0 && <div><span>{ui.interests}</span><strong>{selectedInterests.join(' · ')}</strong></div>}</div><a className="button button-light" href={whatsappLink(message)} target="_blank" rel="noopener noreferrer">{ui.send}<svg aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M4 16 16 4M6 4h10v10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg></a></aside>
    </div>
  );
}

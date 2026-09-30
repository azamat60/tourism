'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Locale } from '@/lib/content';
import { content } from '@/lib/content';
import { expandedCopy } from '@/lib/expandedCopy';
import { localeHref } from '@/lib/links';
import { tourBasics, tourSlugs, type TourSlug } from '@/lib/tours';
import { ArrowIcon } from './SiteChrome';

export default function CatalogFilters({ locale }: { locale: Locale }) {
  const copy = content[locale];
  const ui = expandedCopy[locale];
  const [destination, setDestination] = useState<TourSlug | 'all'>('all');
  const [duration, setDuration] = useState('all');
  const [sort, setSort] = useState<'short' | 'long'>('short');
  const journeys = tourSlugs
    .filter((slug) => destination === 'all' || slug === destination)
    .filter((slug) => duration === 'all' || String(tourBasics(copy, slug).days) === duration)
    .sort((a, b) => (tourBasics(copy, a).days - tourBasics(copy, b).days) * (sort === 'short' ? 1 : -1));

  return (
    <div className="page-width catalog-layout">
      <div className="filter-bar">
        <label>{ui.destination}<select value={destination} onChange={(event) => setDestination(event.target.value as TourSlug | 'all')}><option value="all">{ui.all}</option>{tourSlugs.map((slug) => <option key={slug} value={slug}>{tourBasics(copy, slug).place}</option>)}</select></label>
        <label>{ui.duration}<select value={duration} onChange={(event) => setDuration(event.target.value)}><option value="all">{ui.all}</option>{tourSlugs.map((slug) => <option key={slug} value={String(tourBasics(copy, slug).days)}>{tourBasics(copy, slug).days} {copy.days}</option>)}</select></label>
        <label>{ui.sort}<select value={sort} onChange={(event) => setSort(event.target.value as 'short' | 'long')}><option value="short">{ui.shortest}</option><option value="long">{ui.longest}</option></select></label>
        <button className="filter-reset" type="button" onClick={() => { setDestination('all'); setDuration('all'); setSort('short'); }}>{ui.reset}</button>
      </div>
      {journeys.length ? <div className="catalog-grid">{journeys.map((slug) => {
        const tour = tourBasics(copy, slug);
        return <a className="catalog-card" key={slug} href={localeHref(locale, `/tours/${slug}/`)} aria-label={`${ui.viewTour}: ${tour.title}`}>
          <div className="catalog-card-photo"><Image src={tour.image} alt={tour.place} width={1448} height={1086} sizes="(max-width: 680px) 100vw, 48vw" /><span>{tour.tag}</span></div>
          <div className="catalog-card-body"><div className="catalog-card-meta"><span>{tour.place}</span><span>{tour.days} {copy.days}</span></div><h2>{tour.title}</h2><p>{tour.description}</p><span className="catalog-card-action">{ui.viewTour}<ArrowIcon diagonal /></span></div>
        </a>;
      })}</div> : <p className="filter-empty">{ui.noTours}</p>}
    </div>
  );
}

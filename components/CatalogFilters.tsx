'use client';

import { formatCount, translate as t } from '@/lib/i18n';

import { useMemo, useState } from 'react';
import type { Locale } from '@/lib/content';
import { activeTours, durationDays, locationCoordinates, tierValue } from '@/lib/mock-data';
import { TourCard } from './ContentBlocks';
import TourMap from './TourMap';

export default function CatalogFilters({ locale }: { locale: Locale }) {
  const [horse, setHorse] = useState('any');
  const [days, setDays] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [sort, setSort] = useState('days-asc');
  const [count, setCount] = useState(15);
  const [hovered, setHovered] = useState('');
  const [showMap, setShowMap] = useState(true);
  const locations = useMemo(() => [...new Set(activeTours.flatMap((tour) => tour.locations))].sort(), []);
  const durations = [...new Set(activeTours.map((tour) => durationDays(tour)))].sort((a, b) => a - b);
  const prices = [...new Set(activeTours.map((tour) => tierValue(tour.pricesEnglish, 1)).filter((value) => value !== null))].sort((a, b) => a - b);
  const matches = activeTours.filter((tour) => (horse === 'any' || tour.horse === (horse === 'yes')) &&
    (!days || String(durationDays(tour)) === days) && (!location || tour.locations.includes(location)) &&
    (!price || (tierValue(tour.pricesEnglish, 1) ?? Infinity) <= Number(price)));
  const custom = activeTours.find((tour) => tour.slug === 'custom-private-tour');
  const ordered = matches.filter((tour) => tour !== custom).sort((a, b) => {
    const value = sort.startsWith('price')
      ? (tierValue(a.pricesEnglish, 1) ?? Infinity) - (tierValue(b.pricesEnglish, 1) ?? Infinity)
      : durationDays(a) - durationDays(b);
    return sort.endsWith('desc') ? -value : value;
  });
  if (custom && matches.includes(custom)) ordered.push(custom);
  const points = useMemo(() => locations.flatMap((name) => {
    const coords = locationCoordinates[name];
    if (!coords) return [];
    return [{ name, lat: coords[0], lng: coords[1], selected: name === location || Boolean(activeTours.find((tour) => tour.slug === hovered)?.locations.includes(name)) }];
  }), [locations, location, hovered]);
  const reset = () => { setHorse('any'); setDays(''); setLocation(''); setPrice(''); setSort('days-asc'); setCount(15); };
  return <div className="page-width">
    <div className="source-filter-grid">
      <label>{t(locale, "Horse riding")}<select value={horse} onChange={(event) => setHorse(event.target.value)}><option value="any">{t(locale, "Any")}</option><option value="yes">{t(locale, "Yes")}</option><option value="no">{t(locale, "No")}</option></select></label>
      <label>{t(locale, "Duration")}<select value={days} onChange={(event) => setDays(event.target.value)}><option value="">{t(locale, "Any")}</option>{durations.map((value) => <option key={value} value={value}>{value ? formatCount(locale, value, 'day') : t(locale, 'Flexible')}</option>)}</select></label>
      <label>{t(locale, "Location")}<select value={location} onChange={(event) => setLocation(event.target.value)}><option value="">{t(locale, "Any")}</option>{locations.map((value) => <option key={value} value={value}>{t(locale, value)}</option>)}</select></label>
      <label>{t(locale, "Maximum solo price")}<select value={price} onChange={(event) => setPrice(event.target.value)}><option value="">{t(locale, "Any")}</option>{prices.map((value) => <option key={value} value={value}>{t(locale, "Up to $")}{t(locale, value)}</option>)}</select></label>
      <label>{t(locale, "Sort by")}<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="days-asc">{t(locale, "Duration (Short first)")}</option><option value="days-desc">{t(locale, "Duration (Long first)")}</option><option value="price-asc">{t(locale, "Price (Low to High)")}</option><option value="price-desc">{t(locale, "Price (High to Low)")}</option></select></label>
    </div>
    <div className="source-toolbar"><p role="status">{formatCount(locale, ordered.length, 'tour')}</p><button onClick={reset}>{t(locale, "Clear filters")}</button><button onClick={() => setShowMap(!showMap)}>{t(locale, showMap ? 'Hide map' : 'Show map')}</button></div>
    {showMap && <TourMap locale={locale} points={points} onSelect={(point) => setLocation(point.name)} />}
    <div className="tour-grid">{ordered.slice(0, count).map((tour, index) => <div className="tour-card-slot" key={tour.slug} onMouseEnter={() => setHovered(tour.slug)} onMouseLeave={() => setHovered('')}><TourCard tour={tour} index={index} locale={locale} /></div>)}</div>
    {ordered.length > count && <button className="source-action" onClick={() => setCount(count + 15)}>{t(locale, "Show more tours")}</button>}
  </div>;
}

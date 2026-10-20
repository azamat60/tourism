'use client';

import { translate as t } from '@/lib/i18n';

import type { Locale } from '@/lib/content';

import { useMemo, useState } from 'react';
import type { ItineraryDay } from '@/lib/mock-types';
import TourMap, { type MapPoint } from './TourMap';

export default function RouteExplorer({ days, locale = 'en' }: { days: ItineraryDay[]; locale?: Locale }) {
  const points = useMemo(() => days.flatMap((day, index) => {
    const rows: MapPoint[] = (day.waypoints || []).flatMap((waypoint) => waypoint.lat != null && waypoint.lng != null
      ? [{ name: waypoint.name, lat: waypoint.lat, lng: waypoint.lng, day: index + 1 }] : []);
    if (day.lat != null && day.lng != null) rows.push({ name: day.place || day.title, lat: day.lat, lng: day.lng, day: index + 1 });
    return rows;
  }), [days]);
  const altitude = days.flatMap((day, index) => day.maxAltitude != null || day.sleepAltitude != null
    ? [{ day: index + 1, name: day.place || day.title, max: day.maxAltitude ?? day.sleepAltitude ?? 0, sleep: day.sleepAltitude ?? day.maxAltitude ?? 0 }] : []);
  const [tab, setTab] = useState(points.length >= 2 ? 'route' : 'altitude');
  if (points.length < 2 && altitude.length < 2) return null;
  const ceiling = Math.max(1, ...altitude.map((point) => point.max));
  const coordinates = (sleep: boolean) => altitude.map((point, index) => `${40 + index * 720 / Math.max(altitude.length - 1, 1)},${240 - (sleep ? point.sleep : point.max) / ceiling * 200}`).join(' ');
  return <section className="section-pad page-width"><h2>{t(locale, "Route & altitude")}</h2><div className="source-toolbar" role="tablist" aria-label={t(locale, "Route and altitude")}>
    {points.length >= 2 && <button role="tab" aria-selected={tab === 'route'} onClick={() => setTab('route')}>{t(locale, "Route Map")}</button>}
    {altitude.length >= 2 && <button role="tab" aria-selected={tab === 'altitude'} onClick={() => setTab('altitude')}>{t(locale, "Altitude")}</button>}
  </div>
    {tab === 'route' && points.length >= 2 ? <TourMap locale={locale} points={points} route onSelect={(point) => document.getElementById(`day-${point.day}`)?.scrollIntoView({ behavior: 'smooth' })} /> : <div className="source-altitude" role="tabpanel"><svg viewBox="0 0 800 280" aria-label={t(locale, "Daily highest and overnight altitude")}><polyline points={coordinates(false)} fill="none" stroke="#a24c30" strokeWidth="3" /><polyline points={coordinates(true)} fill="none" stroke="#243e32" strokeWidth="3" /></svg><p>{t(locale, "Rust: highest point · Green: overnight altitude")}</p><table><thead><tr><th>{t(locale, "Day")}</th><th>{t(locale, "Location")}</th><th>{t(locale, "Highest")}</th><th>{t(locale, "Overnight")}</th></tr></thead><tbody>{altitude.map((point) => <tr key={point.day}><td>{t(locale, point.day)}</td><td><a href={`#day-${point.day}`}>{t(locale, point.name)}</a></td><td>{t(locale, point.max)} {t(locale, " m")}</td><td>{t(locale, point.sleep)} {t(locale, " m")}</td></tr>)}</tbody></table></div>}
  </section>;
}

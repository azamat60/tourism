'use client';

import { useTranslation } from './SiteData';

import { useEffect, useRef, useState } from 'react';
import type { LayerGroup, Map as LeafletMap } from 'leaflet';
import type { Locale } from '@/lib/content';
import { formatCount } from '@/lib/i18n';
import TourIcon from './TourIcon';

export type MapPoint = { name: string; lat: number; lng: number; day?: number; selected?: boolean };
type Props = { points: MapPoint[]; locale?: Locale; route?: boolean; onSelect?: (point: MapPoint) => void };

export default function TourMap({ points, locale = 'en', route = false, onSelect }: Props) {
  const t = useTranslation();

  const container = useRef<HTMLDivElement>(null);
  const map = useRef<LeafletMap | null>(null);
  const markers = useRef<LayerGroup | null>(null);
  const reset = useRef(() => {});
  const callback = useRef(onSelect);
  const [ready, setReady] = useState(0);
  const [failed, setFailed] = useState(false);
  useEffect(() => { callback.current = onSelect; }, [onSelect]);

  useEffect(() => {
    let cancelled = false;
    let observer: ResizeObserver | undefined;
    import('leaflet').then((L) => {
      if (cancelled || !container.current) return;
      const instance = L.map(container.current, { scrollWheelZoom: false, zoomControl: false, attributionControl: false });
      map.current = instance;
      instance.setView([41.8, 76], 7);
      L.control.attribution({ prefix: false }).addTo(instance);
      L.control.zoom({ position: 'topright', zoomInTitle: t(locale, 'Zoom in'), zoomOutTitle: t(locale, 'Zoom out') }).addTo(instance);
      const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', maxZoom: 18,
      }).addTo(instance);
      tiles.on('tileload', () => { if (!cancelled) setFailed(false); });
      tiles.on('tileerror', () => { if (!cancelled) setFailed(true); });
      markers.current = L.layerGroup().addTo(instance);
      observer = new ResizeObserver(() => instance.invalidateSize());
      observer.observe(container.current);
      setReady((version) => version + 1);
    }).catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; observer?.disconnect(); map.current?.remove(); map.current = null; markers.current = null; };
  }, [locale, t]);

  useEffect(() => {
    if (!ready || !map.current || !markers.current) return;
    let cancelled = false;
    import('leaflet').then((L) => {
      if (cancelled || !map.current || !markers.current) return;
      const instance = map.current;
      const layer = markers.current;
      layer.clearLayers();
      const bounds: [number, number][] = points.map((point) => [point.lat, point.lng]);
      points.forEach((point) => {
        const icon = L.divIcon({ className: `tour-map-pin${point.selected ? ' is-selected' : ''}`, html: `<span>${point.day || ''}</span>`, iconSize: [32, 32], iconAnchor: [16, 16] });
        const label = document.createElement('span');
        label.textContent = `${point.day ? `${point.day}. ` : ''}${t(locale, point.name)}`;
        L.marker([point.lat, point.lng], { icon, title: label.textContent, keyboard: true, riseOnHover: true })
          .addTo(layer).bindTooltip(label, { permanent: Boolean(point.selected), direction: 'top', offset: [0, -18], className: 'tour-map-tooltip' })
          .on('click', () => callback.current?.(point));
      });
      if (route && bounds.length > 1) {
        L.polyline(bounds, { color: '#fffdf7', weight: 7, opacity: .9 }).addTo(layer);
        L.polyline(bounds, { color: '#a24c30', dashArray: '6 9', lineCap: 'round', weight: 3 }).addTo(layer);
      }
      reset.current = () => {
        if (bounds.length > 1) instance.fitBounds(bounds, { padding: [55, 55], maxZoom: 10 });
        else instance.setView(bounds[0] || [41.8, 76], bounds.length ? 9 : 7);
      };
      if (!instance.getContainer().dataset.fitted) { reset.current(); instance.getContainer().dataset.fitted = 'true'; }
    });
    return () => { cancelled = true; };
  }, [points, route, ready, locale, t]);

  return <section className="source-map-wrap" aria-label={t(locale, route ? 'Route map' : 'Tour locations')}>
    <div className="tour-map-heading"><div className="tour-map-heading-icon"><TourIcon name="pin" /></div><div><p className="eyebrow dark">{t(locale, 'Explore Kyrgyzstan')}</p><h3>{t(locale, route ? 'Route map' : 'Find your next adventure')}</h3></div><span className="tour-map-count">{formatCount(locale, points.length, 'destination')}</span></div>
    <div className="tour-map-canvas"><div ref={container} className="source-map" dir="ltr" aria-label={t(locale, route ? 'Tour route map' : 'Tour locations map')} />
      {!ready && !failed && <p className="tour-map-status" role="status">{t(locale, 'Loading map…')}</p>}
      {failed && <p className="tour-map-status" role="status">{t(locale, 'Map unavailable. You can still browse and filter tours below.')}</p>}
      <button className="source-map-reset" onClick={() => reset.current()} type="button"><TourIcon name="pin" />{t(locale, 'Reset view')}</button>
    </div>
    <div className="tour-map-footer"><p>{t(locale, 'Choose a place on the map to explore tours.')}</p><div className="tour-map-places">{points.map((point, index) => <button key={`${point.name}-${index}`} type="button" className={point.selected ? 'is-selected' : ''} aria-pressed={Boolean(point.selected)} onClick={() => { map.current?.flyTo([point.lat, point.lng], Math.max(map.current.getZoom(), 8), { duration: .6 }); callback.current?.(point); }}><span />{t(locale, point.name)}</button>)}</div></div>
  </section>;
}

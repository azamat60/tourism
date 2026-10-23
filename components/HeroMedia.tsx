'use client';

import { useCatalog, useTranslation } from './SiteData';



import type { Locale } from '@/lib/content';

import Image from './SiteImage';
import { useState, useSyncExternalStore } from 'react';


function subscribe(callback: () => void) {
  const query = window.matchMedia('(min-width: 800px) and (prefers-reduced-motion: no-preference)');
  query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
}
export default function HeroMedia({ locale = 'en' }: { locale?: Locale }) {
  const { site } = useCatalog();
  const t = useTranslation();

  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const video = useSyncExternalStore(subscribe, () => window.matchMedia('(min-width: 800px) and (prefers-reduced-motion: no-preference)').matches, () => false);
  return <><Image className="hero-image" src={video ? site.heroPoster : site.heroFallback} alt={t(locale, "Kyrgyzstan horse trekking landscape")} fill priority sizes="100vw" />
    {video && !failed && <div className={`source-hero-video ${loaded ? 'is-loaded' : ''}`} aria-hidden="true"><iframe src={`https://www.youtube-nocookie.com/embed/${site.heroVideoId}?start=${site.heroVideoStart}&autoplay=1&mute=1&controls=0&loop=1&playlist=${site.heroVideoId}&playsinline=1&rel=0`} title={t(locale, site.heroVideoTitle)} referrerPolicy="strict-origin-when-cross-origin" tabIndex={-1} allow="autoplay; encrypted-media" onLoad={() => setLoaded(true)} onError={() => setFailed(true)} /></div>}
  </>;
}

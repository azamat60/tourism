'use client';

import { useCatalog, useTranslation } from './SiteData';

import { formatCount } from '@/lib/i18n';

import type { Locale } from '@/lib/content';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import TourIcon from './TourIcon';
import { ArrowIcon } from './SiteChrome';

export default function PhotoGallery({ images, captions = {}, title = 'Photos', locale = 'en' }: {
  locale?: Locale; images: string[]; captions?: Record<string, string>; title?: string;
}) {
  const { asset } = useCatalog();
  const t = useTranslation();

  const [selected, setSelected] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const touchStart = useRef(0);
  const unique = [...new Set(images.filter(Boolean))];
  useEffect(() => {
    if (selected !== null) dialog.current?.showModal();
    else dialog.current?.close();
  }, [selected]);
  const isOpen = selected !== null;
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [isOpen]);
  if (!unique.length) return null;
  const move = (direction: number) => setSelected((current) => ((current ?? 0) + direction + unique.length) % unique.length);
  return <div className="source-gallery">
    <div className="gallery-heading"><h3>{t(locale, title)}</h3><span><TourIcon name="image" />{formatCount(locale, unique.length, 'photo')}</span></div>
    <div className="source-gallery-grid">{unique.slice(0, expanded ? undefined : 6).map((src, index) => <button className="gallery-photo" key={src} type="button" onClick={() => setSelected(index)} aria-label={t(locale, `View photo ${index + 1}: ${captions[src] || title}`)}>
      <span className="gallery-thumbnail"><Image src={asset(src)} alt={t(locale, captions[src] || `${title} ${index + 1}`)} fill sizes="(max-width: 540px) 100vw, (max-width: 1000px) 50vw, 33vw" /><span className="gallery-zoom"><TourIcon name="plus" /></span></span>
      {captions[src] && <span className="gallery-caption">{t(locale, captions[src])}</span>}
    </button>)}</div>
    {unique.length > 6 && <div className="gallery-actions"><button type="button" className="button button-dark" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}><TourIcon name="image" />{t(locale, expanded ? 'Show fewer photos' : `View all ${unique.length} photos`)}<ArrowIcon diagonal /></button></div>}
    <dialog ref={dialog} className="photo-dialog" aria-label={t(locale, title)} onCancel={() => setSelected(null)} onClose={() => setSelected(null)} onKeyDown={(event) => {
      if (event.key === 'ArrowRight') move(1);
      if (event.key === 'ArrowLeft') move(-1);
    }}>
      {selected !== null && <div onTouchStart={(event) => { touchStart.current = event.changedTouches[0].clientX; }} onTouchEnd={(event) => {
        const delta = event.changedTouches[0].clientX - touchStart.current;
        if (Math.abs(delta) > 40) move(delta < 0 ? 1 : -1);
      }}><button className="photo-close" onClick={() => setSelected(null)} aria-label={t(locale, "Close photos")}>×</button>
        <Image src={asset(unique[selected])} alt={t(locale, captions[unique[selected]] || title)} width={1600} height={1200} sizes="95vw" />
        <div className="photo-controls"><button onClick={() => move(-1)} aria-label={t(locale, "Previous photo")}>←</button><p><strong>{t(locale, selected + 1)} / {t(locale, unique.length)}</strong>{captions[unique[selected]] && <span>{t(locale, captions[unique[selected]])}</span>}</p><button onClick={() => move(1)} aria-label={t(locale, "Next photo")}>→</button></div>
      </div>}
    </dialog>
  </div>;
}

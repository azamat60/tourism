
import { translate as t } from '@/lib/i18n';
import type { ElementType } from 'react';
import Image from 'next/image';
import { asset, startingPrice } from '@/lib/mock-data';
import type { Tour } from '@/lib/mock-types';
import type { Locale } from '@/lib/content';
import { localeHref } from '@/lib/links';
import { ArrowIcon } from './SiteChrome';

export function ContentBlocks({ blocks, locale = 'en' }: { locale?: Locale; blocks: { tag: string; text: string }[] }) {
  return <>{blocks.map((block, index) => {
    const Tag = block.tag as ElementType;
    return <Tag key={index}>{t(locale, block.text)}</Tag>;
  })}</>;
}

export function PageHero({ label, title, description, image, locale = 'en' }: { locale?: Locale; label: string; title: string; description?: string; image?: string }) {
  return <section className={`${image ? 'interior-hero' : 'interior-intro'}${title.length > 60 ? ' has-long-title' : ''}`}>
    {image && <><Image src={asset(image)} alt="" fill priority sizes="100vw" /><div className="interior-hero-shade" /></>}
    <div className={`page-width ${image ? 'interior-hero-content' : ''}`}>
      <p className={`eyebrow ${image ? 'light' : 'dark'}`}><span className="eyebrow-line" />{t(locale, label)}</p>
      <h1>{t(locale, title)}</h1>{description && <p>{t(locale, description)}</p>}
    </div>
  </section>;
}

export function TourCard({ tour, locale, index = 0 }: { tour: Tour; locale: Locale; index?: number }) {
  const price = startingPrice(tour);
  return <a className="tour-card" href={localeHref(locale, `/tours/${tour.slug}/`)}>
    <div className="tour-image-wrap"><Image src={asset(tour.image)} alt={t(locale, tour.title)} width={1448} height={1086} sizes="(max-width: 680px) 100vw, 33vw" /><span className="tour-tag">{t(locale, tour.category)}</span></div>
    <div className="tour-info"><div className="tour-meta"><span>{t(locale, tour.locations.join(', '))}</span><span>{t(locale, tour.duration)}</span></div>
      <div className="tour-heading"><span className="tour-number">{t(locale, String(index + 1).padStart(2, '0'))}</span><h3>{t(locale, tour.title)}</h3></div>
      <p className="tour-blurb">{t(locale, tour.blurb)}</p><div className="tour-card-price">{price == null ? <strong>{t(locale, "Tailor-made")}</strong> : <><span>{t(locale, "From")}</span><strong>${t(locale, price)}</strong><span>{t(locale, "/ person")}</span></>}</div>
      <span className="text-link">{t(locale, "View tour")}<ArrowIcon diagonal /></span>
    </div>
  </a>;
}

import Image from 'next/image';
import SiteChrome, { ArrowIcon, localeHref } from '@/components/SiteChrome';
import CatalogFilters from '@/components/CatalogFilters';
import { content, type Locale } from '@/lib/content';
import { expandedCopy } from '@/lib/expandedCopy';

export default function TourCatalog({ locale }: { locale: Locale }) {
  const copy = content[locale];
  const ui = expandedCopy[locale];
  return <SiteChrome locale={locale} copy={copy} path="/tours/">
    <section className="interior-hero catalog-hero"><Image src="/images/hero.jpg" alt="" fill priority sizes="100vw" /><div className="interior-hero-shade" /><div className="page-width interior-hero-content"><p className="eyebrow light"><span className="eyebrow-line" />{ui.catalogLabel}</p><h1>{ui.catalogTitle}</h1><p>{ui.catalogIntro}</p></div></section>
    <section className="catalog-section"><CatalogFilters locale={locale} /></section>
    <section className="catalog-closing"><div className="page-width"><div><p className="eyebrow light"><span className="eyebrow-line" />{ui.datesLabel}</p><h2>{ui.datesTitle}</h2></div><a className="button button-light" href={localeHref(locale, '/departures/')}>{ui.navDates}<ArrowIcon diagonal /></a></div></section>
  </SiteChrome>;
}

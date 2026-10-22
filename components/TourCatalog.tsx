'use client';

import { useTranslation } from './SiteData';


import SiteChrome from './SiteChrome';
import CatalogFilters from './CatalogFilters';
import { PageHero } from './ContentBlocks';
import { content, type Locale } from '@/lib/content';

export default function TourCatalog({ locale }: { locale: Locale }) {
  const t = useTranslation();

  return <SiteChrome locale={locale} copy={content[locale]} path="/tours/">
    <PageHero locale={locale} label={t(locale, "Our adventures")} title={t(locale, "Tours in Kyrgyzstan")} description={t(locale, "Horseback treks & multi-day adventures")} image="/images/hero.jpg" />
    <section className="catalog-section"><CatalogFilters locale={locale} /></section>
  </SiteChrome>;
}

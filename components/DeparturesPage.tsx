'use client';

import { useTranslation } from './SiteData';


import SiteChrome, { localeHref } from './SiteChrome';
import DepartureExplorer from './DepartureExplorer';
import { PageHero } from './ContentBlocks';
import { content, type Locale } from '@/lib/content';

export default function DeparturesPage({ locale }: { locale: Locale }) {
  const t = useTranslation();

  return <SiteChrome locale={locale} copy={content[locale]} path="/open-tours/"><PageHero locale={locale} label={t(locale, "Group departures")} title={t(locale, "Join a Group")} description={t(locale, "Join an upcoming booked tour - no experience needed! Ride with other travellers and share the trail.")} /><section className="departures-section"><DepartureExplorer locale={locale} /></section><section className="catalog-closing"><div className="page-width"><div><h2>{t(locale, "Don't see your dates?")}</h2><p>{t(locale, "Tours can be created for any day — tell us when you're travelling and we'll try to match you with a group.")}</p></div><a className="button button-light" href={localeHref(locale, '/booking/')}>{t(locale, "Request a date")}</a></div></section></SiteChrome>;
}

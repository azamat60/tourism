'use client';

import { useCatalog, useTranslation } from './SiteData';


import SiteChrome from './SiteChrome';
import BookingForm from './BookingForm';
import { PageHero } from './ContentBlocks';
import { content, type Locale } from '@/lib/content';


export default function BookingPage({ locale }: { locale: Locale }) {
  const { pages } = useCatalog();
  const t = useTranslation();

  const blocks = pages.booking.sections[0].blocks;
  return <SiteChrome locale={locale} copy={content[locale]} path="/booking/"><PageHero locale={locale} label={t(locale, "Plan your trip")} title={t(locale, blocks[0].text)} description={t(locale, blocks[1].text)} /><section className="booking-section"><BookingForm locale={locale} /></section></SiteChrome>;
}

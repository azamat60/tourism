
import { translate as t } from '@/lib/i18n';
import SiteChrome from './SiteChrome';
import BookingForm from './BookingForm';
import { PageHero } from './ContentBlocks';
import { content, type Locale } from '@/lib/content';
import pages from '@/lib/mocks/pages.mock.json';

export default function BookingPage({ locale }: { locale: Locale }) {
  const blocks = pages.booking.sections[0].blocks;
  return <SiteChrome locale={locale} copy={content[locale]} path="/booking/"><PageHero locale={locale} label={t(locale, "Plan your trip")} title={t(locale, blocks[0].text)} description={t(locale, blocks[1].text)} /><section className="booking-section"><BookingForm locale={locale} /></section></SiteChrome>;
}

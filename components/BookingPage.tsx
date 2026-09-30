import SiteChrome from '@/components/SiteChrome';
import BookingForm from '@/components/BookingForm';
import { content, type Locale } from '@/lib/content';
import { expandedCopy } from '@/lib/expandedCopy';

export default function BookingPage({ locale }: { locale: Locale }) {
  const copy = content[locale];
  const ui = expandedCopy[locale];
  return <SiteChrome locale={locale} copy={copy} path="/booking/">
    <section className="interior-intro booking-intro"><div className="page-width"><p className="eyebrow dark"><span className="eyebrow-line" />{ui.bookingLabel}</p><h1>{ui.bookingTitle}</h1><p>{ui.bookingIntro}</p></div></section>
    <section className="booking-section"><BookingForm locale={locale} /></section>
  </SiteChrome>;
}

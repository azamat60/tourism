'use client';

import { translate as t } from '@/lib/i18n';

import { useSyncExternalStore } from 'react';
import SiteChrome, { localeHref } from './SiteChrome';
import { PageHero } from './ContentBlocks';
import { content, type Locale } from '@/lib/content';
import { useBrowserQuery } from '@/lib/browser-state';
import { formatDate, getTour } from '@/lib/mock-data';
import { getReceipt } from '@/lib/mock-service';
import { site } from '@/lib/mocks/site.mock';

const subscribe = () => () => {};
export default function SuccessPage({ locale, reservation = false }: { locale: Locale; reservation?: boolean }) {
  const params = useBrowserQuery();
  const ready = useSyncExternalStore(subscribe, () => true, () => false);
  const receipt = ready && reservation ? getReceipt(params.get('reservationId') || '') : undefined;
  const tour = receipt ? getTour(receipt.tourSlug) : undefined;
  return <SiteChrome locale={locale} copy={content[locale]} path={reservation ? '/reserve-success/' : '/success/'}>
    <PageHero locale={locale} label={t(locale, "Your adventure")} title={t(locale, reservation ? receipt ? 'Demo reservation saved' : 'Reservation summary' : 'Booking Request Received!')} description={t(locale, reservation ? 'No payment has been taken. This is a local simulation.' : 'Your demo request was saved in this browser. No email or WhatsApp message has been sent.')} />
    <section className="section-pad page-width source-receipt">
      {reservation && !receipt && <p role="status">{t(locale, "No local reservation found. Complete a demo reservation in this browser to see your receipt.")}</p>}
      {receipt && <><p className="eyebrow dark">{t(locale, "SIMULATED · ")}{t(locale, receipt.id)}</p><h2>{t(locale, receipt.tourTitle)}</h2><p>{t(locale, formatDate(receipt.start, locale))} – {t(locale, formatDate(receipt.end, locale))}</p><p>{t(locale, receipt.travelers)} {t(locale, " travelers")}</p><dl><div><dt>{t(locale, "Tour subtotal")}</dt><dd>${t(locale, receipt.quote.base.toFixed(2))}</dd></div><div><dt>{t(locale, "Add-ons")}</dt><dd>${t(locale, receipt.quote.extras.toFixed(2))}</dd></div><div><dt>{t(locale, "Total")}</dt><dd>${t(locale, receipt.quote.subtotal.toFixed(2))}</dd></div><div><dt>{t(locale, "Demo deposit")}</dt><dd>${t(locale, receipt.quote.deposit.toFixed(2))}</dd></div><div><dt>{t(locale, "Remaining on arrival (demo)")}</dt><dd>${t(locale, receipt.quote.remaining.toFixed(2))}</dd></div><div><dt>{t(locale, "Starting point")}</dt><dd>{t(locale, tour?.startingPoint)}</dd></div><div><dt>{t(locale, "Ending point")}</dt><dd>{t(locale, tour?.endingPoint)}</dd></div></dl>{tour?.importantNotes && <p className="source-preline">{t(locale, tour.importantNotes)}</p>}{tour?.passportNeeded && <p>{t(locale, "Passport details are required for border permits. No documents are collected by this demo.")}</p>}<div className="source-toolbar"><button className="source-action" onClick={() => window.print()}>{t(locale, "Download Receipt / Print")}</button><a className="source-action" href={site.preparationGuide} target="_blank" rel="noopener noreferrer">{t(locale, "Guest Preparation Guide (PDF)")}</a></div></>}
      {receipt && <><p>{t(locale, "Demo deposit currency: ")}{t(locale, receipt.currency)} {t(locale, receipt.chargeAmount.toFixed(2))}</p><h2>{t(locale, "What’s Next?")}</h2><div className="source-columns"><article><h3>{t(locale, "Prepare for your adventure")}</h3><p>{t(locale, "Review the tour information and packing list (sent by email).")}</p><a href={site.preparationGuide}>{t(locale, "Guest Preparation Guide (PDF)")}</a></article><article><h3>{t(locale, "We’ll see you soon!")}</h3><p>{t(locale, "If you have any questions, feel free to contact us.")}</p></article></div></>}
      <div className="source-toolbar"><a className="button button-dark" href={localeHref(locale)}>{t(locale, "Return Home")}</a><a className="button button-dark" href={localeHref(locale, '/tours/')}>{t(locale, "Browse tours")}</a></div><h3>{t(locale, "Need Help?")}</h3><p>{t(locale, "We’re here for you.")}</p><p>{t(locale, "Need a faster answer? ")}<a href={`https://wa.me/${site.whatsappNumber}`} target="_blank" rel="noopener noreferrer">{t(locale, "Message us on WhatsApp")}</a></p><p>{site.email && <><a href={`mailto:${site.email}`}>{t(locale, site.email)}</a> · </>}{t(locale, site.phone)}</p>
    </section>
  </SiteChrome>;
}

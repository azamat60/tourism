'use client';

import { useCatalog, useTranslation } from './SiteData';

import { useEffect, useState, useSyncExternalStore } from 'react';
import type { Receipt } from '@/lib/booking-service';
import SiteChrome, { localeHref } from './SiteChrome';
import { PageHero } from './ContentBlocks';
import { content, type Locale } from '@/lib/content';
import { useBrowserQuery } from '@/lib/browser-state';
import { formatDate } from '@/lib/catalog';
import { getReceipt } from '@/lib/booking-service';

const subscribeReady = () => () => {};
export default function SuccessPage({ locale, reservation = false }: { locale: Locale; reservation?: boolean }) {
  const { getTour, site } = useCatalog();
  const t = useTranslation();

  const params = useBrowserQuery();
  const id = params.get('reservationId');
  const ready = useSyncExternalStore(
    subscribeReady,
    () => true,
    () => false,
  );
  const [receipt, setReceipt] = useState<Receipt | undefined>();
  const [loading, setLoading] = useState(reservation);
  useEffect(() => {
    let active = true;
    if (id)
      getReceipt(id)
        .then((value) => {
          if (active) {
            setReceipt(value);
            setLoading(false);
          }
        })
        .catch(() => {
          if (active) setLoading(false);
        });
    return () => {
      active = false;
    };
  }, [id]);
  const tour = receipt ? getTour(receipt.tourSlug) : undefined;
  return (
    <SiteChrome locale={locale} copy={content[locale]} path={reservation ? '/reserve-success/' : '/success/'}>
      <PageHero
        locale={locale}
        label={t(locale, 'Your adventure')}
        title={t(
          locale,
          reservation
            ? receipt
              ? 'Reservation request received'
              : 'Reservation summary'
            : 'Booking Request Received!',
        )}
        description={t(
          locale,
          reservation
            ? 'No payment has been taken. Our team will confirm availability and arrange your deposit.'
            : 'Your request has been received. Our team will contact you by email or WhatsApp.',
        )}
      />
      <section className="section-pad page-width source-receipt">
        {reservation && ready && !receipt && (!id || !loading) && (
          <p role="status">
            {t(locale, 'Receipt unavailable. Open the receipt in the browser used for your reservation.')}
          </p>
        )}
        {receipt && (
          <>
            <p className="eyebrow dark">
              {t(locale, 'RESERVATION · ')}
              {t(locale, receipt.id)}
            </p>
            <h2>{t(locale, receipt.tourTitle)}</h2>
            <p>
              {t(locale, formatDate(receipt.start, locale))} – {t(locale, formatDate(receipt.end, locale))}
            </p>
            <p>
              {t(locale, receipt.travelers)} {t(locale, ' travelers')}
            </p>
            <dl>
              <div>
                <dt>{t(locale, 'Tour subtotal')}</dt>
                <dd>${t(locale, receipt.quote.base.toFixed(2))}</dd>
              </div>
              <div>
                <dt>{t(locale, 'Add-ons')}</dt>
                <dd>${t(locale, receipt.quote.extras.toFixed(2))}</dd>
              </div>
              <div>
                <dt>{t(locale, 'Total')}</dt>
                <dd>${t(locale, receipt.quote.subtotal.toFixed(2))}</dd>
              </div>
              <div>
                <dt>{t(locale, 'Deposit due')}</dt>
                <dd>${t(locale, receipt.quote.deposit.toFixed(2))}</dd>
              </div>
              <div>
                <dt>{t(locale, 'Remaining after deposit')}</dt>
                <dd>${t(locale, receipt.quote.remaining.toFixed(2))}</dd>
              </div>
              <div>
                <dt>{t(locale, 'Starting point')}</dt>
                <dd>{t(locale, tour?.startingPoint)}</dd>
              </div>
              <div>
                <dt>{t(locale, 'Ending point')}</dt>
                <dd>{t(locale, tour?.endingPoint)}</dd>
              </div>
            </dl>
            {tour?.importantNotes && <p className="source-preline">{t(locale, tour.importantNotes)}</p>}
            {tour?.passportNeeded && (
              <p>
                {t(
                  locale,
                  'Passport details are required for border permits. Our team will explain how to submit them securely.',
                )}
              </p>
            )}
            <div className="source-toolbar">
              <button className="source-action" onClick={() => window.print()}>
                {t(locale, 'Download Receipt / Print')}
              </button>
              <a className="source-action" href={site.preparationGuide} target="_blank" rel="noopener noreferrer">
                {t(locale, 'Guest Preparation Guide (PDF)')}
              </a>
            </div>
          </>
        )}
        {receipt && (
          <>
            <p>
              {t(locale, 'Currency: ')}
              {t(locale, receipt.currency)} {t(locale, receipt.chargeAmount.toFixed(2))}
            </p>
            <h2>{t(locale, 'What’s Next?')}</h2>
            <div className="source-columns">
              <article>
                <h3>{t(locale, 'Prepare for your adventure')}</h3>
                <p>{t(locale, 'Review the tour information and packing list below.')}</p>
                <a href={site.preparationGuide}>{t(locale, 'Guest Preparation Guide (PDF)')}</a>
              </article>
              <article>
                <h3>{t(locale, 'We’ll see you soon!')}</h3>
                <p>{t(locale, 'If you have any questions, feel free to contact us.')}</p>
              </article>
            </div>
          </>
        )}
        <div className="source-toolbar">
          <a className="button button-dark" href={localeHref(locale)}>
            {t(locale, 'Return Home')}
          </a>
          <a className="button button-dark" href={localeHref(locale, '/tours/')}>
            {t(locale, 'Browse tours')}
          </a>
        </div>
        <h3>{t(locale, 'Need Help?')}</h3>
        <p>{t(locale, 'We’re here for you.')}</p>
        <p>
          {t(locale, 'Need a faster answer? ')}
          <a href={`https://wa.me/${site.whatsappNumber}`} target="_blank" rel="noopener noreferrer">
            {t(locale, 'Message us on WhatsApp')}
          </a>
        </p>
        <p>
          {site.email && (
            <>
              <a href={`mailto:${site.email}`}>{t(locale, site.email)}</a> ·{' '}
            </>
          )}
          {t(locale, site.phone)}
        </p>
      </section>
    </SiteChrome>
  );
}

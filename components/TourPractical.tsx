
import { translate as t } from '@/lib/i18n';
import type { CSSProperties } from 'react';
import type { Locale } from '@/lib/content';
import type { Tour } from '@/lib/mock-types';
import { startingPrice } from '@/lib/mock-data';
import { site } from '@/lib/mocks/site.mock';
import { ArrowIcon, localeHref } from './SiteChrome';
import TourIcon, { type TourIconName } from './TourIcon';

export function TourBookingBar({ tour, locale }: { tour: Tour; locale: Locale }) {
  const price = startingPrice(tour);
  return <div className="detail-booking-bar"><div className="page-width detail-booking-inner">
    <div className="detail-starting-price">{price == null ? <strong>{t(locale, "Tailor-made")}</strong> : <><span>{t(locale, "From")}</span><strong>${t(locale, price)}</strong><span>{t(locale, "/ person")}</span></>}</div>
    <div className="detail-booking-actions"><a className="button button-dark" href={price == null ? localeHref(locale, `/booking/?tour=${tour.slug}`) : '#departure-dates'}>{t(locale, price == null ? 'Plan your private tour' : 'See dates & reserve')}<ArrowIcon diagonal /></a><a className="text-link" href={localeHref(locale, '/tours/')}>{t(locale, "All tours")}<ArrowIcon /></a></div>
  </div></div>;
}

export function TourFacts({ tour, locale = 'en' }: { tour: Tour; locale?: Locale }) {
  const facts: { label: string; value?: string; icon: TourIconName }[] = [
    { label: 'Duration', value: tour.duration, icon: 'clock' },
    { label: 'Distance', value: tour.distance, icon: 'route' },
    { label: 'Season', value: tour.season, icon: 'sun' },
    { label: 'Horse riding', value: tour.horse ? 'Yes' : 'No', icon: 'horse' },
    { label: 'Location', value: tour.locations.join(', '), icon: 'pin' },
    { label: 'Reception', value: tour.reception, icon: 'signal' },
    { label: 'Starting point', value: tour.startingPoint, icon: 'flag' },
    { label: 'Ending point', value: tour.endingPoint, icon: 'pin' },
  ];
  return <><p className="eyebrow dark">{t(locale, "At a glance")}</p><h2 className="practical-heading">{t(locale, "Your trip essentials")}</h2><dl className="source-facts">{facts.filter((fact) => fact.value).map((fact) => <div key={fact.label}><dt><TourIcon name={fact.icon} /><span>{t(locale, fact.label)}</span></dt><dd>{t(locale, fact.value)}</dd></div>)}</dl></>;
}

export function TourInclusions({ tour, locale = 'en' }: { tour: Tour; locale?: Locale }) {
  return <div className="inclusion-grid">{[
    { title: 'What’s included', items: tour.inclusions, icon: 'check' as const, className: 'included' },
    { title: 'Not included', items: tour.exclusions, icon: 'minus' as const, className: 'excluded' },
  ].map((group) => <article className={`inclusion-card ${group.className}`} key={group.title}><h2><span className="inclusion-mark"><TourIcon name={group.icon} /></span>{t(locale, group.title)}</h2><ul>{group.items?.map((item) => <li key={item}><TourIcon name={group.icon} /><span>{t(locale, item)}</span></li>)}</ul></article>)}</div>;
}

export function TourPricing({ tour, locale = 'en' }: { tour: Tour; locale?: Locale }) {
  const entries = Object.entries(tour.pricesEnglish).sort(([a], [b]) => Number(a) - Number(b));
  const lowestPrice = Math.min(...entries.map(([, value]) => Number(value)));
  const bestPriceIndex = entries.findLastIndex(([, value]) => Number(value) === lowestPrice);
  const columns = { '--price-columns': entries.length > 5 ? 3 : entries.length } as CSSProperties;
  return <><div className="pricing-heading"><div><p className="eyebrow dark">{t(locale, "Plan your group")}</p><h2 className="practical-heading">{t(locale, "Prices per person · USD")}</h2></div><p>{t(locale, "Find the price for your group size.")}</p></div>
    {entries.length ? <div className="source-price-tiers" style={columns}>{entries.map(([people, value], index) => <div className={`source-price-tier ${index === bestPriceIndex && entries.length > 1 ? 'is-best-price' : ''}`} key={people}>
      <span className="price-tier-group"><TourIcon name="users" />{t(locale, people)}{t(locale, index === entries.length - 1 && entries.length > 1 ? '+' : '')} {t(locale, people === '1' ? 'person' : 'people')}</span>
      <div className="price-tier-amount"><strong>${t(locale, value)}</strong><span>{t(locale, "/ person")}</span></div><span className="price-tier-note">{t(locale, index === bestPriceIndex && entries.length > 1 ? 'Best group price' : 'USD · per traveler')}</span>
    </div>)}</div> : <p>{t(locale, "Contact us for a quote.")}</p>}
    {Boolean(tour.optionalAddOns?.length) && <div className="tour-addons"><h3>{t(locale, "Optional add-ons")}</h3><div className="tour-addon-grid">{tour.optionalAddOns?.map((item) => <article key={item.name}><span className="addon-icon"><TourIcon name="plus" /></span><div><h4>{t(locale, item.name)}</h4><p className="addon-price">${t(locale, item.cost)}<span>{t(locale, item.billing === 'perDay' ? ' per day' : '')}{t(locale, item.scope === 'group' ? ' per group' : ' per person')}</span></p><p>{t(locale, item.description)}</p></div></article>)}</div></div>}
    <a className="source-action preparation-link" href={site.preparationGuide} target="_blank" rel="noopener noreferrer"><TourIcon name="download" />{t(locale, "Guest Preparation Guide")}<span>{t(locale, "PDF")}<ArrowIcon diagonal /></span></a>
  </>;
}

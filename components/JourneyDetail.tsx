'use client';

import { useCatalog, useTranslation } from './SiteData';


import Image from './SiteImage';
import Breadcrumbs from './Breadcrumbs';
import SiteChrome, { ArrowIcon, localeHref } from './SiteChrome';
import { PageHero, TourCard } from './ContentBlocks';
import DepartureExplorer from './DepartureExplorer';
import PhotoGallery from './PhotoGallery';
import RouteExplorer from './RouteExplorer';
import { TourBookingBar, TourFacts, TourInclusions, TourPricing } from './TourPractical';
import { content, type Locale } from '@/lib/content';
import { introduction, itineraryFor } from '@/lib/catalog';


export default function JourneyDetail({ locale, slug }: { locale: Locale; slug: string }) {
  const { activeTours, asset, getTour, tourPage } = useCatalog();
  const t = useTranslation();

  const tour = getTour(slug)!;
  const days = itineraryFor(tour);
  const photos = [...new Set([...(tour.carousel_images || []), ...(tour.images || []), tour.image])];
  return <SiteChrome locale={locale} copy={content[locale]} path={`/tours/${tour.slug}/`}>
    <PageHero locale={locale} label={t(locale, tour.category || 'Kyrgyzstan')} title={t(locale, tour.title)} description={t(locale, tour.blurb)} image={asset(tour.image)} />
    <Breadcrumbs locale={locale} parent="tours" title={t(locale, tour.title)} />
    <TourBookingBar tour={tour} locale={locale} />
    <section className="detail-overview page-width"><div className="detail-intro"><p className="eyebrow dark">{t(locale, "Overview")}</p><h2>{t(locale, tourPage.aboutTitle)}</h2><p className="source-preline">{t(locale, introduction(tour))}</p>{tour.importantNotes && <p className="source-preline source-notice">{t(locale, tour.importantNotes)}</p>}<a className="text-link" href={localeHref(locale, `/booking/?tour=${tour.slug}`)}>{t(locale, "Ask about this tour")}<ArrowIcon diagonal /></a></div><div className="detail-photo-pair"><div><Image src={asset(photos[0])} alt={t(locale, tour.title)} width={1448} height={1086} sizes="50vw" /></div><div><Image src={asset(photos[1] || tour.image)} alt={t(locale, tour.locations.join(', '))} width={1448} height={1086} sizes="30vw" /></div></div></section>
    <section className="section-pad page-width tour-essentials"><TourFacts locale={locale} tour={tour} />{tour.horse && <p className="riding-note">{t(locale, tourPage.ridingNote)}</p>}{tour.passportNeeded && <p className="source-notice"><strong>{t(locale, "Passport required: ")}</strong>{t(locale, tourPage.passportNote)}</p>}</section>
    {days.length > 0 && <section className="detail-itinerary section-pad"><div className="page-width"><p className="eyebrow dark">{t(locale, "Day by day")}</p><h2>{t(locale, tourPage.itineraryTitle)}</h2><div className="stage-list">{days.map((day, index) => <article className="stage" key={index} id={`day-${index + 1}`}><div className="stage-index"><span>{t(locale, String(index + 1).padStart(2, '0'))}</span><span className="stage-dot" /></div><div><span className="stage-day">{t(locale, "Day ")}{t(locale, index + 1)}</span><h3>{t(locale, day.title)}</h3>{day.place && <p>{t(locale, "Overnight: ")}{t(locale, day.place)}</p>}<p>{t(locale, [day.distanceKm ? `${day.distanceKm} km` : '', day.durationHours ? `${day.durationHours} hours` : '', day.maxAltitude ? `Highest: ${day.maxAltitude} m` : '', day.sleepAltitude ? `Overnight: ${day.sleepAltitude} m` : ''].filter(Boolean).join(' · '))}</p><ul>{day.notes.split('\n').filter(Boolean).map((line, lineIndex) => <li key={lineIndex}>{t(locale, line)}</li>)}</ul>{Boolean(day.waypoints?.length) && <ol>{day.waypoints!.map((point, pointIndex) => <li key={pointIndex}>{t(locale, point.time)} {t(locale, point.name)}{t(locale, point.note ? ` — ${point.note}` : '')}</li>)}</ol>}<PhotoGallery locale={locale} images={day.images || []} captions={tour.imageCaptions} title={t(locale, `Day ${index + 1} photos`)} /></div></article>)}</div></div></section>}
    <RouteExplorer locale={locale} days={days} />
    {Boolean(tour.inclusions?.length || tour.exclusions?.length) && <section className="section-pad page-width"><TourInclusions locale={locale} tour={tour} /></section>}
    <section className="section-pad page-width tour-pricing"><TourPricing locale={locale} tour={tour} /></section>
    <section className="section-pad page-width tour-photo-section"><PhotoGallery locale={locale} images={photos} captions={tour.imageCaptions} title={t(locale, "Tour photos")} /></section>
    {<section className="section-pad"><div className="page-width"><p className="eyebrow dark">{t(locale, "Join a departure")}</p><h2>{t(locale, tourPage.departuresTitle)}</h2><p>{t(locale, tourPage.departuresIntro)}</p></div><DepartureExplorer locale={locale} tourSlug={tour.slug} /></section>}
    <section className="section-pad page-width"><h2>{t(locale, tourPage.pillarsTitle)}</h2><div className="source-columns">{tourPage.pillars.map((item, index) => <article key={item.title}><h3>{t(locale, item.title)}</h3><p>{t(locale, index === 3 && tour.durationDays ? `${tour.durationDays} days of ` : '')}{t(locale, item.text)}</p></article>)}</div><h2>{t(locale, tourPage.helpTitle)}</h2><p>{t(locale, tourPage.helpText)}</p><a className="text-link" href={localeHref(locale, `/booking/?tour=${tour.slug}`)}>{t(locale, "Send us a message")}</a></section>
    <section className="section-pad page-width"><h2>{t(locale, "More adventures")}</h2><div className="tour-grid">{activeTours.filter((item) => item.slug !== tour.slug).slice(0, 3).map((item, index) => <TourCard key={item.slug} tour={item} locale={locale} index={index} />)}</div></section>
  </SiteChrome>;
}

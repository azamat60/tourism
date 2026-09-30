import Image from 'next/image';
import SiteChrome, { ArrowIcon, localeHref } from '@/components/SiteChrome';
import { content, type Locale } from '@/lib/content';
import { innerCopy } from '@/lib/innerCopy';
import { expandedCopy } from '@/lib/expandedCopy';
import { formatDepartureDate, sampleDepartures } from '@/lib/departures';
import { stageRanges, tourStages } from '@/lib/tourStages';
import { tourBasics, tourSlugs, type TourSlug } from '@/lib/tours';

function dayLabel(locale: Locale, range: string) {
  const ui = innerCopy[locale];
  if (locale === 'zh') return `第 ${range} 天`;
  return `${range.includes('–') ? ui.days : ui.day} ${range}`;
}

export default function JourneyDetail({ locale, slug }: { locale: Locale; slug: TourSlug }) {
  const copy = content[locale];
  const ui = innerCopy[locale];
  const extra = expandedCopy[locale];
  const tour = tourBasics(copy, slug);
  const stages = tourStages[locale][slug];
  const related = tourSlugs.filter((item) => item !== slug);
  const planHref = localeHref(locale, `/plan/?tour=${slug}`);
  const homeHref = localeHref(locale, '/tours/');
  const departures = sampleDepartures.filter((item) => item.tour === slug).slice(0, 2);

  return (
    <SiteChrome locale={locale} copy={copy} path={`/tours/${slug}/`}>
      <section className="detail-hero">
        <Image src={tour.image} alt="" fill priority sizes="100vw" />
        <div className="detail-hero-shade" />
        <div className="page-width detail-hero-inner">
          <a className="detail-back" href={homeHref}><span aria-hidden="true">←</span>{ui.back}</a>
          <div className="detail-hero-copy">
            <p className="eyebrow light"><span className="eyebrow-line" />{tour.tag}</p>
            <h1>{tour.title}</h1>
            <p>{tour.description}</p>
          </div>
          <div className="detail-hero-meta"><span>{tour.place}</span><span>{tour.days} {copy.days} · {tour.nights} {ui.nights}</span><span>{ui.private}</span></div>
        </div>
      </section>

      <section className="detail-overview page-width">
        <div className="detail-intro">
          <p className="eyebrow dark"><span className="eyebrow-line" />{ui.journeyLabel} / {tour.number}</p>
          <h2>{ui.overview}</h2>
          <p>{tour.description} {copy.smallDescription}</p>
          <a href={planHref} className="text-link">{ui.planThis}<ArrowIcon diagonal /></a>
        </div>
        <div className="detail-photo-pair">
          <div><Image src={tour.image} alt={tour.place} width={1448} height={1086} sizes="(max-width: 680px) 100vw, 34vw" /></div>
          <div><Image src="/images/hero.jpg" alt="" width={1672} height={941} sizes="(max-width: 680px) 100vw, 22vw" /></div>
        </div>
      </section>

      <section className="detail-itinerary section-pad">
        <div className="page-width detail-itinerary-grid">
          <div className="detail-itinerary-head"><p className="eyebrow dark"><span className="eyebrow-line" />{ui.itinerary}</p><h2>{ui.itinerary}</h2><p>{ui.routeNote}</p></div>
          <div className="stage-list">
            {stages.map((stage, index) => <article className="stage" key={stage.title}><div className="stage-index"><span>{String(index + 1).padStart(2, '0')}</span><span className="stage-dot" /></div><div><span className="stage-day">{dayLabel(locale, stageRanges[slug][index])}</span><h3>{stage.title}</h3><p>{stage.description}</p></div></article>)}
          </div>
        </div>
      </section>

      <section className="detail-facts section-pad">
        <div className="page-width"><p className="eyebrow dark"><span className="eyebrow-line" />{ui.details}</p><div className="fact-grid"><div><span>{ui.duration}</span><strong>{tour.days} {copy.days} / {tour.nights} {ui.nights}</strong></div><div><span>{ui.destination}</span><strong>{tour.place}</strong></div><div><span>{ui.format}</span><strong>{ui.private}</strong></div></div><p className="detail-note">{ui.routeNote}</p></div>
      </section>

      <section className="detail-practical section-pad"><div className="page-width"><p className="eyebrow dark"><span className="eyebrow-line" />{ui.details}</p><div className="practical-grid"><article><span>01</span><h2>{extra.includedTitle}</h2><p>{extra.includedText}</p></article><article><span>02</span><h2>{extra.practicalTitle}</h2><p>{extra.practicalText}</p><a className="text-link" href={localeHref(locale, '/faq/')}>{extra.navFaq}<ArrowIcon diagonal /></a></article></div></div></section>

      <section className="detail-departures section-pad"><div className="page-width"><div className="section-head"><div><p className="eyebrow dark"><span className="eyebrow-line" />{extra.datesLabel}</p><h2>{extra.datesTitle}</h2></div><p>{extra.datesIntro}</p></div><div className="demo-banner"><span aria-hidden="true">✳</span><p>{extra.demoNotice}</p></div><div className="detail-date-list">{departures.map((item) => <div key={item.id}><div><span>{extra.date}</span><strong>{formatDepartureDate(locale, item.start)}</strong></div><div><span>{extra.price}</span><strong>${item.price}</strong></div><a href={localeHref(locale, `/booking/?tour=${slug}&date=${item.start}`)}>{extra.enquire}<ArrowIcon diagonal /></a></div>)}</div><a href={localeHref(locale, '/departures/')} className="text-link detail-all-dates">{extra.navDates}<ArrowIcon diagonal /></a></div></section>

      <section className="detail-plan"><div className="page-width detail-plan-inner"><div><p className="eyebrow light"><span className="eyebrow-line" />{ui.planThis}</p><h2>{ui.planHeading}</h2><p>{ui.planDescription}</p></div><a className="button button-light" href={planHref}>{ui.planThis}<ArrowIcon diagonal /></a></div></section>

      <section className="detail-related section-pad"><div className="page-width"><div className="section-head"><div><p className="eyebrow dark"><span className="eyebrow-line" />{ui.moreJourneys}</p><h2>{ui.moreJourneys}</h2></div></div><div className="related-grid">{related.map((item) => { const other = tourBasics(copy, item); return <a href={localeHref(locale, `/tours/${item}/`)} className="related-card" key={item}><div><Image src={other.image} alt={other.place} width={1448} height={1086} sizes="(max-width: 680px) 100vw, 45vw" /></div><span>{other.place} · {other.days} {copy.days}</span><h3>{other.title}<ArrowIcon diagonal /></h3></a>; })}</div></div></section>
    </SiteChrome>
  );
}

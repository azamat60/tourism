import Image from 'next/image';
import type { Copy, Locale } from '@/lib/content';
import SiteChrome, { ArrowIcon, MountainMark, WhatsAppIcon, localeHref, whatsappLink } from '@/components/SiteChrome';
import { expandedCopy } from '@/lib/expandedCopy';

function TourCard({ image, number, title, place, tag, description, days, slug, locale, copy }: {
  image: string; number: string; title: string; place: string; tag: string; description: string; days: number; slug: string; locale: Locale; copy: Copy;
}) {
  return (
    <a className="tour-card" href={localeHref(locale, `/tours/${slug}/`)} aria-label={`${copy.viewJourney}: ${title}`}>
      <div className="tour-image-wrap">
        <Image src={image} alt={place} width={1448} height={1086} sizes="(max-width: 680px) 100vw, 33vw" />
        <span className="tour-tag">{tag}</span>
      </div>
      <div className="tour-info">
        <div className="tour-meta"><span>{place}</span><span>{days} {copy.days}</span></div>
        <div className="tour-heading"><span className="tour-number">{number}</span><h3>{title}</h3></div>
        <p>{description}</p>
        <span className="text-link">{copy.viewJourney}<ArrowIcon diagonal /></span>
      </div>
    </a>
  );
}

export default function Home({ locale, copy }: { locale: Locale; copy: Copy }) {
  return (
    <SiteChrome locale={locale} copy={copy}>
        <section className="hero" aria-labelledby="hero-title">
          <Image className="hero-image" src="/images/hero.jpg" alt="" fill priority sizes="100vw" />
          <div className="hero-shade" />
          <div className="hero-inner page-width">
            <div className="hero-content">
              <p className="eyebrow light"><span className="eyebrow-line" />{copy.eyebrow}</p>
              <h1 id="hero-title">{copy.heroTitle}</h1>
              <p className="hero-description">{copy.heroDescription}</p>
              <a className="button button-light" href="#journeys">{copy.explore}<ArrowIcon diagonal /></a>
            </div>
            <div className="hero-bottom"><span className="hero-index">01 <span>/</span> 03</span><a href="#intro">{copy.scroll}<span className="scroll-line" /></a><span className="hero-location">42°06′ N &nbsp; 75°07′ E</span></div>
          </div>
        </section>

        <section className="intro page-width" id="intro">
          <div className="intro-kicker"><span className="asterisk">✳</span><span>{copy.smallLabel}</span></div>
          <div className="intro-copy"><h2>{copy.smallTitle}</h2><p>{copy.smallDescription}</p></div>
          <div className="intro-stamp" aria-hidden="true"><span>EXPLORE<br />KYRGYZSTAN</span><MountainMark /></div>
        </section>

        <section className="journeys section-pad" id="journeys">
          <div className="page-width">
            <div className="section-head"><div><p className="eyebrow dark"><span className="eyebrow-line" />{copy.toursLabel}</p><h2>{copy.toursTitle}</h2></div><p>{copy.toursDescription}</p></div>
            <div className="tour-grid">
              <TourCard image="/images/song-kul.jpg" number="01" title={copy.tour1Title} place={copy.tour1Place} tag={copy.tour1Tag} description={copy.tour1Description} days={3} slug="song-kul-escape" locale={locale} copy={copy} />
              <TourCard image="/images/kel-suu.jpg" number="02" title={copy.tour2Title} place={copy.tour2Place} tag={copy.tour2Tag} description={copy.tour2Description} days={5} slug="kel-suu-wilderness" locale={locale} copy={copy} />
              <TourCard image="/images/hero.jpg" number="03" title={copy.tour3Title} place={copy.tour3Place} tag={copy.tour3Tag} description={copy.tour3Description} days={7} slug="nomad-trail" locale={locale} copy={copy} />
            </div>
            <div className="journey-actions"><a className="text-link" href={localeHref(locale, '/tours/')}>{expandedCopy[locale].allTours}<ArrowIcon diagonal /></a><a className="text-link" href={localeHref(locale, '/departures/')}>{expandedCopy[locale].datesTitle}<ArrowIcon diagonal /></a></div>
          </div>
        </section>

        <section className="philosophy section-pad" id="about">
          <div className="page-width philosophy-grid">
            <div className="philosophy-title"><p className="eyebrow dark"><span className="eyebrow-line" />{copy.philosophyLabel}</p><h2>{copy.philosophyTitle}</h2><p>{copy.philosophyDescription}</p></div>
            <div className="values">
              <div className="value"><span>01</span><div><h3>{copy.value1Title}</h3><p>{copy.value1Description}</p></div><span className="value-mark">↗</span></div>
              <div className="value"><span>02</span><div><h3>{copy.value2Title}</h3><p>{copy.value2Description}</p></div><span className="value-mark">↗</span></div>
              <div className="value"><span>03</span><div><h3>{copy.value3Title}</h3><p>{copy.value3Description}</p></div><span className="value-mark">↗</span></div>
            </div>
          </div>
        </section>

        <section className="experience" id="experience">
          <div className="experience-visual"><Image src="/images/kel-suu.jpg" alt="" fill sizes="(max-width: 680px) 100vw, 50vw" /><span className="experience-frame" /></div>
          <div className="experience-content"><p className="eyebrow light"><span className="eyebrow-line" />{copy.experienceLabel}</p><h2>{copy.experienceTitle}</h2><p>{copy.experienceDescription}</p><a className="button button-outline" href={localeHref(locale, '/plan/')}>{copy.experienceLink}<ArrowIcon diagonal /></a></div>
        </section>

        <section className="contact section-pad" id="contact">
          <div className="page-width contact-inner"><div><p className="eyebrow dark"><span className="eyebrow-line" />{copy.contactLabel}</p><h2>{copy.contactTitle}</h2><p>{copy.contactDescription}</p></div><div className="contact-action"><a href={whatsappLink(copy.inquiryMessage)} target="_blank" rel="noopener noreferrer" className="button button-dark"><WhatsAppIcon />{copy.whatsapp}<ArrowIcon diagonal /></a><span>{copy.response}</span><a className="phone-link" href="tel:+996559773283">+996 559 773 283</a></div></div>
        </section>
    </SiteChrome>
  );
}

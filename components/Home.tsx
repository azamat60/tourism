import Image from 'next/image';
import type { Copy, Locale } from '@/lib/content';
import { languageNames, locales } from '@/lib/content';

const whatsappNumber = '996559773283';

function whatsappLink(message: string) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function ArrowIcon({ diagonal = false }: { diagonal?: boolean }) {
  return diagonal ? (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M4 16 16 4M6 4h10v10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ) : (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M3 10h13m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}

function MountainMark() {
  return (
    <svg className="brand-mark" aria-hidden="true" viewBox="0 0 50 50" fill="none">
      <circle cx="25" cy="25" r="23.5" stroke="currentColor" />
      <path d="m8 33 10-12 5 6 8-14 12 20H8Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="m27.8 19 3.2-6 4.1 7" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M13 37h24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function BrandName() {
  return <span className="brand-wordmark"><strong>Nomad</strong><em>Discovery Tours</em></span>;
}

function WhatsAppIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.5 3.5A11.8 11.8 0 0 0 12 .01C5.38.01 0 5.38 0 12c0 2.11.55 4.16 1.6 5.98L0 24l6.18-1.62A11.95 11.95 0 0 0 12 24c6.62 0 12-5.38 12-12 0-3.2-1.25-6.2-3.5-8.5ZM12 21.95c-1.78 0-3.52-.48-5.04-1.38l-.36-.21-3.75.98 1-3.65-.24-.38A9.91 9.91 0 0 1 2.06 12c0-5.48 4.46-9.94 9.94-9.94 2.66 0 5.15 1.04 7.03 2.92A9.87 9.87 0 0 1 21.94 12c0 5.48-4.46 9.95-9.94 9.95Zm5.45-7.45c-.3-.15-1.77-.88-2.05-.98-.27-.1-.47-.15-.67.15-.2.3-.77.98-.94 1.18-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.68-1.63-.93-2.23-.25-.58-.5-.5-.68-.5H7.7c-.2 0-.52.08-.8.38-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.21 5.09 4.5.71.31 1.27.49 1.7.63.72.23 1.37.2 1.89.12.58-.09 1.77-.73 2.02-1.43.25-.7.25-1.3.17-1.43-.07-.12-.27-.2-.57-.35Z" />
    </svg>
  );
}

function Header({ locale, copy }: { locale: Locale; copy: Copy }) {
  const prefix = locale === 'en' ? '' : `/${locale}`;
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href={prefix || '/'} aria-label="Nomad Discovery Tours home">
          <MountainMark />
          <BrandName />
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#journeys">{copy.navJourneys}</a>
          <a href="#about">{copy.navAbout}</a>
          <a href="#experience">{copy.navExperience}</a>
          <a href="#contact">{copy.navContact}</a>
        </nav>
        <div className="header-actions">
          <details className="language-picker">
            <summary aria-label="Choose language"><span className="globe">◎</span> {locale.toUpperCase()} <span className="chevron">⌄</span></summary>
            <div className="language-menu">
              {locales.map((language) => <a key={language} href={language === 'en' ? '/' : `/${language}/`} lang={language === 'ge' ? 'de' : language} aria-current={language === locale ? 'page' : undefined}>{languageNames[language]}<span>{language.toUpperCase()}</span></a>)}
            </div>
          </details>
          <a className="header-cta" href="#contact">{copy.planTrip}<ArrowIcon diagonal /></a>
          <details className="mobile-menu">
            <summary aria-label={copy.menu}><span /><span /><span /></summary>
            <nav aria-label="Mobile navigation">
              <a href="#journeys">{copy.navJourneys}</a>
              <a href="#about">{copy.navAbout}</a>
              <a href="#experience">{copy.navExperience}</a>
              <a href="#contact">{copy.navContact}</a>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}

function TourCard({ image, number, title, place, tag, description, days, copy }: {
  image: string; number: string; title: string; place: string; tag: string; description: string; days: number; copy: Copy;
}) {
  return (
    <article className="tour-card">
      <div className="tour-image-wrap">
        <Image src={image} alt={place} width={1448} height={1086} sizes="(max-width: 680px) 100vw, 33vw" />
        <span className="tour-tag">{tag}</span>
      </div>
      <div className="tour-info">
        <div className="tour-meta"><span>{place}</span><span>{days} {copy.days}</span></div>
        <div className="tour-heading"><span className="tour-number">{number}</span><h3>{title}</h3></div>
        <p>{description}</p>
        <a className="text-link" href={whatsappLink(`${copy.viewJourney}: ${title}`)} target="_blank" rel="noopener noreferrer">{copy.viewJourney}<ArrowIcon diagonal /></a>
      </div>
    </article>
  );
}

export default function Home({ locale, copy }: { locale: Locale; copy: Copy }) {
  return (
    <div className="site-shell" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <Header locale={locale} copy={copy} />
      <main>
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
              <TourCard image="/images/song-kul.jpg" number="01" title={copy.tour1Title} place={copy.tour1Place} tag={copy.tour1Tag} description={copy.tour1Description} days={3} copy={copy} />
              <TourCard image="/images/kel-suu.jpg" number="02" title={copy.tour2Title} place={copy.tour2Place} tag={copy.tour2Tag} description={copy.tour2Description} days={5} copy={copy} />
              <TourCard image="/images/hero.jpg" number="03" title={copy.tour3Title} place={copy.tour3Place} tag={copy.tour3Tag} description={copy.tour3Description} days={7} copy={copy} />
            </div>
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
          <div className="experience-content"><p className="eyebrow light"><span className="eyebrow-line" />{copy.experienceLabel}</p><h2>{copy.experienceTitle}</h2><p>{copy.experienceDescription}</p><a className="button button-outline" href="#contact">{copy.experienceLink}<ArrowIcon diagonal /></a></div>
        </section>

        <section className="contact section-pad" id="contact">
          <div className="page-width contact-inner"><div><p className="eyebrow dark"><span className="eyebrow-line" />{copy.contactLabel}</p><h2>{copy.contactTitle}</h2><p>{copy.contactDescription}</p></div><div className="contact-action"><a href={whatsappLink(copy.inquiryMessage)} target="_blank" rel="noopener noreferrer" className="button button-dark"><WhatsAppIcon />{copy.whatsapp}<ArrowIcon diagonal /></a><span>{copy.response}</span><a className="phone-link" href="tel:+996559773283">+996 559 773 283</a></div></div>
        </section>
      </main>
      <footer className="footer"><div className="page-width"><div className="footer-main"><div><a className="brand footer-brand" href={locale === 'en' ? '/' : `/${locale}/`}><MountainMark /><BrandName /></a><p>{copy.footerLine}</p></div><div className="footer-links"><div><h3>{copy.footerExplore}</h3><a href="#journeys">{copy.navJourneys}</a><a href="#about">{copy.navAbout}</a><a href="#experience">{copy.navExperience}</a></div><div><h3>{copy.footerConnect}</h3><a href="tel:+996559773283">+996 559 773 283</a><a href={whatsappLink(copy.inquiryMessage)} target="_blank" rel="noopener noreferrer">WhatsApp</a></div></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Nomad Discovery Tours. {copy.rights}</span><span>KYRGYZSTAN · 42°52′ N 74°36′ E</span></div></div></footer>
    </div>
  );
}

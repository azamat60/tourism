import Image from 'next/image';
import SiteChrome, { ArrowIcon, localeHref } from '@/components/SiteChrome';
import { content, type Locale } from '@/lib/content';
import { expandedCopy } from '@/lib/expandedCopy';

export default function AboutPage({ locale }: { locale: Locale }) {
  const copy = content[locale];
  const ui = expandedCopy[locale];
  return <SiteChrome locale={locale} copy={copy} path="/about/">
    <section className="interior-hero about-hero"><Image src="/images/hero.jpg" alt="" fill priority sizes="100vw" /><div className="interior-hero-shade" /><div className="page-width interior-hero-content"><p className="eyebrow light"><span className="eyebrow-line" />{ui.aboutLabel}</p><h1>{ui.aboutTitle}</h1><p>{ui.aboutIntro}</p></div></section>
    <section className="about-story section-pad"><div className="page-width about-story-grid"><div><p className="eyebrow dark"><span className="eyebrow-line" />{copy.philosophyLabel}</p><h2>{copy.philosophyTitle}</h2><p>{ui.aboutSecond}</p></div><div className="about-story-photo"><Image src="/images/song-kul.jpg" alt={copy.tour1Place} width={1448} height={1086} sizes="(max-width: 680px) 100vw, 45vw" /></div></div></section>
    <section className="about-values section-pad"><div className="page-width"><p className="eyebrow dark"><span className="eyebrow-line" />{copy.philosophyLabel}</p><div className="about-value-grid"><article><span>01</span><h3>{copy.value1Title}</h3><p>{copy.value1Description}</p></article><article><span>02</span><h3>{copy.value2Title}</h3><p>{copy.value2Description}</p></article><article><span>03</span><h3>{copy.value3Title}</h3><p>{copy.value3Description}</p></article></div></div></section>
    <section className="catalog-closing"><div className="page-width"><div><p className="eyebrow light"><span className="eyebrow-line" />{copy.contactLabel}</p><h2>{copy.contactTitle}</h2></div><a className="button button-light" href={localeHref(locale, '/plan/')}>{copy.planTrip}<ArrowIcon diagonal /></a></div></section>
  </SiteChrome>;
}

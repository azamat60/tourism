'use client';

import { useCatalog, useTranslation } from './SiteData';


import Image from 'next/image';
import type { Copy, Locale } from '@/lib/content';
import SiteChrome, { ArrowIcon, localeHref } from './SiteChrome';
import { ContentBlocks, TourCard } from './ContentBlocks';



import BookingForm from './BookingForm';
import HeroMedia from './HeroMedia';

export default function Home({ locale, copy }: { locale: Locale; copy: Copy }) {
  const { asset, blogPosts, getTour, pages, site } = useCatalog();
  const t = useTranslation();

  const home = pages.home;
  return <SiteChrome locale={locale} copy={copy}>
    <section className="hero" aria-labelledby="hero-title"><HeroMedia locale={locale} /><div className="hero-shade" /><div className="hero-inner page-width"><div className="hero-content"><p className="eyebrow light"><span className="eyebrow-line" />{t(locale, "Horse treks & tours · Kyrgyzstan")}</p><h1 id="hero-title">{t(locale, home.sections[0].blocks[0].text)}</h1><p className="hero-description">{t(locale, home.sections[0].blocks[1].text)}</p><div className="source-toolbar"><a className="button button-light" href={localeHref(locale, '/tours/')}>{t(locale, "Explore Tours")}<ArrowIcon diagonal /></a><a className="button button-outline" href={localeHref(locale, '/open-tours/')}>{t(locale, "Join a Group")}</a></div><ul className="source-hero-points"><li>{t(locale, "No riding experience needed")}</li><li>{t(locale, "Local Kyrgyz guides")}</li><li>{t(locale, "Yurt stays & home-cooked meals")}</li></ul></div><div className="hero-bottom"><span>{t(locale, "KYRGYZSTAN")}</span><a href="#featured-tours">{t(locale, "Scroll to featured tours")}<span className="scroll-line" /></a></div></div></section>
    <section className="journeys section-pad" id="featured-tours"><div className="page-width"><div className="section-head"><div><p className="eyebrow dark">{t(locale, "Featured tours")}</p><h2>{t(locale, home.sections[1].blocks[0].text)}</h2></div><p>{t(locale, home.sections[1].blocks[1].text)}</p></div><div className="tour-grid">{home.featuredTours.filter((featured) => Boolean(getTour(featured.slug))).map((featured, index) => <TourCard key={featured.slug} tour={getTour(featured.slug)!} index={index} locale={locale} />)}</div><div className="journey-actions"><a className="button button-dark" href={localeHref(locale, '/tours/')}>{t(locale, "See All Tours")}<ArrowIcon diagonal /></a></div></div></section>
    <section className="philosophy section-pad"><div className="page-width philosophy-grid"><div className="philosophy-title"><p className="eyebrow dark">{t(locale, "What we offer")}</p><ContentBlocks locale={locale} blocks={home.sections[2].blocks} /><Image src={asset('/images/SongKulHorse4.webp')} alt={t(locale, "Riders crossing a green valley near Song-Kul")} width={800} height={600} sizes="50vw" /><p>{t(locale, "Local guides who grew up in these mountains")}</p></div><div className="values">{home.offerings.map((item, index) => <div className="value" key={item.title}><span>0{t(locale, index + 1)}</span><div><h3>{t(locale, item.title)}</h3><p>{t(locale, item.text)}</p></div></div>)}</div></div></section>
    <section className="section-pad page-width"><p className="eyebrow dark">{t(locale, "How it works")}</p><ContentBlocks locale={locale} blocks={home.sections[3].blocks} /><div className="source-columns">{home.steps.map((item, index) => <article key={item.title}><span>0{t(locale, index + 1)}</span><h3>{t(locale, item.title)}</h3><p>{t(locale, item.text)}</p></article>)}</div></section>
    <section className="catalog-closing"><div className="page-width"><div><p className="eyebrow light">{t(locale, "Group departures")}</p><ContentBlocks locale={locale} blocks={home.sections[4].blocks} /></div><a className="button button-light" href={localeHref(locale, '/open-tours/')}>{t(locale, "See upcoming departures")}<ArrowIcon diagonal /></a></div></section>
    {site.visibility.testimonials && <section className="section-pad page-width"><p className="eyebrow dark">{t(locale, "Testimonials")}</p><ContentBlocks locale={locale} blocks={home.sections[5].blocks} /><div className="source-columns">{home.testimonials.map((item) => <figure key={item.name}><blockquote>{t(locale, item.quote)}</blockquote><figcaption>{t(locale, item.name)}</figcaption></figure>)}</div></section>}
    {site.visibility.blog && <section className="section-pad page-width"><p className="eyebrow dark">{t(locale, "From our blog")}</p><ContentBlocks locale={locale} blocks={home.sections[6].blocks} /><div className="journal-grid">{blogPosts.map((post) => <a className="journal-card" key={post.slug} href={localeHref(locale, `/blog/${post.slug}/`)}><div><Image src={asset(post.image)} alt={t(locale, post.title)} width={800} height={600} sizes="33vw" /></div><h3>{t(locale, post.title)}</h3><p>{t(locale, post.summary)}</p><strong>{t(locale, "Read article")}<ArrowIcon diagonal /></strong></a>)}</div><a className="text-link" href={localeHref(locale, '/blog/')}>{t(locale, "All articles")}<ArrowIcon diagonal /></a></section>}
    <section className="section-pad" id="contact"><div className="page-width"><p className="eyebrow dark">{t(locale, "Plan your trip")}</p><ContentBlocks locale={locale} blocks={home.sections[7].blocks.slice(0, 2)} /><p><a href={`https://wa.me/${site.whatsappNumber}`} target="_blank" rel="noopener noreferrer">{t(locale, site.phone)}</a></p></div><BookingForm locale={locale} /></section>
  </SiteChrome>;
}

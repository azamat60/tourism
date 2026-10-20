
import { translate as t } from '@/lib/i18n';
import Image from 'next/image';
import SiteChrome, { localeHref } from './SiteChrome';
import { ContentBlocks, PageHero } from './ContentBlocks';
import { content, type Locale } from '@/lib/content';
import { asset } from '@/lib/mock-data';
import pages from '@/lib/mocks/pages.mock.json';

export default function AboutPage({ locale }: { locale: Locale }) {
  const about = pages.about;
  return <SiteChrome locale={locale} copy={content[locale]} path="/about/">
    <PageHero locale={locale} label={t(locale, "About Us")} title={t(locale, about.sections[0].blocks[0].text)} description={t(locale, about.sections[0].blocks[1].text)} image="/images/Gen.webp" />
    <section className="section-pad page-width"><ContentBlocks locale={locale} blocks={about.sections[1].blocks} /><div className="source-columns">{about.features.map((item) => <article key={item.title}><h3>{t(locale, item.title)}</h3><p>{t(locale, item.text)}</p></article>)}</div></section>
    <section className="about-story section-pad"><div className="page-width about-story-grid"><div><p className="eyebrow dark">{t(locale, "Our Story")}</p><ContentBlocks locale={locale} blocks={about.sections[2].blocks} /></div><figure><Image src={asset('/images/KyrgyzPeople.webp')} alt={t(locale, "Some of our guides with guests")} width={1448} height={1086} sizes="50vw" /><figcaption>{t(locale, "Some of our guides with guests")}</figcaption></figure></div></section>
    <section className="section-pad page-width"><p className="eyebrow dark">{t(locale, "Meet Our Guides")}</p><ContentBlocks locale={locale} blocks={about.sections[3].blocks} /><div className="source-columns">{about.guides.map((guide) => <article className="source-guide" key={guide.name}><Image src={asset(guide.photo)} alt={t(locale, guide.name)} width={600} height={600} sizes="350px" /><p className="eyebrow dark">{t(locale, guide.role)}</p><h3>{t(locale, guide.name)}</h3><p>{t(locale, guide.bio)}</p><ul><li>{t(locale, guide.experience)}</li><li>{t(locale, guide.region)}</li><li>{t(locale, guide.languages)}</li></ul></article>)}</div></section>
    <section className="catalog-closing"><div className="page-width"><div><ContentBlocks locale={locale} blocks={about.sections[4].blocks} /></div><a className="button button-light" href={localeHref(locale, '/tours/')}>{t(locale, "View Our Tours")}</a></div></section>
  </SiteChrome>;
}

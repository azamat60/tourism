import Image from 'next/image';
import SiteChrome, { ArrowIcon, localeHref } from '@/components/SiteChrome';
import { content, type Locale } from '@/lib/content';
import { expandedCopy } from '@/lib/expandedCopy';
import { journalImages, journalSlugs, journalStories, type JournalSlug } from '@/lib/journal';

function StoryCard({ locale, slug, index }: { locale: Locale; slug: JournalSlug; index: number }) {
  const story = journalStories[locale][slug];
  const ui = expandedCopy[locale];
  return <a href={localeHref(locale, `/journal/${slug}/`)} className="journal-card"><div><Image src={journalImages[slug]} alt="" width={1448} height={1086} sizes="(max-width: 680px) 100vw, 32vw" /></div><span>0{index + 1} / {ui.journalLabel}</span><h2>{story.title}</h2><p>{story.excerpt}</p><strong>{ui.readStory}<ArrowIcon diagonal /></strong></a>;
}

export function JournalDetail({ locale, slug }: { locale: Locale; slug: JournalSlug }) {
  const copy = content[locale];
  const ui = expandedCopy[locale];
  const story = journalStories[locale][slug];
  return <SiteChrome locale={locale} copy={copy} path={`/journal/${slug}/`}>
    <section className="journal-detail-hero"><Image src={journalImages[slug]} alt="" fill priority sizes="100vw" /><div className="interior-hero-shade" /><div className="page-width journal-detail-heading"><a href={localeHref(locale, '/journal/')}>← {ui.backJournal}</a><div><p className="eyebrow light"><span className="eyebrow-line" />{ui.journalLabel}</p><h1>{story.title}</h1><p>{story.excerpt}</p></div></div></section>
    <article className="page-width journal-article"><p className="journal-lead">{story.lead}</p>{story.sections.map((section, index) => <section key={section.title}><span>0{index + 1}</span><div><h2>{section.title}</h2><p>{section.text}</p></div></section>)}<a className="text-link" href={localeHref(locale, '/journal/')}>{ui.backJournal}<ArrowIcon diagonal /></a></article>
    <section className="catalog-closing"><div className="page-width"><div><p className="eyebrow light"><span className="eyebrow-line" />{ui.bookingLabel}</p><h2>{copy.contactTitle}</h2></div><a className="button button-light" href={localeHref(locale, '/plan/')}>{copy.planTrip}<ArrowIcon diagonal /></a></div></section>
  </SiteChrome>;
}

export default function JournalPage({ locale }: { locale: Locale }) {
  const copy = content[locale];
  const ui = expandedCopy[locale];
  return <SiteChrome locale={locale} copy={copy} path="/journal/">
    <section className="interior-intro"><div className="page-width"><p className="eyebrow dark"><span className="eyebrow-line" />{ui.journalLabel}</p><h1>{ui.journalTitle}</h1><p>{ui.journalIntro}</p></div></section>
    <section className="journal-section"><div className="page-width journal-grid">{journalSlugs.map((slug, index) => <StoryCard locale={locale} slug={slug} index={index} key={slug} />)}</div></section>
  </SiteChrome>;
}

'use client';

import { useCatalog, useTranslation } from './SiteData';


import Image from './SiteImage';
import Breadcrumbs from './Breadcrumbs';
import SiteChrome, { ArrowIcon, localeHref } from './SiteChrome';
import { PageHero } from './ContentBlocks';
import MarkdownContent from './MarkdownContent';
import { content, type Locale } from '@/lib/content';





export function JournalDetail({ locale, slug }: { locale: Locale; slug: string }) {
  const { asset, blogPosts, getPost, site } = useCatalog();
  const t = useTranslation();

  const post = getPost(slug)!;
  return <SiteChrome locale={locale} copy={content[locale]} path={`/blog/${post.slug}/`}><PageHero locale={locale} label={t(locale, "Journal")} title={t(locale, post.title)} description={t(locale, post.summary)} image={asset(post.image)} /><Breadcrumbs locale={locale} parent="blog" title={t(locale, post.title)} /><article className="page-width source-article"><a href={localeHref(locale, '/blog/')}>{t(locale, "← Back to Blog")}</a><MarkdownContent locale={locale} text={t(locale, post.content)} /><aside><h2>{t(locale, "Ready to ride?")}</h2><p>{t(locale, "Explore our horse treks or message us — we'll help you plan the perfect trip.")}</p><div className="source-toolbar"><a className="button button-dark" href={localeHref(locale, '/tours/')}>{t(locale, "View tours")}<ArrowIcon diagonal /></a><a href={`https://wa.me/${site.whatsappNumber}`}>{t(locale, "WhatsApp")}</a></div></aside><section><h2>{t(locale, "Keep reading")}</h2><div className="journal-grid">{blogPosts.filter((item) => item.slug !== post.slug).map((item) => <a key={item.slug} className="journal-card" href={localeHref(locale, `/blog/${item.slug}/`)}><div><Image src={asset(item.image)} alt={t(locale, item.title)} width={800} height={600} sizes="50vw" /></div><h3>{t(locale, item.title)}</h3><p>{t(locale, item.summary)}</p><strong>{t(locale, "Read More")}</strong></a>)}</div></section></article></SiteChrome>;
}
export default function JournalPage({ locale }: { locale: Locale }) {
  const { asset, blogPosts, pages } = useCatalog();
  const t = useTranslation();

  const blocks = pages.blog.sections[0].blocks;
  return <SiteChrome locale={locale} copy={content[locale]} path="/blog/"><PageHero locale={locale} label={t(locale, "Journal")} title={t(locale, blocks[0].text)} description={t(locale, blocks[1].text)} /><section className="journal-section"><div className="page-width journal-grid">{blogPosts.map((post, index) => <a className="journal-card" key={post.slug} href={localeHref(locale, `/blog/${post.slug}/`)}><div><Image src={asset(post.image)} alt={t(locale, post.title)} width={1448} height={1086} sizes="33vw" /></div><span>{t(locale, index === 0 ? 'Featured' : 'Journal')}</span><h2>{t(locale, post.title)}</h2><p>{t(locale, post.summary)}</p><strong>{t(locale, "Read More")}<ArrowIcon diagonal /></strong></a>)}</div></section></SiteChrome>;
}

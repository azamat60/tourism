'use client';

import { translate as t } from '@/lib/i18n';

import { useState } from 'react';
import SiteChrome from './SiteChrome';
import { PageHero } from './ContentBlocks';
import { content, type Locale } from '@/lib/content';
import faq from '@/lib/mocks/faq.mock.json';
import pages from '@/lib/mocks/pages.mock.json';
import { site } from '@/lib/mocks/site.mock';

export default function FaqPage({ locale }: { locale: Locale }) {
  const [search, setSearch] = useState('');
  const blocks = pages.faq.sections[0].blocks;
  const visible = faq.filter((item) => `${t(locale, item.question)} ${typeof item.answer === 'string' ? t(locale, item.answer) : item.answer.items.map((line) => t(locale, line)).join(' ')}`.toLowerCase().includes(search.trim().toLowerCase()));
  return <SiteChrome locale={locale} copy={content[locale]} path="/faq/"><PageHero locale={locale} label={t(locale, "Help centre")} title={t(locale, blocks[0].text)} description={t(locale, blocks[1].text)} /><section className="faq-section"><div className="page-width"><label className="source-search">{t(locale, "Search questions")}<input type="search" placeholder={t(locale, "Search questions…")} value={search} onChange={(event) => setSearch(event.target.value)} /></label><div className="faq-layout"><aside className="faq-aside"><h2>{t(locale, "Still have questions?")}</h2><p>{t(locale, "We're happy to help you choose the right tour and dates.")}</p><p><a href={`https://wa.me/${site.whatsappNumber}`}>{t(locale, "Chat on WhatsApp")}</a></p>{site.email && <p><a href={`mailto:${site.email}`}>{t(locale, "Email us")}</a></p>}<a href={site.preparationGuide} target="_blank" rel="noopener noreferrer">{t(locale, "Guest Preparation Guide (PDF)")}</a><p>{t(locale, "Seasons, packing lists & what to expect")}</p></aside><div className="faq-list">{visible.map((item, index) => <details key={item.question}><summary><span>{t(locale, String(index + 1).padStart(2, '0'))}</span><strong>{t(locale, item.question)}</strong><span className="faq-plus">+</span></summary>{typeof item.answer === 'string' ? <p>{t(locale, item.answer)}</p> : <ul>{item.answer.items.map((line) => <li key={line}>{t(locale, line)}</li>)}</ul>}</details>)}{!visible.length && <div role="status"><p>{t(locale, "No questions match “")}{search}”.</p><button onClick={() => setSearch('')}>{t(locale, "Clear search")}</button></div>}</div></div></div></section></SiteChrome>;
}

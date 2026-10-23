'use client';

import { useCatalog, useTranslation } from './SiteData';



import Image from './SiteImage';
import { useState, type FormEvent } from 'react';
import SiteChrome from './SiteChrome';
import { ContentBlocks, PageHero } from './ContentBlocks';
import PhotoGallery from './PhotoGallery';
import { content, type Locale } from '@/lib/content';
import { shiftDate } from '@/lib/catalog';
import { useBishkekDay } from '@/lib/browser-state';
import { storeInquiry } from '@/lib/booking-service';



export default function ProposalsPage({ locale }: { locale: Locale }) {
  const { asset, pages, site } = useCatalog();
  const t = useTranslation();

  const data = pages.proposals;
  const [setting, setSetting] = useState('');
  const [extras, setExtras] = useState<string[]>([]);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const today = useBishkekDay();
  const choose = (key: string) => { setSetting(key); document.getElementById('proposal-form')?.scrollIntoView({ behavior: 'smooth' }); };
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError('');
    const form = new FormData(event.currentTarget);
    const value = (name: string) => String(form.get(name) || '').trim();
    if (!/^\+?[1-9]\d{6,14}$/.test(value('whatsappNumber').replace(/[\s\-()]/g, ''))) { setError('Please enter a valid WhatsApp number.'); return; }
    if (value('date') < today || value('date') > shiftDate(today, 730)) { setError('Please choose a date between today and two years from now.'); return; }
    if (value('_gotcha')) return;
    setPending(true);
    try {
      await storeInquiry({ name: value('name'), email: value('email'), whatsappNumber: value('whatsappNumber'), date: value('date'), tour: 'Proposal / Engagement', message: value('message'), proposal: { partnerName: value('partnerName'), setting, group: value('group'), extras } });
      setSent(true);
    } catch { setError('Your inquiry could not be saved. Please try again.'); } finally { setPending(false); }
  }
  const photographs = [data.STORY.hero.src, ...data.STORY.moments.map((item) => item.src), ...data.SETTINGS.map((item) => item.image)];
  return <SiteChrome locale={locale} copy={content[locale]} path="/proposals/">
    <PageHero locale={locale} label={t(locale, "Proposals & engagements")} title={t(locale, data.sections[0].blocks[0].text)} description={t(locale, data.sections[0].blocks[1].text)} image={data.STORY.hero.src} />
    <div className="page-width source-toolbar"><a className="button button-dark" href="#proposal-form">{t(locale, "Plan your proposal")}</a><a href={`https://wa.me/${site.whatsappNumber}`} target="_blank" rel="noopener noreferrer">{t(locale, "Let’s talk on WhatsApp")}</a></div>
    <section className="section-pad page-width"><p className="eyebrow dark">{t(locale, "A real proposal")}</p><ContentBlocks locale={locale} blocks={data.sections[1].blocks} /><div className="source-columns">{data.STORY.moments.map((moment) => <article key={moment.src}><Image src={asset(moment.src)} alt={t(locale, moment.alt)} width={800} height={600} sizes="50vw" /><h3>{t(locale, moment.title)}</h3><p>{t(locale, moment.text)}</p></article>)}</div><PhotoGallery locale={locale} images={photographs} captions={Object.fromEntries([[data.STORY.hero.src, 'She Said Yes! · Song-Kul Lake'], ...data.STORY.moments.map((item) => [item.src, item.title]), ...data.SETTINGS.map((item) => [item.image, item.name])])} title={t(locale, "Proposal photos")} /></section>
    <section className="section-pad page-width"><p className="eyebrow dark">{t(locale, "Where")}</p><ContentBlocks locale={locale} blocks={data.sections[3].blocks} /><div className="source-columns">{data.SETTINGS.map((item) => <article key={item.key}><Image src={asset(item.image)} alt={t(locale, item.name)} width={800} height={600} sizes="50vw" /><h3>{t(locale, item.name)}</h3><p>{t(locale, item.blurb)}</p><button className="source-action" onClick={() => choose(item.key)}>{t(locale, "Choose this setting")}</button></article>)}</div></section>
    <section className="section-pad page-width"><p className="eyebrow dark">{t(locale, "What we can arrange")}</p><ContentBlocks locale={locale} blocks={data.sections[4].blocks} /><div className="source-columns">{data.IDEAS.map((item) => <article key={item.title}><h3>{t(locale, item.title)}</h3><p>{t(locale, item.text)}</p></article>)}</div></section>
    <section className="section-pad page-width"><p className="eyebrow dark">{t(locale, "How it works")}</p><ContentBlocks locale={locale} blocks={data.sections[5].blocks} /><div className="source-columns">{data.STEPS.map((item, index) => <article key={item.title}><span>0{t(locale, index + 1)}</span><h3>{t(locale, item.title)}</h3><p>{t(locale, item.text)}</p></article>)}</div></section>
    <section className="section-pad page-width" id="proposal-form"><div className="source-note">{t(locale, site.mockNotice)}</div><div className="booking-layout source-form-layout">{sent ? <div role="status"><h2>{t(locale, data.sections[6].blocks[0].text)}</h2><p>{t(locale, "Your inquiry has been received. Our team will contact you.")}</p><button className="source-action" onClick={() => { setSent(false); setExtras([]); setSetting(''); }}>{t(locale, "Send another inquiry")}</button></div> : <form className="booking-fields" onSubmit={submit}><h2>{t(locale, data.sections[6].blocks[2].text)}</h2><p>{t(locale, data.sections[6].blocks[3].text)}</p><input name="_gotcha" className="source-honeypot" tabIndex={-1} aria-hidden="true" /><div className="booking-field-grid"><label>{t(locale, "Your name")}<input name="name" autoComplete="name" required /></label><label>{t(locale, "Partner’s first name (optional)")}<input name="partnerName" /></label><label>{t(locale, "Email")}<input name="email" type="email" autoComplete="email" required /></label><label>{t(locale, "WhatsApp number")}<input name="whatsappNumber" type="tel" autoComplete="tel" required /></label><label>{t(locale, "Preferred date (roughly is fine)")}<input name="date" type="date" min={today} max={shiftDate(today, 730)} required /></label><label>{t(locale, "Who’s coming")}<select name="group">{data.GROUP_OPTIONS.map((option) => <option key={option} value={option}>{t(locale, option)}</option>)}</select></label><label className="wide">{t(locale, "Setting")}<select value={setting} onChange={(event) => setSetting(event.target.value)}><option value="">{t(locale, "Not sure yet, help me choose")}</option>{data.SETTINGS.map((option) => <option key={option.key} value={option.key}>{t(locale, option.name)}</option>)}</select></label></div><fieldset className="source-fieldset"><legend>{t(locale, "Ideas you’re interested in (optional)")}</legend>{data.EXTRAS.map((extra) => <label className="source-check" key={extra}><input type="checkbox" checked={extras.includes(extra)} onChange={() => setExtras(extras.includes(extra) ? extras.filter((item) => item !== extra) : [...extras, extra])} />{t(locale, extra)}</label>)}</fieldset><label className="source-search">{t(locale, "Tell us about your idea (optional)")}<textarea name="message" maxLength={1500} rows={5} /></label>{error && <p role="alert" className="source-error">{t(locale, error)}</p>}<button className="button button-dark" type="submit" disabled={pending}>{t(locale, pending ? "Saving..." : "Send inquiry")}</button></form>}<aside className="source-aside"><h2>{t(locale, "Common questions")}</h2>{data.FAQS.map((item, index) => <details key={item.q} open={index === 0 || undefined}><summary>{t(locale, item.q)}</summary><p>{t(locale, item.a)}</p></details>)}<p>{t(locale, "Prefer to chat? ")}<a href={`https://wa.me/${site.whatsappNumber}`}>{t(locale, "WhatsApp")}</a>{site.email && <> {t(locale, " or ")}<a href={`mailto:${site.email}`}>{t(locale, "email us")}</a></>}.</p></aside></div></section>
  </SiteChrome>;
}

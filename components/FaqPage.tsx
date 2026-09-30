import SiteChrome, { ArrowIcon, localeHref } from '@/components/SiteChrome';
import { content, type Locale } from '@/lib/content';
import { expandedCopy } from '@/lib/expandedCopy';

export default function FaqPage({ locale }: { locale: Locale }) {
  const copy = content[locale];
  const ui = expandedCopy[locale];
  return <SiteChrome locale={locale} copy={copy} path="/faq/">
    <section className="interior-intro faq-intro"><div className="page-width"><p className="eyebrow dark"><span className="eyebrow-line" />{ui.faqLabel}</p><h1>{ui.faqTitle}</h1><p>{ui.faqIntro}</p></div></section>
    <section className="faq-section"><div className="page-width faq-layout"><div className="faq-aside"><span>01—06</span><p>{ui.faqIntro}</p><a href={localeHref(locale, '/booking/')} className="text-link">{ui.navBooking}<ArrowIcon diagonal /></a></div><div className="faq-list">{ui.faq.map((item, index) => <details key={item.question}><summary><span>{String(index + 1).padStart(2, '0')}</span><strong>{item.question}</strong><span className="faq-plus" aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div></div></section>
  </SiteChrome>;
}

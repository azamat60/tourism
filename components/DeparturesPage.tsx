import SiteChrome, { ArrowIcon, localeHref } from '@/components/SiteChrome';
import DepartureExplorer from '@/components/DepartureExplorer';
import { content, type Locale } from '@/lib/content';
import { expandedCopy } from '@/lib/expandedCopy';

export default function DeparturesPage({ locale }: { locale: Locale }) {
  const copy = content[locale];
  const ui = expandedCopy[locale];
  return <SiteChrome locale={locale} copy={copy} path="/departures/">
    <section className="interior-intro"><div className="page-width"><p className="eyebrow dark"><span className="eyebrow-line" />{ui.datesLabel}</p><h1>{ui.datesTitle}</h1><p>{ui.datesIntro}</p></div></section>
    <section className="departures-section"><DepartureExplorer locale={locale} /></section>
    <section className="catalog-closing"><div className="page-width"><div><p className="eyebrow light"><span className="eyebrow-line" />{ui.privateTitle}</p><h2>{ui.privateTitle}</h2><p>{ui.privateText}</p></div><a className="button button-light" href={localeHref(locale, '/plan/')}>{copy.planTrip}<ArrowIcon diagonal /></a></div></section>
  </SiteChrome>;
}

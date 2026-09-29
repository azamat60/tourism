import SiteChrome from '@/components/SiteChrome';
import PlannerForm from '@/components/PlannerForm';
import { content, type Locale } from '@/lib/content';
import { innerCopy } from '@/lib/innerCopy';
import { tourBasics, tourSlugs } from '@/lib/tours';

export default function Planner({ locale }: { locale: Locale }) {
  const copy = content[locale];
  const ui = innerCopy[locale];
  const options = tourSlugs.map((slug) => ({ slug, title: tourBasics(copy, slug).title }));

  return (
    <SiteChrome locale={locale} copy={copy} path="/plan/">
      <section className="planner-intro"><div className="page-width"><p className="eyebrow dark"><span className="eyebrow-line" />{ui.plannerLabel}</p><h1>{ui.plannerTitle}</h1><p>{ui.plannerDescription}</p></div></section>
      <section className="planner-section"><PlannerForm locale={locale} copy={copy} ui={ui} options={options} /></section>
    </SiteChrome>
  );
}

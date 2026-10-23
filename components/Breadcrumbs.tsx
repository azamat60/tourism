'use client';

import type { Locale } from '@/lib/content';
import { localeHref } from '@/lib/links';
import { useTranslation } from './SiteData';

const labels: Record<Locale, string> = {
  en: 'Breadcrumbs',
  es: 'Ruta de navegación',
  fr: 'Fil d’Ariane',
  it: 'Percorso di navigazione',
  ge: 'Brotkrümelnavigation',
  ru: 'Навигационная цепочка',
  zh: '面包屑导航',
  ar: 'مسار التنقل',
};

export default function Breadcrumbs({
  locale,
  parent,
  title,
}: {
  locale: Locale;
  parent: 'tours' | 'blog';
  title: string;
}) {
  const t = useTranslation();
  return (
    <nav className="seo-breadcrumbs page-width" aria-label={labels[locale]}>
      <ol>
        <li>
          <a href={localeHref(locale, '/')}>Nomad Discovery Tours</a>
        </li>
        <li>
          <a href={localeHref(locale, `/${parent}/`)}>
            {t(locale, parent === 'tours' ? 'Tours' : 'Journal')}
          </a>
        </li>
        <li aria-current="page">{title}</li>
      </ol>
    </nav>
  );
}

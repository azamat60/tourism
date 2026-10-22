'use client';

import { useCatalog, useTranslation } from './SiteData';


import type { ReactNode } from 'react';
import LanguageLink from './LanguageLink';
import type { Copy, Locale } from '@/lib/content';
import { languageNames, locales } from '@/lib/content';
import { localeHref, whatsappLink } from '@/lib/links';



export { localeHref, whatsappLink } from '@/lib/links';

export function ArrowIcon({ diagonal = false }: { diagonal?: boolean }) {
  return diagonal ? (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M4 16 16 4M6 4h10v10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ) : (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M3 10h13m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}

export function MountainMark() {
  return (
    <svg className="brand-mark" aria-hidden="true" viewBox="0 0 50 50" fill="none">
      <circle cx="25" cy="25" r="23.5" stroke="currentColor" />
      <path d="m8 33 10-12 5 6 8-14 12 20H8Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="m27.8 19 3.2-6 4.1 7" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M13 37h24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function BrandName() {
  return <span className="brand-wordmark"><strong>Nomad</strong><em>Discovery Tours</em></span>;
}

export function WhatsAppIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.5 3.5A11.8 11.8 0 0 0 12 .01C5.38.01 0 5.38 0 12c0 2.11.55 4.16 1.6 5.98L0 24l6.18-1.62A11.95 11.95 0 0 0 12 24c6.62 0 12-5.38 12-12 0-3.2-1.25-6.2-3.5-8.5ZM12 21.95c-1.78 0-3.52-.48-5.04-1.38l-.36-.21-3.75.98 1-3.65-.24-.38A9.91 9.91 0 0 1 2.06 12c0-5.48 4.46-9.94 9.94-9.94 2.66 0 5.15 1.04 7.03 2.92A9.87 9.87 0 0 1 21.94 12c0 5.48-4.46 9.95-9.94 9.95Zm5.45-7.45c-.3-.15-1.77-.88-2.05-.98-.27-.1-.47-.15-.67.15-.2.3-.77.98-.94 1.18-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.68-1.63-.93-2.23-.25-.58-.5-.5-.68-.5H7.7c-.2 0-.52.08-.8.38-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.21 5.09 4.5.71.31 1.27.49 1.7.63.72.23 1.37.2 1.89.12.58-.09 1.77-.73 2.02-1.43.25-.7.25-1.3.17-1.43-.07-.12-.27-.2-.57-.35Z" />
    </svg>
  );
}

function Header({ locale, copy, path }: { locale: Locale; copy: Copy; path: string }) {
  const { site } = useCatalog();
  const navigation = site.navigation.filter((item) => site.visibility.blog || item.path !== '/blog/');
  const t = useTranslation();

  const home = localeHref(locale);
  const plan = localeHref(locale, '/booking/');


  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href={home} aria-label={t(locale, "Nomad Discovery Tours home")}><MountainMark /><BrandName /></a>
        <nav className="desktop-nav" aria-label={t(locale, "Main navigation")}>
          {navigation.map((item) => <a key={item.path} href={localeHref(locale, item.path)}>{t(locale, item.label)}</a>)}
        </nav>
        <div className="header-actions">
          <details className="language-picker">
            <summary aria-label={t(locale, "Choose language")}><span className="globe">◎</span> {locale === 'ge' ? 'DE' : locale.toUpperCase()} <svg className="chevron" aria-hidden="true" viewBox="0 0 16 16" fill="none"><path d="m3 6 5 5 5-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg></summary>
            <div className="language-menu">
              {locales.map((language) => <LanguageLink key={language} href={localeHref(language, path)} lang={language === 'ge' ? 'de' : language} aria-current={language === locale ? 'page' : undefined}>{languageNames[language]}<span>{language === 'ge' ? 'DE' : language.toUpperCase()}</span></LanguageLink>)}
            </div>
          </details>
          <a className="header-cta" href={plan}>{t(locale, "Book Now")}<ArrowIcon diagonal /></a>
          <details className="mobile-menu">
            <summary aria-label={t(locale, copy.menu)}><span /><span /><span /></summary>
            <nav aria-label={t(locale, "Mobile navigation")}>
              {navigation.map((item) => <a key={item.path} href={localeHref(locale, item.path)}>{t(locale, item.label)}</a>)}
              <a href={plan}>{t(locale, "Book Now")}</a>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}

function Footer({ locale, copy }: { locale: Locale; copy: Copy }) {
  const { site, activeTours } = useCatalog();
  const navigation = site.navigation.filter((item) => site.visibility.blog || item.path !== '/blog/');
  const t = useTranslation();

  const home = localeHref(locale);

  return (
    <footer className="footer"><div className="page-width"><div className="footer-main"><div><a className="brand footer-brand" href={home}><MountainMark /><BrandName /></a><p>{t(locale, site.description)}</p></div><div className="footer-links"><div><h3>{t(locale, "Explore")}</h3>{navigation.map((item) => <a key={item.path} href={localeHref(locale, item.path)}>{t(locale, item.label)}</a>)}</div><div><h3>{t(locale, "Popular tours")}</h3>{activeTours.slice(0,4).map(({slug,title}) => <a key={slug} href={localeHref(locale, `/tours/${slug}/`)}>{t(locale, title)}</a>)}</div><div><h3>{t(locale, "Get in touch")}</h3><a href={localeHref(locale, '/booking/')}>{t(locale, "Plan your trip")}</a><a href={`tel:+${site.whatsappNumber}`}>{t(locale, site.phone)}</a>{site.email && <a href={`mailto:${site.email}`}>{t(locale, site.email)}</a>}{site.instagram && <a href={site.instagram} target="_blank" rel="noopener noreferrer">{t(locale, "Instagram")}</a>}<a href={whatsappLink(copy.inquiryMessage, site.whatsappNumber)} target="_blank" rel="noopener noreferrer">{t(locale, "WhatsApp")}</a></div></div></div><div className="footer-bottom"><span>© {t(locale, new Date().getFullYear())} {t(locale, site.name)}{t(locale, ". All rights reserved.")}</span><span>{t(locale, "KYRGYZSTAN · All prices in USD")}</span></div></div></footer>
  );
}

function FloatingWhatsApp({ copy }: { copy: Copy }) {
 const {site} = useCatalog();
  return <a className="floating-whatsapp" href={whatsappLink(copy.inquiryMessage, site.whatsappNumber)} target="_blank" rel="noopener noreferrer" aria-label={copy.whatsapp}><WhatsAppIcon /><span>WhatsApp</span></a>;
}

export default function SiteChrome({ locale, copy, path = '/', children }: {
  locale: Locale;
  copy: Copy;
  path?: string;
  children: ReactNode;
}) {
  const t = useTranslation();

  return <div className="site-shell" dir={locale === 'ar' ? 'rtl' : 'ltr'}><a className="skip-link" href="#main-content">{t(locale, "Skip to content")}</a><Header locale={locale} copy={copy} path={path} /><main id="main-content">{children}</main><Footer locale={locale} copy={copy} /><FloatingWhatsApp copy={copy} /></div>;
}

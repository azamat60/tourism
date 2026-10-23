import { rootMetadata } from '@/lib/seo';
import { siteSchema } from '@/lib/structured-data';
import StructuredData from '@/components/StructuredData';
import { notFound } from 'next/navigation';
import { loadSiteData } from '@/lib/site-data';
import { SiteDataProvider } from '@/components/SiteData';
import 'leaflet/dist/leaflet.css';
import { isLocale } from '@/lib/content';
import '../../globals.css';
import '../../internal.css';
import '../../expanded.css';
import '../../source-content.css';

export const metadata = rootMetadata();

export const dynamic = 'force-dynamic';

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const data = await loadSiteData();
  const language = isLocale(locale) ? (locale === 'ge' ? 'de' : locale) : 'en';
  const direction = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={language} dir={direction}>
      <body>
        <StructuredData value={siteSchema(data)} />
        <SiteDataProvider data={data}>{children}</SiteDataProvider>
      </body>
    </html>
  );
}

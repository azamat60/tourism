import { rootMetadata } from '@/lib/seo';
import { siteSchema } from '@/lib/structured-data';
import StructuredData from '@/components/StructuredData';
import { loadSiteData } from '@/lib/site-data';
import { SiteDataProvider } from '@/components/SiteData';
import 'leaflet/dist/leaflet.css';
import '../globals.css';
import '../internal.css';
import '../expanded.css';
import '../source-content.css';

export const metadata = rootMetadata();

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const data = await loadSiteData();
  return (
    <html lang="en">
      <body>
        <StructuredData value={siteSchema(data)} />
        <SiteDataProvider data={data}>{children}</SiteDataProvider>
      </body>
    </html>
  );
}

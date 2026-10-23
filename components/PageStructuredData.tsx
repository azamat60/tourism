import { loadSiteData } from '@/lib/site-data';
import { pageSchema } from '@/lib/structured-data';
import type { PageKey } from '@/lib/seo-copy';
import type { Locale } from '@/lib/content';
import StructuredData from './StructuredData';

export default async function PageStructuredData({
  page,
  locale = 'en',
}: {
  page: PageKey;
  locale?: Locale;
}) {
  return (
    <StructuredData value={pageSchema(await loadSiteData(), locale, page)} />
  );
}

import { loadSiteData } from '@/lib/site-data';
import { buildSitemap, indexingEnabled } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export default async function sitemap() {
  if (!indexingEnabled()) return [];
  return buildSitemap(await loadSiteData());
}

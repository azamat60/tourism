'use client';

import { createContext, useContext, useMemo, useCallback } from 'react';
import { createCatalog } from '@/lib/catalog';
import { createTourHelpers } from '@/lib/tours';
import { createCheckout } from '@/lib/checkout';
import { translate } from '@/lib/i18n';
import type { Locale } from '@/lib/content';
import type { SiteData } from '@/lib/site-types';

const DataContext = createContext<SiteData | null>(null);
export function SiteDataProvider({ data, children }: { data: SiteData; children: React.ReactNode }) {
  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
}
export function useSiteData() {
  const data = useContext(DataContext);
  if (!data) throw new Error('Site data provider is missing.');
  return data;
}
export function useCatalog() {
  const data = useSiteData();
  return useMemo(
    () => ({
      ...data,
      ...createCatalog(data),
      ...createTourHelpers(data),
      ...createCheckout(data.countries, data.checkout),
    }),
    [data],
  );
}
export function useTranslation() {
  const data = useSiteData();
  return useCallback(
    <T,>(locale: Locale, value: T): T => {
      if (typeof value === 'string') {
        const translated = data.translations[locale]?.[value];
        if (translated !== undefined && translated !== value) return translated as T;
      }
      return translate(locale, value);
    },
    [data],
  );
}

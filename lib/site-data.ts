import "server-only";
import { cache } from "react";
import { publicSupabase } from "./supabase/server";
import { dayKey } from "./catalog";
import { locales, type Locale } from "./content";
import type { ContentEntry, SiteData } from "./site-types";

function collectTranslations(
  source: unknown,
  translated: unknown,
  output: Record<string, string>,
) {
  if (typeof source === "string" && typeof translated === "string") {
    output[source] = translated;
    return;
  }
  if (
    !source ||
    !translated ||
    typeof source !== "object" ||
    typeof translated !== "object"
  )
    return;
  for (const [key, value] of Object.entries(source)) {
    collectTranslations(
      value,
      (translated as Record<string, unknown>)[key],
      output,
    );
  }
}
export function assembleSiteData(entries: ContentEntry[]): SiteData {
  const find = (id: string) => {
    const entry = entries.find((item) => item.id === id);
    if (!entry) throw new Error(`Required Supabase content is missing: ${id}`);
    return entry.data;
  };
  const translations: Partial<Record<Locale, Record<string, string>>> = {};
  for (const locale of locales) {
    translations[locale] = {};
    entries.forEach((entry) =>
      collectTranslations(
        entry.data,
        entry.translations[locale],
        translations[locale]!,
      ),
    );
  }
  return {
    tours: entries
      .filter((item) => item.kind === "tour")
      .map((item) => ({ ...item.data, manualJoinableDates: [] })),
    publicDepartures: entries
      .filter((item) => item.kind === "departure")
      .map((item) => item.data),
    blogPosts: entries
      .filter((item) => item.kind === "post")
      .map((item) => item.data),
    faq: entries.filter((item) => item.kind === "faq").map((item) => item.data),
    pages: Object.fromEntries(
      entries
        .filter((item) => item.kind === "page")
        .map((item) => [item.slug, item.data]),
    ),
    assets: find("settings:assets"),
    site: find("settings:site"),
    checkout: find("settings:checkout"),
    countries: find("settings:countries"),
    tourPage: find("settings:tour-page"),
    translations,
    today: dayKey(),
    bookingTermsVersion: {waiver: entries.find((entry)=>entry.id==='settings:checkout')!.version,site: entries.find((entry)=>entry.id==='settings:site')!.version},
  } as unknown as SiteData;
}
export const loadSiteData = cache(async () => {
  const { data, error } = await publicSupabase()
    .from("tourism_content")
    .select("*")
    .eq("published", true)
    .order("created_at")
    .order("id");
  if (error) throw new Error(`Supabase content unavailable: ${error.message}`);
  return assembleSiteData(data as ContentEntry[]);
});

import { translate } from "./i18n";
import { loadSiteData } from "./site-data";
import type { Locale } from "./content";
type PageKey =
  | "home"
  | "about"
  | "faq"
  | "booking"
  | "blog"
  | "tours"
  | "departures"
  | "proposals";
export async function localizedPageMetadata(
  key: PageKey,
  locale: Locale = "en",
) {
  const data = await loadSiteData();
  const page =
    key in data.pages ? data.pages[key as keyof typeof data.pages] : undefined;
  const blocks = page?.sections[0]?.blocks;
  const title =
    blocks?.[0]?.text ||
    (key === "tours" ? "Tours in Kyrgyzstan" : "Join a Group");
  const description =
    blocks?.[1]?.text ||
    "Horse treks and mountain adventures across Kyrgyzstan.";
  const t = (text: string) =>
    data.translations[locale]?.[text] || translate(locale, text);
  return {
    title: `${t(title)} | ${data.site.name}`,
    description: t(description),
  };
}

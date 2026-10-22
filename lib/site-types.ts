import type { Tour, PublicDeparture, BlogPost } from "./types";
import type { site } from "./mocks/site.mock";
import type { Locale } from "./content";

export type EntryKind =
  "tour" | "departure" | "post" | "faq" | "page" | "settings";
export type ContentEntry = {
  id: string;
  kind: EntryKind;
  slug: string;
  data: Record<string, unknown>;
  translations: Partial<Record<Locale, unknown>>;
  published: boolean;
  version: number;
  updated_at: string;
  created_at: string;
};
export type SiteData = {
  tours: Tour[];
  publicDepartures: PublicDeparture[];
  blogPosts: BlogPost[];
  assets: Record<string, string>;
  site: typeof site;
  pages: typeof import("./mocks/pages.mock.json");
  faq: typeof import("./mocks/faq.mock.json");
  tourPage: typeof import("./mocks/tour-page.mock.json");
  checkout: typeof import("./mocks/checkout.mock.json");
  countries: typeof import("./mocks/countries.mock.json");
  translations: Partial<Record<Locale, Record<string, string>>>;
  today: string;
  bookingTermsVersion: { waiver: number; site: number };
};
export type StaffRole = "admin" | "editor" | "manager";

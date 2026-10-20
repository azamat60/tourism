import { locales, type Locale } from './content';
import { asset, blogPosts } from './mock-data';

export const journalAliases: Record<string, string> = {
  'packing-for-the-highlands': 'packing-tips-trek', 'a-night-in-a-yurt': 'yurt-life-nomads', 'your-first-horse-trek': 'horse-trekking-kyrgyzstan',
};
export const journalSlugs = [...blogPosts.map((post) => post.slug), ...Object.keys(journalAliases)];
export type JournalSlug = string;
export function getPost(slug: string) { return blogPosts.find((post) => post.slug === (journalAliases[slug] || slug)); }
export const journalImages = Object.fromEntries(journalSlugs.map((slug) => [slug, asset(getPost(slug)!.image)]));
const stories = Object.fromEntries(journalSlugs.map((slug) => {
  const post = getPost(slug)!;
  return [slug, { title: post.title, excerpt: post.summary, lead: post.summary, sections: [], content: post.content }];
}));
export const journalStories = Object.fromEntries(locales.map((locale) => [locale, stories])) as Record<Locale, typeof stories>;
export function isJournalSlug(value: string): value is JournalSlug { return Boolean(getPost(value)); }

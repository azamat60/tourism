import { translate } from './i18n';
import pages from './mocks/pages.mock.json';

const fromBlocks = (blocks: { text: string }[]) => ({ title: `${blocks[0].text} | Nomad Discovery Tours`, description: blocks[1]?.text || '' });
export const pageMetadata = {
  home: { title: 'Kyrgyzstan Horse Tours — Nomad Discovery Tours', description: pages.home.sections[0].blocks[1].text },
  about: fromBlocks(pages.about.sections[0].blocks), faq: fromBlocks(pages.faq.sections[0].blocks),
  booking: fromBlocks(pages.booking.sections[0].blocks), blog: fromBlocks(pages.blog.sections[0].blocks),
  tours: { title: 'Kyrgyzstan Horse Tours — Song-Kul, Kel-Suu & Multi-day Treks | Nomad Discovery Tours', description: 'Explore our horse tours in Kyrgyzstan: multi-day treks to Song-Kul, Kel-Suu and custom private rides. Local guides, yurt stays, small groups.' },
  departures: { title: 'Join a Group | Nomad Discovery Tours', description: 'Join an upcoming booked tour - no experience needed! Ride with other travellers and share the trail.' },
  proposals: { title: 'Proposals & Engagements in Kyrgyzstan | Nomad Discovery Tours', description: pages.proposals.sections[0].blocks[1].text },
};

export function localizedPageMetadata(key: keyof typeof pageMetadata, locale: import('./content').Locale) {
  const headings = {
    home: pages.home.sections[0].blocks, about: pages.about.sections[0].blocks,
    faq: pages.faq.sections[0].blocks, booking: pages.booking.sections[0].blocks,
    blog: pages.blog.sections[0].blocks, proposals: pages.proposals.sections[0].blocks,
  };
  const blocks = key in headings ? headings[key as keyof typeof headings] : undefined;
  const title = blocks?.[0].text || (key === 'tours' ? 'Tours in Kyrgyzstan' : 'Join a Group');
  const description = blocks?.[1]?.text || pageMetadata[key].description;
  return { title: `${translate(locale, title)} | Nomad Discovery Tours`, description: translate(locale, description) };
}

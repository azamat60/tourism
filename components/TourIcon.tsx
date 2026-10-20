import type { ReactNode } from 'react';

const icons = {
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  route: <><circle cx="6" cy="5" r="2" /><circle cx="18" cy="19" r="2" /><path d="M8 5h8a4 4 0 0 1 0 8H8a3 3 0 0 0 0 6h8" /></>,
  pin: <><path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></>,
  horse: <><path d="m7 20 2-6-3-3 3-6 4 2 2-4 3 5 3 3-2 3-5-2-2 8M9 14h5M9 5 7 3l-2 7" /><circle cx="16.5" cy="9" r=".5" fill="currentColor" /></>,
  signal: <><path d="M4 20v-3m5 3v-7m5 7V9m5 11V4" /></>,
  flag: <><path d="M5 21V3c5-3 9 3 14 0v11c-5 3-9-3-14 0" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  minus: <path d="M5 12h14" />,
  users: <><circle cx="9" cy="7" r="3" /><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6m3 11v-3a6 6 0 0 0-2-4" /></>,
  image: <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8" cy="8" r="1" /><path d="m21 15-5-5L5 21" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  download: <><path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5" /></>,
} satisfies Record<string, ReactNode>;

export type TourIconName = keyof typeof icons;

export default function TourIcon({ name }: { name: TourIconName }) {
  return <svg className="tour-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[name]}</svg>;
}

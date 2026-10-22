'use client';

import { useSyncExternalStore } from 'react';
import { dayKey } from './catalog';
import { useSiteData } from '@/components/SiteData';

function subscribeLocation(callback: () => void) {
  window.addEventListener('popstate', callback);
  return () => window.removeEventListener('popstate', callback);
}
export function useBrowserQuery() {
  return new URLSearchParams(useSyncExternalStore(subscribeLocation, () => window.location.search, () => ''));
}
function subscribeDay(callback: () => void) {
  const timer = window.setInterval(callback, 60000);
  return () => window.clearInterval(timer);
}
export function useBishkekDay() {
  const { today } = useSiteData();
  return useSyncExternalStore(subscribeDay, () => dayKey(), () => today);
}

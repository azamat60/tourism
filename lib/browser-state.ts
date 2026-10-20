'use client';

import { useSyncExternalStore } from 'react';
import { dayKey } from './mock-data';
import source from './mocks/source.mock.json';

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
  return useSyncExternalStore(subscribeDay, () => dayKey(), () => dayKey(new Date(source.capturedAt)));
}

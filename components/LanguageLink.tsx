'use client';

import { useSyncExternalStore, type AnchorHTMLAttributes } from 'react';

function subscribe(callback: () => void) {
  window.addEventListener('popstate', callback);
  window.addEventListener('hashchange', callback);
  return () => {
    window.removeEventListener('popstate', callback);
    window.removeEventListener('hashchange', callback);
  };
}
const locationSuffix = () => `${window.location.search}${window.location.hash}`;
const serverSuffix = () => '';

export default function LanguageLink(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const suffix = useSyncExternalStore(subscribe, locationSuffix, serverSuffix);
  return <a {...props} href={props.href ? `${props.href}${suffix}` : undefined} onClick={(event) => {
    if (props.href) event.currentTarget.href = `${props.href}${locationSuffix()}`;
    props.onClick?.(event);
  }} />;
}

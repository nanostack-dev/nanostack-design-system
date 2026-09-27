import { useMemo, useSyncExternalStore } from 'react';

export const sitePages = ['overview', 'components', 'guidelines', 'changelog'] as const;
export type SitePage = (typeof sitePages)[number];
export type Route = { page: SitePage | 'missing'; tab: string | null; hash: string };

const navigationEvent = 'ns-site-navigate';

export function parseRoute(url: URL): Route {
  const parameters = url.searchParams;
  const requested =
    parameters.get('page') ?? (parameters.has('catalog') ? 'components' : 'overview');
  const page = sitePages.find((name) => name === requested) ?? 'missing';
  return { page, tab: parameters.get('tab'), hash: url.hash };
}

/** Relative query links keep the Pages base path: `?page=x` resolves against the current page. */
export function pageHref(page: SitePage, tab?: string) {
  if (page === 'overview') return './';
  return tab ? `?page=${page}&tab=${tab}` : `?page=${page}`;
}

function subscribe(onChange: () => void) {
  window.addEventListener('popstate', onChange);
  window.addEventListener(navigationEvent, onChange);
  return () => {
    window.removeEventListener('popstate', onChange);
    window.removeEventListener(navigationEvent, onChange);
  };
}

export function useRoute() {
  const href = useSyncExternalStore(subscribe, () => window.location.href);
  return useMemo(() => parseRoute(new URL(href)), [href]);
}

export function navigate(href: string, mode: 'push' | 'replace' = 'push') {
  const url = new URL(href, window.location.href);
  if (url.href === window.location.href) return;
  if (mode === 'push') window.history.pushState(null, '', url);
  else window.history.replaceState(null, '', url);
  window.dispatchEvent(new Event(navigationEvent));
}

/** Same-document links that change the query become history entries instead of reloads. */
export function followSiteLink(event: MouseEvent) {
  if (event.defaultPrevented || event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const anchor = event.target instanceof Element ? event.target.closest('a[href]') : null;
  if (!(anchor instanceof HTMLAnchorElement) || anchor.target || anchor.hasAttribute('download'))
    return;
  const url = new URL(anchor.href);
  const current = window.location;
  if (url.origin !== current.origin || url.pathname !== current.pathname) return;
  if (url.searchParams.has('preview')) return;
  if (url.search === current.search && url.hash) return;
  event.preventDefault();
  navigate(url.href);
}

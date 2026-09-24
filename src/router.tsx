// A router small enough to read in one sitting. Paths are real paths
// (/music, /station/weird-weather) so a link can be sent to someone;
// vercel.json rewrites them all to index.html. The query string holds
// the rest of the state that makes a view a view: edition, list/table/
// network, filters, the selected station. Change any of it and the URL
// changes with it, so whatever is on screen can be shared as it is.

import React, { useSyncExternalStore } from 'react';

type Snapshot = { path: string; search: string };

let snapshot: Snapshot = read();
const listeners = new Set<() => void>();

function read(): Snapshot {
  return { path: window.location.pathname, search: window.location.search };
}

function emit() {
  const next = read();
  if (next.path === snapshot.path && next.search === snapshot.search) return;
  snapshot = next;
  listeners.forEach((l) => l());
}

window.addEventListener('popstate', emit);

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useLocation(): Snapshot {
  return useSyncExternalStore(subscribe, () => snapshot);
}

export function useParams(): URLSearchParams {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

/** Go somewhere. `replace` for state tweaks (a filter), push for pages. */
export function navigate(to: string, { replace = false } = {}) {
  const url = new URL(to, window.location.origin);
  const target = url.pathname + url.search + url.hash;
  const current = window.location.pathname + window.location.search + window.location.hash;
  if (target === current) return;
  const pathChanged = url.pathname !== window.location.pathname;
  if (replace) window.history.replaceState(null, '', target);
  else window.history.pushState(null, '', target);
  emit();
  if (pathChanged) {
    window.scrollTo(0, 0);
    // A new page: move focus to main so a screen reader starts at the top
    // of the new content instead of on the link that was just pressed.
    requestAnimationFrame(() => document.getElementById('main')?.focus());
  }
}

/** Set or clear query params on the current URL, keeping the rest. */
export function setParams(changes: Record<string, string | null>, { replace = true } = {}) {
  const params = new URLSearchParams(window.location.search);
  for (const [k, v] of Object.entries(changes)) {
    if (v === null || v === '') params.delete(k);
    else params.set(k, v);
  }
  const qs = params.toString();
  navigate(window.location.pathname + (qs ? `?${qs}` : ''), { replace });
}

// The one param that follows you around the site: if you are looking at an
// old edition, every internal link keeps you in it until you leave.
const STICKY = ['edition'];

export function withSticky(href: string): string {
  if (!href.startsWith('/')) return href;
  const current = new URLSearchParams(window.location.search);
  const url = new URL(href, window.location.origin);
  for (const key of STICKY) {
    const v = current.get(key);
    if (v && !url.searchParams.has(key)) url.searchParams.set(key, v);
  }
  return url.pathname + url.search + url.hash;
}

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  to: string;
  replace?: boolean;
};

/** An internal link. A real <a href>, so it opens in a new tab, copies,
 *  and works without JavaScript; plain clicks are handled here instead of
 *  reloading the page. */
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { to, replace, onClick, children, ...rest },
  ref,
) {
  const href = withSticky(to);
  return (
    <a
      ref={ref}
      href={href}
      onClick={(e) => {
        onClick?.(e);
        if (
          e.defaultPrevented ||
          e.button !== 0 ||
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.altKey ||
          rest.target === '_blank'
        ) {
          return;
        }
        e.preventDefault();
        navigate(href, { replace });
      }}
      {...rest}
    >
      {children}
    </a>
  );
});

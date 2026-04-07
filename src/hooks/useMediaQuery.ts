import { useState, useEffect } from 'react';

/**
 * SSR-safe hook that subscribes to a CSS media query and returns whether it matches.
 *
 * @param query - A valid CSS media query string, e.g. `"(max-width: 767px)"`
 * @returns `true` when the query matches, `false` otherwise (and on SSR).
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

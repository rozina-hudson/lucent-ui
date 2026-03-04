import {
  createContext,
  useContext,
  useLayoutEffect,
  useId,
  type ReactNode,
} from 'react';
import { lightTokens } from '../tokens/light.js';
import { darkTokens } from '../tokens/dark.js';
import { makeLibraryCSS } from '../tokens/css.js';
import type { LucentTokens, Theme } from '../tokens/types.js';

interface LucentContextValue {
  theme: Theme;
  tokens: LucentTokens;
}

const LucentContext = createContext<LucentContextValue>({
  theme: 'light',
  tokens: lightTokens,
});

export interface LucentProviderProps {
  theme?: Theme;
  tokens?: Partial<LucentTokens>;
  children: ReactNode;
}

/**
 * Wraps your app (or a subtree) and injects Lucent design tokens
 * as CSS custom properties into <head>. Uses useLayoutEffect so
 * styles are applied synchronously before first paint.
 *
 * @example
 * <LucentProvider theme="dark">
 *   <App />
 * </LucentProvider>
 */
export function LucentProvider({
  theme = 'light',
  tokens: tokenOverrides,
  children,
}: LucentProviderProps) {
  const id = useId().replace(/:/g, '');
  const baseTokens = theme === 'dark' ? darkTokens : lightTokens;
  const tokens: LucentTokens = tokenOverrides
    ? { ...baseTokens, ...tokenOverrides }
    : baseTokens;

  const css = makeLibraryCSS(tokens, ':root');

  // useLayoutEffect fires synchronously after DOM mutations, before browser paint —
  // so CSS variables are in <head> before any component renders visually.
  useLayoutEffect(() => {
    let el = document.getElementById(`lucent-tokens-${id}`) as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement('style');
      el.id = `lucent-tokens-${id}`;
      document.head.appendChild(el);
    }
    el.textContent = css;

    return () => {
      document.getElementById(`lucent-tokens-${id}`)?.remove();
    };
  }, [id, css]);

  return (
    <LucentContext.Provider value={{ theme, tokens }}>
      {children}
    </LucentContext.Provider>
  );
}

/**
 * Returns the current Lucent theme and resolved token set.
 * Must be used inside a <LucentProvider>.
 */
export function useLucent(): LucentContextValue {
  return useContext(LucentContext);
}

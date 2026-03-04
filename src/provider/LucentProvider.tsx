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
import { getContrastText } from '../tokens/contrast.js';
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
  const merged: LucentTokens = tokenOverrides
    ? { ...baseTokens, ...tokenOverrides }
    : baseTokens;
  // Auto-compute textOnAccent from the resolved accent color unless the consumer
  // explicitly overrides it. This guarantees WCAG AA contrast on accent surfaces
  // regardless of which accent color is in use.
  const tokens: LucentTokens = {
    ...merged,
    textOnAccent: tokenOverrides?.textOnAccent ?? getContrastText(merged.accentDefault),
  };

  // Set the root font size once so all rem-based tokens resolve to the intended scale.
  // 13px base: fontSizeMd (1rem) = 13px, fontSizeSm (0.875rem) ≈ 11px, etc.
  const css = 'html { font-size: 13px; }\n' + makeLibraryCSS(tokens, ':root');

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

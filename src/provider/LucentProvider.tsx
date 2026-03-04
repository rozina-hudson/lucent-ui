import {
  createContext,
  useContext,
  useEffect,
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
 * as CSS custom properties. Renders a <style> tag inline so tokens
 * are available on the first paint — no useEffect flash.
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

  // Clean up the style tag on unmount
  useEffect(() => {
    return () => {
      document.getElementById(`lucent-tokens-${id}`)?.remove();
    };
  }, [id]);

  return (
    <LucentContext.Provider value={{ theme, tokens }}>
      {/* Inline <style> renders synchronously — tokens available on first paint */}
      <style
        id={`lucent-tokens-${id}`}
        dangerouslySetInnerHTML={{ __html: css }}
      />
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

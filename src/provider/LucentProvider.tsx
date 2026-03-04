import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
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
 * as CSS custom properties on a scoped element.
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
  const styleId = useId();
  const styleRef = useRef<HTMLStyleElement | null>(null);

  const baseTokens = theme === 'dark' ? darkTokens : lightTokens;
  const tokens: LucentTokens = tokenOverrides
    ? { ...baseTokens, ...tokenOverrides }
    : baseTokens;

  useEffect(() => {
    if (!styleRef.current) {
      const el = document.createElement('style');
      el.setAttribute('data-lucent-id', styleId);
      document.head.appendChild(el);
      styleRef.current = el;
    }

    styleRef.current.textContent = makeLibraryCSS(tokens, ':root');

    return () => {
      styleRef.current?.remove();
      styleRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, tokenOverrides]);

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

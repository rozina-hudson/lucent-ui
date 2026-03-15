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
import { adjustLightness } from '../tokens/color.js';
import { deriveTokens } from '../tokens/derive.js';
import { createTheme } from '../tokens/createTheme.js';
import type { LucentTokens, Theme, ThemeAnchors } from '../tokens/types.js';
import type { PresetProp } from '../tokens/presets/types.js';
import { resolvePreset } from '../tokens/presets/resolve.js';

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
  /**
   * A design preset that bundles palette, shape, density, and shadow tokens.
   * Pass a combined preset name (`"modern"`, `"enterprise"`, `"playful"`) or
   * an object to mix dimensions: `{ palette: 'indigo', shape: 'pill' }`.
   *
   * Precedence (later wins): base theme → preset → anchors → tokens.
   */
  preset?: PresetProp;
  /**
   * Full or partial token overrides. Individual tokens can be set here and
   * any missing variant tokens will be derived automatically.
   */
  tokens?: Partial<LucentTokens>;
  /**
   * Shorthand for specifying only the 9 anchor colors and letting the library
   * derive the full token set automatically. When provided, `tokens` is ignored.
   * Equivalent to passing `tokens={createTheme(anchors, theme)}`.
   */
  anchors?: ThemeAnchors;
  children: ReactNode;
}

/**
 * Wraps your app (or a subtree) and injects Lucent design tokens
 * as CSS custom properties into <head>. Uses useLayoutEffect so
 * styles are applied synchronously before first paint.
 *
 * @example
 * // Minimal: 9 anchor colors → full theme
 * <LucentProvider anchors={{ bgBase: '#fff', accentDefault: '#6366f1', ... }}>
 *   <App />
 * </LucentProvider>
 *
 * @example
 * // Full control via partial overrides
 * <LucentProvider theme="dark" tokens={{ accentDefault: '#f59e0b' }}>
 *   <App />
 * </LucentProvider>
 */
export function LucentProvider({
  theme = 'light',
  preset,
  tokens: tokenOverrides,
  anchors,
  children,
}: LucentProviderProps) {
  const id = useId().replace(/:/g, '');

  // Resolve preset into a flat partial token set (palette colors are fully
  // derived via createTheme inside resolvePreset).
  const presetTokens = preset ? resolvePreset(preset, theme) : undefined;

  // Precedence: base theme → preset → anchors → tokens.
  const tokens: LucentTokens = (() => {
    if (anchors) {
      // anchors fully derive colors; preset shape/density/shadow survive on top.
      const anchorTokens = createTheme(anchors, theme);
      if (presetTokens) {
        // Extract only layout tokens (spacing, radius, shadow, motion) from preset
        // so anchor-derived colors always win.
        const layoutOverrides: Partial<LucentTokens> = {};
        for (const [k, v] of Object.entries(presetTokens)) {
          if (k.startsWith('space') || k.startsWith('radius') ||
              k.startsWith('shadow') || k.startsWith('duration') || k.startsWith('easing')) {
            (layoutOverrides as Record<string, string>)[k] = v;
          }
        }
        return { ...anchorTokens, ...layoutOverrides };
      }
      return anchorTokens;
    }

    const baseTokens = theme === 'dark' ? darkTokens : lightTokens;
    const effectiveOverrides = presetTokens
      ? { ...presetTokens, ...tokenOverrides }
      : tokenOverrides;

    const merged: LucentTokens = effectiveOverrides
      ? { ...baseTokens, ...effectiveOverrides }
      : baseTokens;

    // Derive variant tokens from any anchor overrides the consumer provided.
    // Only fills keys that are absent from overrides — never clobbers
    // explicit user values. Skipped entirely when no overrides are passed.
    const derived = effectiveOverrides ? deriveTokens(effectiveOverrides, merged, theme) : {};

    // Auto-compute textOnAccent from the resolved accent color unless the consumer
    // explicitly overrides it. This guarantees WCAG AA contrast on accent surfaces
    // regardless of which accent color is in use.
    //
    // We also derive a slightly tweaked border colour for the primary/accent
    // variant so that when people supply a custom accent the border still has
    // enough contrast against the surrounding surface in both light & dark
    // themes.  The consumer can still override `accentBorder` if they really
    // want to pick a specific value; this computation only applies when the
    // token is _not_ provided.
    const computedBorder = effectiveOverrides?.accentBorder
      ?? (theme === 'light'
        ? adjustLightness(merged.accentDefault, -0.15)
        : adjustLightness(merged.accentDefault, 0.15));

    return {
      ...merged,
      ...derived,
      textOnAccent: effectiveOverrides?.textOnAccent ?? getContrastText(merged.accentDefault),
      accentBorder: computedBorder,
    };
  })();

  // Set the root font size once so all rem-based tokens resolve to the intended scale.
  // 14px base: fontSizeMd (1rem) = 14px, fontSizeSm (0.875rem) ≈ 12px, etc.
  const css = 'html { font-size: 14px; }\n' + makeLibraryCSS(tokens, ':root');

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

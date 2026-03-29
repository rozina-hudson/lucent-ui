import { adjustLightness } from './color.js';
import { getAccentFg } from './contrast.js';
import type { Theme } from './types.js';

/**
 * The 5 accent tokens that form the accent layer.
 *
 * These are the only tokens that change when the user picks a different brand
 * color. Backgrounds, surfaces, borders, and text remain neutral.
 */
export interface AccentTokens {
  accentDefault: string;
  accentHover: string;
  accentSubtle: string;
  accentBorder: string;
  accentFg: string;
}

/**
 * Derive the complete set of 5 accent tokens from a single hex color.
 *
 * This is the standalone equivalent of the accent derivation that
 * `LucentProvider` and `createTheme` perform internally. Use it when you
 * need accent tokens outside of the provider (e.g. for a charting library,
 * email template, or server-side rendering).
 *
 * @param color - The accent hex color (e.g. `'#6366f1'`).
 * @param theme - Target theme; defaults to `'light'`.
 * @returns The 5 accent tokens ready to spread into a `Partial<LucentTokens>`.
 *
 * @example
 * const accent = accentTokens('#6366f1');
 * // { accentDefault: '#6366f1', accentHover: '...', accentSubtle: '...', accentBorder: '...', accentFg: '#ffffff' }
 *
 * @example
 * <LucentProvider tokens={{ ...accentTokens('#8b5cf6') }}>
 *   <App />
 * </LucentProvider>
 */
export function accentTokens(color: string, theme: Theme = 'light'): AccentTokens {
  const isLight = theme === 'light';

  return {
    accentDefault: color,
    accentHover: adjustLightness(color, isLight ? +0.05 : -0.07),
    accentSubtle: adjustLightness(color, isLight ? +0.85 : -0.60),
    accentBorder: adjustLightness(color, isLight ? -0.15 : +0.15),
    accentFg: getAccentFg(color),
  };
}

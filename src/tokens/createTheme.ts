import { lightTokens } from './light.js';
import { darkTokens } from './dark.js';
import { deriveTokens } from './derive.js';
import { getAccentFg } from './contrast.js';
import { adjustLightness } from './color.js';
import type { LucentTokens, Theme, ThemeAnchors } from './types.js';

/**
 * Build a complete `LucentTokens` object from a minimal set of anchor colors.
 *
 * Variant tokens (hover, active, subtle, text, border, etc.) are derived
 * automatically — you only need to specify the 9 anchor colors. The result
 * can be passed directly to `<LucentProvider tokens={...}>`, or use the
 * `anchors` prop shorthand to skip this call entirely.
 *
 * @param anchors - The 9 brand/semantic anchor colors.
 * @param theme   - Target theme; defaults to `'light'`.
 * @returns A fully-resolved `LucentTokens` ready for `LucentProvider`.
 *
 * @example
 * const tokens = createTheme({
 *   bgBase:         '#f9fafb',
 *   borderDefault:  '#e5e7eb',
 *   accentDefault:  '#6366f1',
 *   successDefault: '#22c55e',
 *   warningDefault: '#f59e0b',
 *   dangerDefault:  '#ef4444',
 *   infoDefault:    '#3b82f6',
 *   navigation:     '#ffffff', // optional
 * });
 *
 * // <LucentProvider tokens={tokens}>...</LucentProvider>
 */
export function createTheme(anchors: ThemeAnchors, theme: Theme = 'light'): LucentTokens {
  const baseTokens = theme === 'dark' ? darkTokens : lightTokens;
  const merged: LucentTokens = { ...baseTokens, ...anchors };
  const derived = deriveTokens(anchors, merged, theme);

  const accentBorder =
    theme === 'light'
      ? adjustLightness(merged.accentDefault, -0.15)
      : adjustLightness(merged.accentDefault, 0.15);

  return {
    ...merged,
    ...derived,
    accentFg: getAccentFg(merged.accentDefault),
    accentBorder,
  };
}

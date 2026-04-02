import { adjustLightness, hexToHsl, hslToHex } from './color.js';
import type { LucentTokens, Theme } from './types.js';

/**
 * Derive a surface color from a background color.
 *
 * Light mode: pushes 85% of the way toward white and retains only 30% of
 * the original saturation, producing a near-white tint that still feels
 * cohesive with the page background. For a pure-white bgBase the result
 * is #ffffff (no behavioral change from pre-derivation defaults).
 *
 * Dark mode: lifts lightness by +0.04 (matching scheme.ts's elevation
 * steps) and preserves hue/saturation so tinted dark surfaces look natural.
 */
function deriveSurface(bgBase: string, isLight: boolean): string {
  const [h, s, l] = hexToHsl(bgBase);
  if (isLight) {
    return hslToHex(h, s * 0.3, Math.min(1.0, l + (1 - l) * 0.85));
  }
  return hslToHex(h, s, Math.min(0.25, l + 0.04));
}

// Fixed lightness targets for status subtle/text variants (Tailwind shade-50 / shade-700 equivalents).
// Using fixed targets rather than deltas ensures consistent results regardless of which shade the
// consumer picks for the anchor (e.g. a bright warning yellow at L=0.5 still produces a readable
// tint at L=0.95 instead of clamping at white).
const STATUS_L = {
  subtle: { light: 0.95, dark: 0.12 },
  text:   { light: 0.28, dark: 0.78 },
} as const;

function deriveStatusSubtle(anchor: string, isLight: boolean): string {
  const [h, s] = hexToHsl(anchor);
  // Reduce saturation for the subtle tint so it reads as a wash, not a mid-tone.
  return hslToHex(h, s * 0.5, isLight ? STATUS_L.subtle.light : STATUS_L.subtle.dark);
}

function deriveStatusText(anchor: string, isLight: boolean): string {
  const [h, s] = hexToHsl(anchor);
  return hslToHex(h, s, isLight ? STATUS_L.text.light : STATUS_L.text.dark);
}

/**
 * Derive variant tokens from anchor overrides.
 *
 * When the user provides an anchor token (e.g. `borderDefault`) without
 * providing its variants (e.g. `borderSubtle`, `borderStrong`), this
 * function computes those variants automatically using theme-calibrated
 * lightness deltas.
 *
 * Rules:
 * - Derivation only runs when the anchor is present in `overrides`.
 * - A variant is only filled when it is absent from `overrides`.
 * - Uses `'key' in overrides` (not truthiness) to respect
 *   `exactOptionalPropertyTypes: true`.
 *
 * @param overrides - Raw `tokens` prop from the consumer.
 * @param merged    - Base theme tokens already merged with overrides.
 * @param theme     - Current theme; determines lightness delta direction.
 */
export function deriveTokens(
  overrides: Partial<LucentTokens>,
  merged: LucentTokens,
  theme: Theme,
): Partial<LucentTokens> {
  const derived: Partial<LucentTokens> = {};
  const isLight = theme === 'light';

  // --- Borders ---
  // anchor: borderDefault  variants: borderSubtle (more subtle), borderStrong (more visible)
  if ('borderDefault' in overrides) {
    if (!('borderSubtle' in overrides))
      derived.borderSubtle = adjustLightness(merged.borderDefault, isLight ? +0.05 : -0.02);
    if (!('borderStrong' in overrides))
      derived.borderStrong = adjustLightness(merged.borderDefault, isLight ? -0.27 : +0.19);
  }

  // --- Backgrounds ---
  // anchor: bgBase  variant: bgSubtle (layout region tint)
  // When bgBase changes and surface is not explicitly set, surface is auto-derived
  // so elevated cards visually lift above the page regardless of background color.
  if ('bgBase' in overrides) {
    if (!('bgSubtle' in overrides))
      derived.bgSubtle = adjustLightness(merged.bgBase, isLight ? -0.02 : +0.02);
    if (!('surfaceTint' in overrides))
      derived.surfaceTint = adjustLightness(merged.bgBase, isLight ? -0.04 : +0.03);

    if (!('surface' in overrides)) {
      const surfaceHex = deriveSurface(merged.bgBase, isLight);
      derived.surface = surfaceHex;
      // Cascade: derive surface variants from the new surface
      if (!('surfaceSecondary' in overrides))
        derived.surfaceSecondary = adjustLightness(surfaceHex, isLight ? -0.04 : +0.03);
      if (!('surfaceRaised' in overrides))
        derived.surfaceRaised = adjustLightness(surfaceHex, isLight ? 0 : +0.06);
      if (!('surfaceOverlay' in overrides))
        derived.surfaceOverlay = adjustLightness(surfaceHex, isLight ? 0 : +0.06);
    }
  }

  // --- Surfaces ---
  // anchor: surface  variants: surfaceSecondary (tinted fill), surfaceRaised (dropdowns/popovers), surfaceOverlay (modals)
  // Light: elevation via shadow — secondary is slightly darker tint, raised/overlay stay the same color.
  // Dark:  elevation via lightness — secondary is slightly lighter, raised/overlay are more elevated.
  if ('surface' in overrides) {
    if (!('surfaceSecondary' in overrides))
      derived.surfaceSecondary = adjustLightness(merged.surface, isLight ? -0.04 : +0.03);
    if (!('surfaceRaised' in overrides))
      derived.surfaceRaised = adjustLightness(merged.surface, isLight ? 0 : +0.06);
    if (!('surfaceOverlay' in overrides))
      derived.surfaceOverlay = adjustLightness(merged.surface, isLight ? 0 : +0.06);
  }

  // --- Text ---
  // anchor: textPrimary  variants: textSecondary (muted), textDisabled (more muted)
  if ('textPrimary' in overrides) {
    if (!('textSecondary' in overrides))
      derived.textSecondary = adjustLightness(merged.textPrimary, isLight ? +0.20 : -0.15);
    if (!('textDisabled' in overrides))
      derived.textDisabled = adjustLightness(merged.textPrimary, isLight ? +0.58 : -0.62);
  }

  // --- Accent variants ---
  // anchor: accentDefault  variants: accentHover, accentSubtle
  // Note: accentBorder and accentFg are handled separately in LucentProvider.
  if ('accentDefault' in overrides) {
    if (!('accentHover' in overrides))
      derived.accentHover = adjustLightness(merged.accentDefault, isLight ? +0.05 : -0.07);
    if (!('accentSubtle' in overrides))
      derived.accentSubtle = adjustLightness(merged.accentDefault, isLight ? +0.85 : -0.60);
  }

  // --- Status tokens ---
  // Each anchor derives its subtle (pale tint) and text (readable foreground) variants using
  // fixed lightness targets rather than deltas — consistent regardless of anchor shade chosen.
  if ('successDefault' in overrides) {
    if (!('successSubtle' in overrides))
      derived.successSubtle = deriveStatusSubtle(merged.successDefault, isLight);
    if (!('successText' in overrides))
      derived.successText = deriveStatusText(merged.successDefault, isLight);
  }

  if ('warningDefault' in overrides) {
    if (!('warningSubtle' in overrides))
      derived.warningSubtle = deriveStatusSubtle(merged.warningDefault, isLight);
    if (!('warningText' in overrides))
      derived.warningText = deriveStatusText(merged.warningDefault, isLight);
  }

  if ('dangerDefault' in overrides) {
    if (!('dangerHover' in overrides))
      derived.dangerHover = adjustLightness(merged.dangerDefault, isLight ? +0.05 : -0.07);
    if (!('dangerSubtle' in overrides))
      derived.dangerSubtle = deriveStatusSubtle(merged.dangerDefault, isLight);
    if (!('dangerText' in overrides))
      derived.dangerText = deriveStatusText(merged.dangerDefault, isLight);
  }

  if ('infoDefault' in overrides) {
    if (!('infoSubtle' in overrides))
      derived.infoSubtle = deriveStatusSubtle(merged.infoDefault, isLight);
    if (!('infoText' in overrides))
      derived.infoText = deriveStatusText(merged.infoDefault, isLight);
  }

  return derived;
}

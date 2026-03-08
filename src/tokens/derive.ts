import { adjustLightness } from './color.js';
import type { LucentTokens, Theme } from './types.js';

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
  if ('bgBase' in overrides) {
    if (!('bgSubtle' in overrides))
      derived.bgSubtle = adjustLightness(merged.bgBase, isLight ? -0.02 : +0.02);
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
      derived.textDisabled = adjustLightness(merged.textPrimary, isLight ? +0.35 : -0.40);
  }

  // --- Accent variants ---
  // anchor: accentDefault  variants: accentHover, accentActive, accentSubtle
  // Note: accentBorder and textOnAccent are handled separately in LucentProvider.
  if ('accentDefault' in overrides) {
    if (!('accentHover' in overrides))
      derived.accentHover = adjustLightness(merged.accentDefault, isLight ? +0.05 : -0.07);
    if (!('accentActive' in overrides))
      derived.accentActive = adjustLightness(merged.accentDefault, isLight ? +0.13 : -0.14);
    if (!('accentSubtle' in overrides))
      derived.accentSubtle = adjustLightness(merged.accentDefault, isLight ? +0.85 : -0.60);
  }

  return derived;
}

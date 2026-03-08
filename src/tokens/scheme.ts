import { hexToHsl, hslToHex, adjustLightness } from './color.js';
import { darkShadowTokens } from './base.js';
import type { LucentTokens } from './types.js';

// Hue and saturation applied to near-neutral (unsaturated) dark surfaces.
// Gives the characteristic cool blue-gray look of dark UIs.
const DARK_TINT_H = 222;
const DARK_TINT_S = 0.12;

// For near-white / pure-gray inputs (saturation < 4%), apply a cool blue tint
// so derived dark surfaces have the same character as hand-crafted dark themes.
function tinted(h: number, s: number): [number, number] {
  return s < 0.04 ? [DARK_TINT_H, DARK_TINT_S] : [h, s];
}

// Map a near-white bg to a near-black one, preserving hue/saturation.
// Calibrated so L=1.0 → 0.07, L=0.98 → 0.09, L=0.96 → 0.11.
function toBgDark(hex: string): string {
  const [h, s, l] = hexToHsl(hex);
  const [dh, ds] = tinted(h, s);
  return hslToHex(dh, ds, Math.max(0.04, Math.min(0.20, 0.07 + (1 - l))));
}

// Map a light border (near-white, L ≈ 0.64–0.96) to a dark one.
// Calibrated: L=0.91 → 0.11, L=0.96 → 0.08, L=0.64 → 0.28.
function toBorderDark(hex: string): string {
  const [h, s, l] = hexToHsl(hex);
  const [dh, ds] = tinted(h, s);
  return hslToHex(dh, ds, Math.max(0.06, Math.min(0.50, (1 - l) * 0.60 + 0.06)));
}

// Invert text lightness: dark-on-light → light-on-dark.
// Calibrated: L=0.11 → 0.93, L=0.44 → 0.63, L=0.63 → 0.41.
function toTextDark(hex: string): string {
  const [h, s, l] = hexToHsl(hex);
  return hslToHex(h, s, Math.max(0.04, Math.min(0.97, 1 - l + 0.04)));
}

// Invert accent/focus: near-black accent → near-white, and vice-versa.
function toAccentDark(hex: string): string {
  const [h, s, l] = hexToHsl(hex);
  return hslToHex(h, s, Math.max(0.02, Math.min(0.98, 1 - l)));
}

/**
 * Derives a complete dark-mode token set from a light-mode token set.
 *
 * Non-color tokens (typography, spacing, radius, motion) are inherited
 * unchanged. Each semantic color group is mapped with a calibrated
 * lightness inversion so the result is visually consistent with a
 * hand-crafted dark theme.
 *
 * @example
 * // Replacing the hardcoded dark.ts:
 * export const darkTokens = deriveDarkFromLight(lightTokens);
 *
 * // Generating a dark theme from any custom light palette:
 * const myDark = deriveDarkFromLight({ ...lightTokens, bgBase: '#f0f4ff' });
 */
export function deriveDarkFromLight(light: LucentTokens): LucentTokens {
  // Derive the dark bgBase first, then build the full bg/surface hierarchy
  // from it so elevation steps remain consistent regardless of input.
  const darkBgBase = toBgDark(light.bgBase);
  const [bgH, bgS, bgBaseL] = hexToHsl(darkBgBase);
  const bgStep = (n: number) => hslToHex(bgH, bgS, Math.min(0.25, bgBaseL + n));

  return {
    // ── Non-color tokens: carry over from light unchanged ──────────────────
    ...light,

    // ── Shadows: dark variants have higher opacity for visibility ───────────
    ...darkShadowTokens,

    // ── Backgrounds ─────────────────────────────────────────────────────────
    bgBase: darkBgBase,
    bgSubtle: bgStep(0.02),
    bgMuted: bgStep(0.05),
    bgOverlay: 'rgb(0 0 0 / 0.6)',

    // ── Surfaces: slight elevation steps above bgBase ────────────────────────
    surfaceDefault: bgStep(0.02),
    surfaceRaised: bgStep(0.05),
    surfaceOverlay: bgStep(0.05),

    // ── Borders ──────────────────────────────────────────────────────────────
    borderDefault: toBorderDark(light.borderDefault),
    borderSubtle: toBorderDark(light.borderSubtle),
    borderStrong: toBorderDark(light.borderStrong),

    // ── Text ─────────────────────────────────────────────────────────────────
    textPrimary: toTextDark(light.textPrimary),
    textSecondary: toTextDark(light.textSecondary),
    textDisabled: toTextDark(light.textDisabled),
    // textInverse flips to dark bg so it reads on light accent surfaces
    textInverse: darkBgBase,
    textOnAccent: light.textOnAccent, // auto-recomputed by LucentProvider

    // ── Accent ───────────────────────────────────────────────────────────────
    accentDefault: toAccentDark(light.accentDefault),
    accentHover: toAccentDark(light.accentHover),
    accentActive: toAccentDark(light.accentActive),
    accentSubtle: toAccentDark(light.accentSubtle),
    accentBorder: light.accentBorder, // auto-recomputed by LucentProvider

    // ── Status: lighten defaults for visibility; darken for subtle bg ─────────
    successDefault: adjustLightness(light.successDefault, +0.10),
    successSubtle: adjustLightness(light.successDefault, -0.25),
    successText: adjustLightness(light.successText, +0.15),

    warningDefault: adjustLightness(light.warningDefault, +0.10),
    warningSubtle: adjustLightness(light.warningDefault, -0.25),
    warningText: adjustLightness(light.warningText, +0.15),

    dangerDefault: adjustLightness(light.dangerDefault, +0.10),
    dangerHover: adjustLightness(light.dangerHover, +0.10),
    dangerSubtle: adjustLightness(light.dangerDefault, -0.25),
    dangerText: adjustLightness(light.dangerText, +0.15),

    infoDefault: adjustLightness(light.infoDefault, +0.10),
    infoSubtle: adjustLightness(light.infoDefault, -0.25),
    infoText: adjustLightness(light.infoText, +0.15),

    // ── Focus ─────────────────────────────────────────────────────────────────
    focusRing: toAccentDark(light.focusRing),
  };
}

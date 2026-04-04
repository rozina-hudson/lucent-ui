import type { LucentTokens, Theme } from '../tokens/types.js';
import type { ShadowName, ShadowPreset } from '../tokens/presets/types.js';
import { getAccentFg, ensureContrast } from '../tokens/contrast.js';
import { adjustLightness } from '../tokens/color.js';
import { flatShadow, subtleShadow, elevatedShadow, liquidGlassShadow, brutalistShadow, neumorphicShadow, naturalShadow, glowShadow } from '../tokens/presets/shadows/index.js';
import { lightShadowTokens, darkShadowTokens } from '../tokens/base.js';

// ── Accent Derivation ───────────────────────────────────────────────────────
// Replicates the computation LucentProvider does when accentDefault changes.

export function deriveAccentTokens(
  accentHex: string,
  theme: Theme,
): Partial<LucentTokens> {
  // 1. Compute hue-tinted foreground with APCA contrast
  const accentFg = getAccentFg(accentHex);
  // 2. Nudge accent if APCA contrast is too low against the fg
  const adjustedAccent = ensureContrast(accentHex, accentFg);
  // 3. Derive hover, subtle, and border
  const isLight = theme === 'light';
  const accentHover = adjustLightness(adjustedAccent, isLight ? +0.05 : -0.07);
  const accentSubtle = adjustLightness(adjustedAccent, isLight ? +0.85 : -0.60);
  const accentBorder = adjustLightness(adjustedAccent, isLight ? -0.15 : +0.15);

  return {
    accentDefault: adjustedAccent,
    accentFg,
    accentHover,
    accentSubtle,
    accentBorder,
  };
}

// ── Background Derivation ───────────────────────────────────────────────────

export function deriveBgTokens(
  bgHex: string,
  theme: Theme,
): Partial<LucentTokens> {
  const isLight = theme === 'light';
  const bgSubtle = adjustLightness(bgHex, isLight ? -0.02 : +0.02);
  const surfaceTint = adjustLightness(bgHex, isLight ? -0.04 : +0.03);

  return {
    bgBase: bgHex,
    bgSubtle,
    surfaceTint,
  };
}

// ── Border Derivation ───────────────────────────────────────────────────────

export function deriveBorderTokens(
  borderHex: string,
  theme: Theme,
): Partial<LucentTokens> {
  const isLight = theme === 'light';
  return {
    borderDefault: borderHex,
    borderSubtle: adjustLightness(borderHex, isLight ? +0.05 : -0.02),
    borderStrong: adjustLightness(borderHex, isLight ? -0.27 : +0.19),
  };
}

// ── Surface Derivation ──────────────────────────────────────────────────────

export function deriveSurfaceTokens(
  surfaceHex: string,
  theme: Theme,
): Partial<LucentTokens> {
  const isLight = theme === 'light';
  return {
    surface: surfaceHex,
    surfaceSecondary: adjustLightness(surfaceHex, isLight ? -0.04 : +0.03),
    surfaceRaised: adjustLightness(surfaceHex, isLight ? 0 : +0.06),
    surfaceOverlay: adjustLightness(surfaceHex, isLight ? 0 : +0.06),
  };
}

// ── Type Scale ──────────────────────────────────────────────────────────────
// Steps relative to Md (base): Xs=-2, Sm=-1, Md=0, Lg=1, Xl=2, 2xl=3, 3xl=4

const FONT_SIZE_STEPS: { key: keyof LucentTokens; step: number }[] = [
  { key: 'fontSizeXs', step: -2 },
  { key: 'fontSizeSm', step: -1 },
  { key: 'fontSizeMd', step: 0 },
  { key: 'fontSizeLg', step: 1 },
  { key: 'fontSizeXl', step: 2 },
  { key: 'fontSize2xl', step: 3 },
  { key: 'fontSize3xl', step: 4 },
];

export function computeTypeScale(
  baseRem: number,
  ratio: number,
): Partial<LucentTokens> {
  const result: Partial<LucentTokens> = {};
  for (const { key, step } of FONT_SIZE_STEPS) {
    const value = baseRem * Math.pow(ratio, step);
    // Round to 3 decimal places for clean rem values
    const rounded = Math.round(value * 1000) / 1000;
    (result as Record<string, string>)[key] = `${rounded}rem`;
  }
  return result;
}

export const TYPE_SCALE_PRESETS = [
  { label: 'Minor Second', ratio: 1.067 },
  { label: 'Major Second', ratio: 1.125 },
  { label: 'Minor Third', ratio: 1.2 },
  { label: 'Major Third', ratio: 1.25 },
  { label: 'Perfect Fourth', ratio: 1.333 },
  { label: 'Golden Ratio', ratio: 1.618 },
] as const;

// ── Density (Spacing) ───────────────────────────────────────────────────────
// Compact = 0.8× default, Spacious = 1.25× default.
// Slider range [0, 1]: 0 = compact, 0.5 = default, 1 = spacious.

const DEFAULT_SPACING: { key: keyof LucentTokens; rem: number }[] = [
  { key: 'space0', rem: 0 },
  { key: 'space1', rem: 0.25 },
  { key: 'space2', rem: 0.5 },
  { key: 'space3', rem: 0.75 },
  { key: 'space4', rem: 1 },
  { key: 'space5', rem: 1.25 },
  { key: 'space6', rem: 1.5 },
  { key: 'space8', rem: 2 },
  { key: 'space10', rem: 2.5 },
  { key: 'space12', rem: 3 },
  { key: 'space16', rem: 4 },
  { key: 'space20', rem: 5 },
  { key: 'space24', rem: 6 },
];

export function computeDensity(factor: number): Partial<LucentTokens> {
  const result: Partial<LucentTokens> = {};
  for (const { key, rem } of DEFAULT_SPACING) {
    if (rem === 0) {
      (result as Record<string, string>)[key] = '0px';
      continue;
    }
    const scaled = Math.round(rem * factor * 1000) / 1000;
    (result as Record<string, string>)[key] = `${scaled}rem`;
  }
  return result;
}

// ── Roundness (Border Radius) ───────────────────────────────────────────────
// Interpolate between sharp (t=0) → rounded (t=0.5) → pill (t=1).
// radiusNone and radiusFull are fixed.

const RADIUS_RANGE: { key: keyof LucentTokens; sharp: number; rounded: number; pill: number }[] = [
  { key: 'radiusSm', sharp: 0, rounded: 0.25, pill: 0.5 },
  { key: 'radiusMd', sharp: 0, rounded: 0.375, pill: 0.75 },
  { key: 'radiusLg', sharp: 0, rounded: 0.5, pill: 1 },
  { key: 'radiusXl', sharp: 0, rounded: 0.75, pill: 1.5 },
];

export function computeRoundness(t: number): Partial<LucentTokens> {
  const result: Partial<LucentTokens> = {};
  for (const { key, sharp, rounded, pill } of RADIUS_RANGE) {
    // Piecewise linear: [0, 0.5] → sharp to rounded, [0.5, 1] → rounded to pill
    let value: number;
    if (t <= 0.5) {
      const local = t / 0.5;
      value = sharp + (rounded - sharp) * local;
    } else {
      const local = (t - 0.5) / 0.5;
      value = rounded + (pill - rounded) * local;
    }
    const rem = Math.round(value * 1000) / 1000;
    (result as Record<string, string>)[key] = `${rem}rem`;
  }
  return result;
}

// ── Shadow Style ────────────────────────────────────────────────────────────

export type ShadowStyle = 'default' | ShadowName;

const SHADOW_PRESETS: Record<Exclude<ShadowStyle, 'default'>, ShadowPreset> = {
  flat: flatShadow,
  subtle: subtleShadow,
  elevated: elevatedShadow,
  liquidGlass: liquidGlassShadow,
  brutalist: brutalistShadow,
  neumorphic: neumorphicShadow,
  natural: naturalShadow,
  glow: glowShadow,
};

export const SHADOW_STYLE_OPTIONS: { value: ShadowStyle; label: string }[] = [
  { value: 'flat', label: 'Flat' },
  { value: 'default', label: 'Default' },
  { value: 'subtle', label: 'Subtle' },
  { value: 'elevated', label: 'Elevated' },
  { value: 'natural', label: 'Natural' },
  { value: 'liquidGlass', label: 'Liquid Glass' },
  { value: 'neumorphic', label: 'Neumorphic' },
  { value: 'brutalist', label: 'Brutalist' },
  { value: 'glow', label: 'Glow' },
];

export function computeShadows(
  style: ShadowStyle,
  theme: 'light' | 'dark',
): Partial<LucentTokens> {
  if (style === 'default') {
    return (theme === 'dark' ? darkShadowTokens : lightShadowTokens) as Partial<LucentTokens>;
  }
  const preset = SHADOW_PRESETS[style];
  return (theme === 'dark' ? preset.dark : preset.light) as Partial<LucentTokens>;
}

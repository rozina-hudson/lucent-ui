import type { LucentTokens, Theme } from '../types.js';
import { createTheme } from '../createTheme.js';
import type {
  PresetProp,
  ColorPalette,
  ShapePreset,
  DensityPreset,
  ShadowPreset,
  PaletteName,
  ShapeName,
  DensityName,
  ShadowName,
  DesignPreset,
} from './types.js';

import { defaultPalette } from './palettes/default.js';
import { brandPalette } from './palettes/brand.js';
import { indigoPalette } from './palettes/indigo.js';
import { emeraldPalette } from './palettes/emerald.js';
import { rosePalette } from './palettes/rose.js';
import { oceanPalette } from './palettes/ocean.js';

import { sharpShape } from './shapes/sharp.js';
import { roundedShape } from './shapes/rounded.js';
import { pillShape } from './shapes/pill.js';

import { compactDensity } from './densities/compact.js';
import { defaultDensity } from './densities/default.js';
import { spaciousDensity } from './densities/spacious.js';

import { flatShadow } from './shadows/flat.js';
import { subtleShadow } from './shadows/subtle.js';
import { elevatedShadow } from './shadows/elevated.js';

import { modernPreset } from './combined/modern.js';
import { enterprisePreset } from './combined/enterprise.js';
import { playfulPreset } from './combined/playful.js';

// ─── Lookup maps ─────────────────────────────────────────────────────────────

const paletteMap: Record<PaletteName, ColorPalette> = {
  default: defaultPalette,
  brand: brandPalette,
  indigo: indigoPalette,
  emerald: emeraldPalette,
  rose: rosePalette,
  ocean: oceanPalette,
};

const shapeMap: Record<ShapeName, ShapePreset> = {
  sharp: sharpShape,
  rounded: roundedShape,
  pill: pillShape,
};

const densityMap: Record<DensityName, DensityPreset> = {
  compact: compactDensity,
  default: defaultDensity,
  spacious: spaciousDensity,
};

const shadowMap: Record<ShadowName, ShadowPreset> = {
  flat: flatShadow,
  subtle: subtleShadow,
  elevated: elevatedShadow,
};

const combinedMap: Record<string, DesignPreset> = {
  modern: modernPreset,
  enterprise: enterprisePreset,
  playful: playfulPreset,
};

// ─── Resolver ────────────────────────────────────────────────────────────────

function resolvePalette(value: PaletteName | ColorPalette): ColorPalette {
  return typeof value === 'string' ? paletteMap[value] : value;
}

function resolveShape(value: ShapeName | ShapePreset): ShapePreset {
  return typeof value === 'string' ? shapeMap[value] : value;
}

function resolveDensity(value: DensityName | DensityPreset): DensityPreset {
  return typeof value === 'string' ? densityMap[value] : value;
}

function resolveShadow(value: ShadowName | ShadowPreset): ShadowPreset {
  return typeof value === 'string' ? shadowMap[value] : value;
}

/**
 * Resolves a `PresetProp` into a flat `Partial<LucentTokens>` that can be
 * spread over the base theme. Palette colors are fully derived via
 * `createTheme()`, so all hover/active/subtle/text variants are included.
 */
export function resolvePreset(preset: PresetProp, theme: Theme): Partial<LucentTokens> {
  let palette: ColorPalette | undefined;
  let shape: ShapePreset | undefined;
  let density: DensityPreset | undefined;
  let shadow: ShadowPreset | undefined;

  if (typeof preset === 'string') {
    const combined = combinedMap[preset];
    if (!combined) return {};
    palette = combined.palette;
    shape = combined.shape;
    density = combined.density;
    shadow = combined.shadow;
  } else {
    if (preset.palette !== undefined) palette = resolvePalette(preset.palette);
    if (preset.shape !== undefined) shape = resolveShape(preset.shape);
    if (preset.density !== undefined) density = resolveDensity(preset.density);
    if (preset.shadow !== undefined) shadow = resolveShadow(preset.shadow);
  }

  const tokens: Partial<LucentTokens> = {};

  if (palette) {
    const colorTokens = createTheme(palette[theme], theme);
    Object.assign(tokens, colorTokens);
  }

  if (shape) Object.assign(tokens, shape.tokens);
  if (density) Object.assign(tokens, density.tokens);
  if (shadow) Object.assign(tokens, shadow[theme]);

  return tokens;
}

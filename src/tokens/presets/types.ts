import type { ThemeAnchors, RadiusTokens, SpacingTokens, ShadowTokens } from '../types.js';

export interface ColorPalette {
  name: string;
  light: ThemeAnchors;
  dark: ThemeAnchors;
}

export interface ShapePreset {
  name: string;
  tokens: RadiusTokens;
}

export interface DensityPreset {
  name: string;
  tokens: SpacingTokens;
}

export interface ShadowPreset {
  name: string;
  light: ShadowTokens;
  dark: ShadowTokens;
}

export interface DesignPreset {
  name: string;
  palette: ColorPalette;
  shape: ShapePreset;
  density: DensityPreset;
  shadow: ShadowPreset;
}

export type PresetName = 'modern' | 'enterprise' | 'playful';
export type PaletteName = 'default' | 'brand' | 'indigo' | 'violet' | 'emerald' | 'teal' | 'rose' | 'coral' | 'amber' | 'ocean' | 'slate' | 'sage';
export type ShapeName = 'sharp' | 'rounded' | 'pill';
export type DensityName = 'compact' | 'default' | 'spacious';
export type ShadowName = 'flat' | 'subtle' | 'elevated';

export type PresetProp =
  | PresetName
  | {
      palette?: PaletteName | ColorPalette;
      shape?: ShapeName | ShapePreset;
      density?: DensityName | DensityPreset;
      shadow?: ShadowName | ShadowPreset;
    };

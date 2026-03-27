// Lucent UI — public API

export * from './components/atoms/index.js';
export * from './components/molecules/index.js';

export { LucentProvider, useLucent, LucentProviderManifest, ThemeAnchorsSpec } from './provider/index.js';
export type { LucentProviderProps } from './provider/index.js';

export { lightTokens, darkTokens, makeLibraryCSS, getContrastText, getAccentFg, brandTokens, deriveTokens, deriveDarkFromLight, createTheme, accentTokens } from './tokens/index.js';
export type { LucentTokens, Theme, ThemeAnchors, AccentTokens } from './tokens/index.js';

// Presets
export {
  defaultPalette, brandPalette, indigoPalette, emeraldPalette, rosePalette, oceanPalette,
  sharpShape, roundedShape, pillShape,
  compactDensity, defaultDensity, spaciousDensity,
  flatShadow, subtleShadow, elevatedShadow,
  modernPreset, enterprisePreset, playfulPreset,
  resolvePreset,
} from './tokens/index.js';
export type {
  ColorPalette, ShapePreset, DensityPreset, ShadowPreset, DesignPreset,
  PresetProp, PresetName, PaletteName, ShapeName, DensityName, ShadowName,
} from './tokens/index.js';

export {
  validateManifest,
  assertManifest,
  isValidPropDescriptor,
  ButtonManifest,
  MANIFEST_SPEC_VERSION,
} from './manifest/index.js';
export type {
  ComponentManifest,
  ComponentTier,
  ComponentDomain,
  PropDescriptor,
  PropType,
  UsageExample,
  CompositionNode,
  AccessibilityDescriptor,
  ValidationResult,
  ValidationError,
} from './manifest/index.js';

export const LUCENT_UI_VERSION = '0.1.0';

// Lucent UI — public API

export * from './components/atoms/index.js';

export { LucentProvider, useLucent } from './provider/index.js';
export type { LucentProviderProps } from './provider/index.js';

export { lightTokens, darkTokens, makeLibraryCSS, getContrastText, brandTokens } from './tokens/index.js';
export type { LucentTokens, Theme } from './tokens/index.js';

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

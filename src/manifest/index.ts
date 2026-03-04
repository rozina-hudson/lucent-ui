export type {
  ComponentManifest,
  ComponentTier,
  ComponentDomain,
  PropDescriptor,
  PropType,
  UsageExample,
  CompositionNode,
  AccessibilityDescriptor,
} from './types.js';

export {
  validateManifest,
  assertManifest,
  isValidPropDescriptor,
} from './validate.js';

export type { ValidationResult, ValidationError } from './validate.js';

export { ButtonManifest } from './examples/button.manifest.js';

export const MANIFEST_SPEC_VERSION = '1.0';

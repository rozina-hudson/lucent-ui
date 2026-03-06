import type { LucentTokens } from '../src/tokens/types.js';

/**
 * A design system manifest produced by `lucent-manifest init`.
 *
 * Contains partial token overrides for light and/or dark themes that are
 * merged on top of Lucent's default token set by LucentProvider.
 */
export interface LucentDesignManifest {
  /** Manifest format version — currently "1.0" */
  version: '1.0';
  /** Display name of the design system */
  name: string;
  /** Optional description */
  description?: string;
  /** Token overrides, keyed by theme */
  tokens: {
    light?: Partial<LucentTokens>;
    dark?: Partial<LucentTokens>;
  };
}

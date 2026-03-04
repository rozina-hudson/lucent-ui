import type { LucentTokens } from './types.js';

/**
 * Gold brand token overrides — the original lucentui.ai accent palette.
 *
 * Pass to `<LucentProvider tokens={brandTokens}>` to opt in to the gold accent.
 * `textOnAccent` is automatically computed by the provider via `getContrastText`,
 * so text on accent surfaces will always meet WCAG AA contrast.
 *
 * @example
 * import { brandTokens } from 'lucent-ui';
 * <LucentProvider tokens={brandTokens}><App /></LucentProvider>
 */
export const brandTokens: Partial<LucentTokens> = {
  accentDefault: '#e9c96b',
  accentHover: '#ddb84e',
  accentActive: '#c9a33b',
  accentSubtle: '#fef9ec',
  focusRing: '#e9c96b',
};

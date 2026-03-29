import type { ShadowPreset } from '../types.js';

/**
 * Ambient Glow — accent-colored shadows that make elements appear
 * to emit light. Uses `color-mix()` with `var(--lucent-accent-default)`
 * so the glow automatically follows the active accent color.
 *
 * Particularly effective in dark mode where the glow reads as a
 * bloom / light source against the dark canvas.
 */
export const glowShadow: ShadowPreset = {
  name: 'glow',
  light: {
    shadowNone: 'none',
    shadowSm:
      '0 1px 3px rgba(0, 0, 0, 0.06), ' +
      '0 0 12px color-mix(in srgb, var(--lucent-accent-default) 12%, transparent)',
    shadowMd:
      '0 2px 6px rgba(0, 0, 0, 0.06), ' +
      '0 0 20px color-mix(in srgb, var(--lucent-accent-default) 16%, transparent)',
    shadowLg:
      '0 4px 10px rgba(0, 0, 0, 0.06), ' +
      '0 0 30px color-mix(in srgb, var(--lucent-accent-default) 20%, transparent)',
    shadowXl:
      '0 6px 14px rgba(0, 0, 0, 0.06), ' +
      '0 0 44px color-mix(in srgb, var(--lucent-accent-default) 25%, transparent)',
  },
  dark: {
    shadowNone: 'none',
    shadowSm:
      '0 0 16px color-mix(in srgb, var(--lucent-accent-default) 20%, transparent)',
    shadowMd:
      '0 0 24px color-mix(in srgb, var(--lucent-accent-default) 28%, transparent)',
    shadowLg:
      '0 0 36px color-mix(in srgb, var(--lucent-accent-default) 35%, transparent)',
    shadowXl:
      '0 0 50px color-mix(in srgb, var(--lucent-accent-default) 40%, transparent)',
  },
};

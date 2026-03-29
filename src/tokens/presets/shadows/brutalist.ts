import type { ShadowPreset } from '../types.js';

/**
 * Neo-Brutalist — thick solid outline + hard offset "block" shadow, 0 blur.
 *
 * Light mode: dark outline ring + accent-tinted offset block.
 * Dark mode: accent-colored outline ring + accent offset block.
 * The outline flips from dark (absorbing) to bright (emitting) —
 * in dark mode the thick border itself becomes the light source,
 * using the accent color instead of black.
 *
 * Uses `color-mix()` and CSS vars so it follows the active accent.
 */
export const brutalistShadow: ShadowPreset = {
  name: 'brutalist',
  light: {
    shadowNone: 'none',
    shadowSm:
      '0 0 0 2px var(--lucent-text-primary), ' +
      '3px 3px 0 0 color-mix(in srgb, var(--lucent-accent-default) 50%, transparent)',
    shadowMd:
      '0 0 0 2px var(--lucent-text-primary), ' +
      '5px 5px 0 0 color-mix(in srgb, var(--lucent-accent-default) 60%, transparent)',
    shadowLg:
      '0 0 0 3px var(--lucent-text-primary), ' +
      '6px 6px 0 0 color-mix(in srgb, var(--lucent-accent-default) 70%, transparent)',
    shadowXl:
      '0 0 0 3px var(--lucent-text-primary), ' +
      '8px 8px 0 0 color-mix(in srgb, var(--lucent-accent-default) 80%, transparent)',
  },
  dark: {
    shadowNone: 'none',
    shadowSm:
      '0 0 0 2px color-mix(in srgb, var(--lucent-accent-default) 60%, transparent), ' +
      '3px 3px 0 0 color-mix(in srgb, var(--lucent-accent-default) 30%, transparent)',
    shadowMd:
      '0 0 0 2px color-mix(in srgb, var(--lucent-accent-default) 65%, transparent), ' +
      '5px 5px 0 0 color-mix(in srgb, var(--lucent-accent-default) 35%, transparent)',
    shadowLg:
      '0 0 0 3px color-mix(in srgb, var(--lucent-accent-default) 70%, transparent), ' +
      '6px 6px 0 0 color-mix(in srgb, var(--lucent-accent-default) 40%, transparent)',
    shadowXl:
      '0 0 0 3px color-mix(in srgb, var(--lucent-accent-default) 75%, transparent), ' +
      '8px 8px 0 0 color-mix(in srgb, var(--lucent-accent-default) 45%, transparent)',
  },
};

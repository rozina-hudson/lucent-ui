import type { ShadowPreset } from '../types.js';

/**
 * Neumorphic — light mode uses classic dual light/dark shadows
 * for the extruded soft-UI look.
 *
 * Dark mode shifts to "chromatic" — offset split-color accent
 * glow (warm-shifted on one side, cool-shifted on the other).
 * Creates a CRT/screen-like depth that reads as physical without
 * relying on darkening. Uses `color-mix()` so it follows the
 * active accent automatically.
 */
export const neumorphicShadow: ShadowPreset = {
  name: 'neumorphic',
  light: {
    shadowNone: 'none',
    shadowSm: '3px 3px 8px #d1d5db, -3px -3px 8px #ffffff',
    shadowMd: '5px 5px 14px #d1d5db, -5px -5px 14px #ffffff',
    shadowLg: '8px 8px 20px #d1d5db, -8px -8px 20px #ffffff',
    shadowXl: '12px 12px 28px #d1d5db, -12px -12px 28px #ffffff',
  },
  dark: {
    shadowNone: 'none',
    shadowSm:
      '3px 3px 10px color-mix(in srgb, var(--lucent-accent-default) 12%, transparent), ' +
      '-3px -3px 10px rgba(255, 255, 255, 0.03)',
    shadowMd:
      '5px 5px 16px color-mix(in srgb, var(--lucent-accent-default) 15%, transparent), ' +
      '-5px -5px 16px rgba(255, 255, 255, 0.04)',
    shadowLg:
      '8px 8px 24px color-mix(in srgb, var(--lucent-accent-default) 18%, transparent), ' +
      '-8px -8px 24px rgba(255, 255, 255, 0.05)',
    shadowXl:
      '12px 12px 32px color-mix(in srgb, var(--lucent-accent-default) 22%, transparent), ' +
      '-12px -12px 32px rgba(255, 255, 255, 0.06)',
  },
};

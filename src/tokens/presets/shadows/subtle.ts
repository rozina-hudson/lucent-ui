import type { ShadowPreset } from '../types.js';

/**
 * Subtle — light mode uses wide, low-opacity diffused shadows.
 * Dark mode shifts to "ambient" — an enormous, barely-visible
 * accent-tinted glow that makes surfaces feel warm without
 * creating visible shadow edges.
 */
export const subtleShadow: ShadowPreset = {
  name: 'subtle',
  light: {
    shadowNone: 'none',
    shadowSm: 'rgba(17, 17, 26, 0.04) 0px 2px 8px, rgba(17, 17, 26, 0.02) 0px 4px 16px',
    shadowMd: 'rgba(17, 17, 26, 0.06) 0px 4px 16px, rgba(17, 17, 26, 0.03) 0px 8px 32px',
    shadowLg: 'rgba(17, 17, 26, 0.06) 0px 8px 24px, rgba(17, 17, 26, 0.04) 0px 16px 48px',
    shadowXl: 'rgba(17, 17, 26, 0.08) 0px 12px 32px, rgba(17, 17, 26, 0.05) 0px 24px 64px',
  },
  dark: {
    shadowNone: 'none',
    shadowSm:
      '0 0 20px color-mix(in srgb, var(--lucent-accent-default) 5%, transparent)',
    shadowMd:
      '0 0 30px color-mix(in srgb, var(--lucent-accent-default) 7%, transparent), ' +
      'inset 0 1px 0 0 rgba(255, 255, 255, 0.04)',
    shadowLg:
      '0 0 40px color-mix(in srgb, var(--lucent-accent-default) 9%, transparent), ' +
      'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
    shadowXl:
      '0 0 56px color-mix(in srgb, var(--lucent-accent-default) 12%, transparent), ' +
      'inset 0 1px 0 0 rgba(255, 255, 255, 0.06)',
  },
};

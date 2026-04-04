import type { ShadowPreset } from '../types.js';

/**
 * Neumorphic — bold, dramatic drop shadows that create strong
 * visual lift. Single-layer for clean interaction with borders.
 *
 * Dark mode uses the same approach with higher opacity.
 */
export const neumorphicShadow: ShadowPreset = {
  name: 'neumorphic',
  light: {
    shadowNone: 'none',
    shadowSm: '0 8px 16px rgba(0, 0, 0, 0.12)',
    shadowMd: '0 12px 24px rgba(0, 0, 0, 0.16)',
    shadowLg: '0 20px 30px rgba(0, 0, 0, 0.2)',
    shadowXl: '0 28px 40px rgba(0, 0, 0, 0.24)',
  },
  dark: {
    shadowNone: 'none',
    shadowSm: '0 8px 16px rgba(0, 0, 0, 0.4)',
    shadowMd: '0 12px 24px rgba(0, 0, 0, 0.45)',
    shadowLg: '0 20px 30px rgba(0, 0, 0, 0.5)',
    shadowXl: '0 28px 40px rgba(0, 0, 0, 0.55)',
  },
};

import type { ShadowPreset } from '../types.js';

/**
 * Elevated — light mode uses stronger drop shadows for clear lift.
 * Dark mode shifts to "inset glow" — light radiating from inside
 * the element, creating internal luminosity that reads as elevation.
 */
export const elevatedShadow: ShadowPreset = {
  name: 'elevated',
  light: {
    shadowNone: 'none',
    shadowSm: '0 2px 4px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)',
    shadowMd: '0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.08)',
    shadowLg: '0 8px 24px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.08)',
    shadowXl: '0 16px 40px rgba(0, 0, 0, 0.18), 0 6px 12px rgba(0, 0, 0, 0.1)',
  },
  dark: {
    shadowNone: 'none',
    shadowSm:
      'inset 0 1px 0 0 rgba(255, 255, 255, 0.06), ' +
      'inset 0 0 12px rgba(255, 255, 255, 0.02)',
    shadowMd:
      'inset 0 1px 0 0 rgba(255, 255, 255, 0.08), ' +
      'inset 0 0 20px rgba(255, 255, 255, 0.03), ' +
      '0 0 1px rgba(255, 255, 255, 0.06)',
    shadowLg:
      'inset 0 1px 0 0 rgba(255, 255, 255, 0.1), ' +
      'inset 0 0 28px rgba(255, 255, 255, 0.04), ' +
      '0 0 1px rgba(255, 255, 255, 0.08)',
    shadowXl:
      'inset 0 1px 0 0 rgba(255, 255, 255, 0.12), ' +
      'inset 0 0 36px rgba(255, 255, 255, 0.05), ' +
      '0 0 1px rgba(255, 255, 255, 0.1)',
  },
};

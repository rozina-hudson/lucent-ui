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
    shadowSm: 'rgba(17, 17, 26, 0.05) 0px 2px 8px, rgba(17, 17, 26, 0.03) 0px 4px 16px',
    shadowMd: 'rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.05) 0px 8px 32px',
    shadowLg: 'rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.08) 0px 16px 48px',
    shadowXl: 'rgba(17, 17, 26, 0.12) 0px 12px 32px, rgba(17, 17, 26, 0.1) 0px 24px 64px',
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

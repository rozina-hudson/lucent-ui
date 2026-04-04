import type { ShadowPreset } from '../types.js';

/**
 * Natural — light mode uses stacked multi-layer shadows for
 * physically-accurate light falloff.
 *
 * Dark mode uses stacked "lit edge" layers — multiple subtle
 * top-edge highlights at increasing intensity, creating a
 * graduated brightness that reads as natural overhead lighting.
 */
export const naturalShadow: ShadowPreset = {
  name: 'natural',
  light: {
    shadowNone: 'none',
    shadowSm:
      'rgba(17, 17, 26, 0.05) 0px 2px 8px, rgba(17, 17, 26, 0.03) 0px 4px 16px',
    shadowMd:
      'rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.05) 0px 8px 32px',
    shadowLg:
      'rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.08) 0px 16px 48px',
    shadowXl:
      'rgba(17, 17, 26, 0.12) 0px 12px 32px, rgba(17, 17, 26, 0.1) 0px 24px 64px',
  },
  dark: {
    shadowNone: 'none',
    shadowSm:
      'inset 0 1px 0 0 rgba(255, 255, 255, 0.05), ' +
      'inset 0 0 0 1px rgba(255, 255, 255, 0.03)',
    shadowMd:
      'inset 0 1px 0 0 rgba(255, 255, 255, 0.07), ' +
      'inset 0 0 0 1px rgba(255, 255, 255, 0.04), ' +
      '0 1px 3px rgba(0, 0, 0, 0.15)',
    shadowLg:
      'inset 0 1px 0 0 rgba(255, 255, 255, 0.09), ' +
      'inset 0 0 0 1px rgba(255, 255, 255, 0.05), ' +
      'inset 0 0 16px rgba(255, 255, 255, 0.02), ' +
      '0 2px 6px rgba(0, 0, 0, 0.15)',
    shadowXl:
      'inset 0 1px 0 0 rgba(255, 255, 255, 0.12), ' +
      'inset 0 0 0 1px rgba(255, 255, 255, 0.06), ' +
      'inset 0 0 24px rgba(255, 255, 255, 0.03), ' +
      '0 4px 10px rgba(0, 0, 0, 0.15)',
  },
};

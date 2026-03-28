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
      '0 1px 1px rgba(0, 0, 0, 0.06), ' +
      '0 2px 4px rgba(0, 0, 0, 0.06)',
    shadowMd:
      '0 1px 2px rgba(0, 0, 0, 0.06), ' +
      '0 2px 4px rgba(0, 0, 0, 0.06), ' +
      '0 4px 8px rgba(0, 0, 0, 0.06)',
    shadowLg:
      '0 1px 2px rgba(0, 0, 0, 0.05), ' +
      '0 2px 4px rgba(0, 0, 0, 0.05), ' +
      '0 4px 8px rgba(0, 0, 0, 0.05), ' +
      '0 8px 16px rgba(0, 0, 0, 0.05)',
    shadowXl:
      '0 1px 2px rgba(0, 0, 0, 0.04), ' +
      '0 2px 4px rgba(0, 0, 0, 0.04), ' +
      '0 4px 8px rgba(0, 0, 0, 0.04), ' +
      '0 8px 16px rgba(0, 0, 0, 0.04), ' +
      '0 16px 32px rgba(0, 0, 0, 0.04)',
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

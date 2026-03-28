import type { ShadowPreset } from '../types.js';

/**
 * Liquid Glass — light mode uses diffused, very large blur drops.
 *
 * Dark mode uses frosted light diffusion — soft white glow with an
 * inner highlight that makes elements appear translucent, as if
 * backlit through frosted glass. Best paired with
 * `backdrop-filter: blur()` on the element.
 */
export const liquidGlassShadow: ShadowPreset = {
  name: 'liquidGlass',
  light: {
    shadowNone: 'none',
    shadowSm: '0 4px 30px rgba(0, 0, 0, 0.04)',
    shadowMd: '0 8px 50px rgba(0, 0, 0, 0.05), 0 2px 10px rgba(0, 0, 0, 0.02)',
    shadowLg: '0 12px 60px rgba(0, 0, 0, 0.06), 0 4px 20px rgba(0, 0, 0, 0.03)',
    shadowXl: '0 20px 80px rgba(0, 0, 0, 0.08), 0 8px 30px rgba(0, 0, 0, 0.04)',
  },
  dark: {
    shadowNone: 'none',
    shadowSm:
      'inset 0 1px 0 0 rgba(255, 255, 255, 0.06), ' +
      '0 0 30px rgba(255, 255, 255, 0.02)',
    shadowMd:
      'inset 0 1px 0 0 rgba(255, 255, 255, 0.08), ' +
      'inset 0 0 20px rgba(255, 255, 255, 0.02), ' +
      '0 0 40px rgba(255, 255, 255, 0.03)',
    shadowLg:
      'inset 0 1px 0 0 rgba(255, 255, 255, 0.1), ' +
      'inset 0 0 30px rgba(255, 255, 255, 0.03), ' +
      '0 0 50px rgba(255, 255, 255, 0.04)',
    shadowXl:
      'inset 0 1px 0 0 rgba(255, 255, 255, 0.12), ' +
      'inset 0 0 40px rgba(255, 255, 255, 0.04), ' +
      '0 0 70px rgba(255, 255, 255, 0.05)',
  },
};

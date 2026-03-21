import type { ShadowPreset } from '../types.js';

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
    shadowSm: 'rgba(0, 0, 0, 0.12) 0px 2px 8px, rgba(0, 0, 0, 0.08) 0px 4px 16px',
    shadowMd: 'rgba(0, 0, 0, 0.18) 0px 4px 16px, rgba(0, 0, 0, 0.1) 0px 8px 32px',
    shadowLg: 'rgba(0, 0, 0, 0.18) 0px 8px 24px, rgba(0, 0, 0, 0.12) 0px 16px 48px',
    shadowXl: 'rgba(0, 0, 0, 0.2) 0px 12px 32px, rgba(0, 0, 0, 0.15) 0px 24px 64px',
  },
};

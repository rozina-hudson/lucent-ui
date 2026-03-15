import type { ShadowPreset } from '../types.js';

export const elevatedShadow: ShadowPreset = {
  name: 'elevated',
  light: {
    shadowNone: 'none',
    shadowSm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    shadowMd: '0 4px 8px -1px rgb(0 0 0 / 0.15), 0 2px 6px -2px rgb(0 0 0 / 0.12)',
    shadowLg: '0 12px 20px -4px rgb(0 0 0 / 0.18), 0 6px 10px -4px rgb(0 0 0 / 0.12)',
    shadowXl: '0 24px 36px -8px rgb(0 0 0 / 0.2), 0 10px 16px -6px rgb(0 0 0 / 0.14)',
  },
  dark: {
    shadowNone: 'none',
    shadowSm: '0 1px 3px 0 rgb(0 0 0 / 0.45), 0 1px 2px -1px rgb(0 0 0 / 0.4)',
    shadowMd: '0 4px 8px -1px rgb(0 0 0 / 0.55), 0 2px 6px -2px rgb(0 0 0 / 0.5)',
    shadowLg: '0 12px 20px -4px rgb(0 0 0 / 0.6), 0 6px 10px -4px rgb(0 0 0 / 0.5)',
    shadowXl: '0 24px 36px -8px rgb(0 0 0 / 0.65), 0 10px 16px -6px rgb(0 0 0 / 0.55)',
  },
};

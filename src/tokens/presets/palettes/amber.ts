import type { ColorPalette } from '../types.js';

export const amberPalette: ColorPalette = {
  name: 'amber',
  light: {
    bgBase: '#fffefb',
    surface: '#fefcf6',
    borderDefault: '#e8e1d0',
    textPrimary: '#261f0f',
    accentDefault: '#d97706',
    successDefault: '#16a34a',
    warningDefault: '#b45309',
    dangerDefault: '#dc2626',
    infoDefault: '#2563eb',
  },
  dark: {
    bgBase: '#171310',
    surface: '#1e1a15',
    borderDefault: '#3a3329',
    textPrimary: '#f5f0e6',
    accentDefault: '#f59e0b',
    successDefault: '#22c55e',
    warningDefault: '#d97706',
    dangerDefault: '#ef4444',
    infoDefault: '#3b82f6',
  },
};

import type { ColorPalette } from '../types.js';

export const violetPalette: ColorPalette = {
  name: 'violet',
  light: {
    bgBase: '#fdfcfe',
    surface: '#faf8fd',
    borderDefault: '#e2dce9',
    textPrimary: '#1c1726',
    accentDefault: '#8b5cf6',
    successDefault: '#16a34a',
    warningDefault: '#d97706',
    dangerDefault: '#dc2626',
    infoDefault: '#2563eb',
  },
  dark: {
    bgBase: '#13111a',
    surface: '#1a1822',
    borderDefault: '#302d3b',
    textPrimary: '#f0edf7',
    accentDefault: '#a78bfa',
    successDefault: '#22c55e',
    warningDefault: '#f59e0b',
    dangerDefault: '#ef4444',
    infoDefault: '#3b82f6',
  },
};

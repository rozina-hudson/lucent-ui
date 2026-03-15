import type { ColorPalette } from '../types.js';

export const defaultPalette: ColorPalette = {
  name: 'default',
  light: {
    bgBase: '#ffffff',
    surface: '#ffffff',
    borderDefault: '#e5e7eb',
    textPrimary: '#111827',
    accentDefault: '#111827',
    successDefault: '#16a34a',
    warningDefault: '#d97706',
    dangerDefault: '#dc2626',
    infoDefault: '#2563eb',
  },
  dark: {
    bgBase: '#111318',
    surface: '#181a20',
    borderDefault: '#2e3039',
    textPrimary: '#f3f4f6',
    accentDefault: '#f9fafb',
    successDefault: '#22c55e',
    warningDefault: '#f59e0b',
    dangerDefault: '#ef4444',
    infoDefault: '#3b82f6',
  },
};

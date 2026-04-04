import type { LucentTokens } from './types.js';
import {
  typographyTokens,
  spacingTokens,
  radiusTokens,
  motionTokens,
  lightShadowTokens,
} from './base.js';

export const lightTokens: LucentTokens = {
  ...typographyTokens,
  ...spacingTokens,
  ...radiusTokens,
  ...motionTokens,
  ...lightShadowTokens,

  // Navigation — chrome/shell (sidebar, header, footer)
  navigation: '#f4f6f8',
  // Backgrounds — main content area
  bgBase: '#ffffff',
  bgSubtle: '#fafafa',
  bgOverlay: 'rgb(0 0 0 / 0.4)',

  // Surfaces — component elevation layer
  surface: '#ffffff',
  surfaceSecondary: '#f5f5f5',
  surfaceRaised: '#ffffff',
  surfaceOverlay: '#ffffff',
  surfaceTint: '#f5f5f5',

  // Borders
  borderDefault: '#e5e7eb',
  borderSubtle: '#f3f4f6',
  borderStrong: '#979faf',
  controlTrack: '#d1d5db',

  // Text
  textPrimary: '#111827',
  textSecondary: '#6b7280',
  textDisabled: '#d1d5db',
  textInverse: '#ffffff',
  // Accent (monochrome default — near-black for universal, high-contrast out of the box)
  accentDefault: '#111827',
  accentHover: '#192339',
  accentSubtle: '#f1f3f9',
  accentBorder: '#000000',
  accentFg: '#f0f1f5',

  // Status
  successDefault: '#16a34a',
  successSubtle: '#f0fdf4',
  successText: '#15803d',
  warningDefault: '#d97706',
  warningSubtle: '#fffbeb',
  warningText: '#b45309',
  dangerDefault: '#dc2626',
  dangerHover: '#b91c1c',
  dangerSubtle: '#fef2f2',
  dangerText: '#b91c1c',
  infoDefault: '#2563eb',
  infoSubtle: '#eff6ff',
  infoText: '#1d4ed8',

};

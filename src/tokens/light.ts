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

  // Backgrounds
  bgBase: '#ffffff',
  bgSubtle: '#f9fafb',
  bgMuted: '#f3f4f6',
  bgOverlay: 'rgb(0 0 0 / 0.4)',

  // Surfaces
  surfaceDefault: '#ffffff',
  surfaceRaised: '#ffffff',
  surfaceOverlay: '#ffffff',

  // Borders
  borderDefault: '#e5e7eb',
  borderSubtle: '#f3f4f6',
  borderStrong: '#9ca3af',

  // Text
  textPrimary: '#111827',
  textSecondary: '#6b7280',
  textDisabled: '#9ca3af',
  textInverse: '#ffffff',
  textOnAccent: '#ffffff',

  // Accent (gold — matches lucentui.ai brand)
  accentDefault: '#e9c96b',
  accentHover: '#ddb84e',
  accentActive: '#c9a33b',
  accentSubtle: '#fef9ec',

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

  // Focus
  focusRing: '#e9c96b',
};

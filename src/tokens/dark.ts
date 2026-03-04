import type { LucentTokens } from './types.js';
import {
  typographyTokens,
  spacingTokens,
  radiusTokens,
  motionTokens,
  darkShadowTokens,
} from './base.js';

export const darkTokens: LucentTokens = {
  ...typographyTokens,
  ...spacingTokens,
  ...radiusTokens,
  ...motionTokens,
  ...darkShadowTokens,

  // Backgrounds
  bgBase: '#0b0d12',
  bgSubtle: '#111318',
  bgMuted: '#1c1f2a',
  bgOverlay: 'rgb(0 0 0 / 0.6)',

  // Surfaces
  surfaceDefault: '#111318',
  surfaceRaised: '#1c1f2a',
  surfaceOverlay: '#1c1f2a',

  // Borders
  borderDefault: '#1c1f2a',
  borderSubtle: '#16181f',
  borderStrong: '#4a4d57',

  // Text
  textPrimary: '#f0ede6',
  textSecondary: '#9ca3af',
  textDisabled: '#4a4d57',
  textInverse: '#0b0d12',
  textOnAccent: '#111827', // auto-recomputed by LucentProvider via getContrastText

  // Accent (monochrome default — near-white for high contrast on dark surfaces)
  // Use `brandTokens` to opt in to the gold palette.
  accentDefault: '#f9fafb',
  accentHover: '#e5e7eb',
  accentActive: '#d1d5db',
  accentSubtle: 'rgb(249 250 251 / 0.1)',

  // Status
  successDefault: '#22c55e',
  successSubtle: 'rgb(34 197 94 / 0.1)',
  successText: '#4ade80',
  warningDefault: '#f59e0b',
  warningSubtle: 'rgb(245 158 11 / 0.1)',
  warningText: '#fbbf24',
  dangerDefault: '#ef4444',
  dangerHover: '#f87171',
  dangerSubtle: 'rgb(239 68 68 / 0.1)',
  dangerText: '#f87171',
  infoDefault: '#3b82f6',
  infoSubtle: 'rgb(59 130 246 / 0.1)',
  infoText: '#60a5fa',

  // Focus
  focusRing: '#f9fafb',
};

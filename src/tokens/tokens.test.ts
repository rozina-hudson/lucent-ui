import { describe, test, expect } from 'vitest';
import { getContrastText } from './contrast.js';
import { createTheme } from './createTheme.js';
import { lightTokens } from './light.js';
import { darkTokens } from './dark.js';

const anchors = {
  bgBase: '#ffffff',
  surface: '#f9fafb',
  borderDefault: '#e5e7eb',
  textPrimary: '#111827',
  accentDefault: '#6366f1',
  successDefault: '#22c55e',
  warningDefault: '#f59e0b',
  dangerDefault: '#ef4444',
  infoDefault: '#3b82f6',
};

describe('getContrastText', () => {
  test('returns white on dark backgrounds', () => {
    expect(getContrastText('#111827')).toBe('#ffffff');
    expect(getContrastText('#000000')).toBe('#ffffff');
    expect(getContrastText('#1e1e2e')).toBe('#ffffff');
  });

  test('returns black on light backgrounds', () => {
    expect(getContrastText('#ffffff')).toBe('#000000');
    expect(getContrastText('#f9fafb')).toBe('#000000');
    expect(getContrastText('#e5e7eb')).toBe('#000000');
  });
});

describe('createTheme', () => {
  test('returns a tokens object with all required keys', () => {
    const tokens = createTheme(anchors);
    expect(tokens.accentDefault).toBe('#6366f1');
    expect(tokens.bgBase).toBe('#ffffff');
    expect(tokens.textPrimary).toBe('#111827');
  });

  test('derives textOnAccent from accentDefault', () => {
    const lightAccent = createTheme({ ...anchors, accentDefault: '#ffffff' });
    expect(lightAccent.textOnAccent).toBe('#000000');

    const darkAccent = createTheme({ ...anchors, accentDefault: '#000000' });
    expect(darkAccent.textOnAccent).toBe('#ffffff');
  });

  test('light theme has lighter bgBase than dark theme defaults', () => {
    expect(lightTokens.bgBase).toBe('#ffffff');
    expect(darkTokens.bgBase).not.toBe('#ffffff');
  });

  test('dark theme variant produces different derived elevation colors', () => {
    const light = createTheme(anchors, 'light');
    const dark = createTheme(anchors, 'dark');
    // surfaceRaised is derived from the theme base, not passed as an anchor
    expect(light.surfaceRaised).not.toBe(dark.surfaceRaised);
  });
});

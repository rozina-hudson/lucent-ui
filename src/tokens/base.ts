import type { TypographyTokens, SpacingTokens, RadiusTokens, ShadowTokens, MotionTokens } from './types.js';

export const typographyTokens: TypographyTokens = {
  fontFamilyBase:
    '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontFamilyMono: '"DM Mono", "Fira Code", "Cascadia Code", monospace',
  fontFamilyDisplay: '"Georama", "DM Sans", sans-serif',
  fontSizeXs: '0.75rem',
  fontSizeSm: '0.875rem',
  fontSizeMd: '1rem',
  fontSizeLg: '1.125rem',
  fontSizeXl: '1.25rem',
  fontSize2xl: '1.5rem',
  fontSize3xl: '1.875rem',
  fontWeightRegular: '400',
  fontWeightMedium: '500',
  fontWeightSemibold: '600',
  fontWeightBold: '700',
  lineHeightTight: '1.25',
  lineHeightBase: '1.5',
  lineHeightRelaxed: '1.75',
  letterSpacingTight: '-0.02em',
  letterSpacingBase: '0em',
  letterSpacingWide: '0.04em',
};

export const spacingTokens: SpacingTokens = {
  space0: '0px',
  space1: '0.25rem',
  space2: '0.5rem',
  space3: '0.75rem',
  space4: '1rem',
  space5: '1.25rem',
  space6: '1.5rem',
  space8: '2rem',
  space10: '2.5rem',
  space12: '3rem',
  space16: '4rem',
  space20: '5rem',
  space24: '6rem',
};

export const radiusTokens: RadiusTokens = {
  radiusNone: '0px',
  radiusSm: '0.25rem',
  radiusMd: '0.375rem',
  radiusLg: '0.5rem',
  radiusXl: '0.75rem',
  radiusFull: '9999px',
};

export const motionTokens: MotionTokens = {
  durationFast: '100ms',
  durationBase: '200ms',
  durationSlow: '350ms',
  easingDefault: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easingEmphasized: 'cubic-bezier(0.2, 0, 0, 1)',
  easingDecelerate: 'cubic-bezier(0, 0, 0.2, 1)',
};

export const lightShadowTokens: ShadowTokens = {
  shadowNone: 'none',
  shadowSm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  shadowMd: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  shadowLg:
    '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  shadowXl:
    '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
};

/**
 * Dark mode default shadows — "lit edge" approach.
 * Depth is communicated through brightness, not darkness. A subtle
 * white highlight on the top edge simulates overhead light, while
 * a very faint dark layer provides just enough grounding.
 */
export const darkShadowTokens: ShadowTokens = {
  shadowNone: 'none',
  shadowSm:
    'inset 0 1px 0 0 rgba(255, 255, 255, 0.04), ' +
    '0 1px 2px 0 rgba(0, 0, 0, 0.2)',
  shadowMd:
    'inset 0 1px 0 0 rgba(255, 255, 255, 0.06), ' +
    '0 2px 4px -1px rgba(0, 0, 0, 0.25)',
  shadowLg:
    'inset 0 1px 0 0 rgba(255, 255, 255, 0.08), ' +
    '0 4px 8px -2px rgba(0, 0, 0, 0.3)',
  shadowXl:
    'inset 0 1px 0 0 rgba(255, 255, 255, 0.1), ' +
    '0 8px 16px -4px rgba(0, 0, 0, 0.35)',
};

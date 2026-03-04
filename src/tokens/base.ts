import type { TypographyTokens, SpacingTokens, RadiusTokens, ShadowTokens, MotionTokens } from './types.js';

export const typographyTokens: TypographyTokens = {
  fontFamilyBase:
    '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontFamilyMono: '"DM Mono", "Fira Code", "Cascadia Code", monospace',
  fontFamilyDisplay: '"Unbounded", "DM Sans", sans-serif',
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

export const darkShadowTokens: ShadowTokens = {
  shadowNone: 'none',
  shadowSm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
  shadowMd: '0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4)',
  shadowLg:
    '0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.4)',
  shadowXl:
    '0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.5)',
};

export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

export interface TypographyTokens {
  fontFamilyBase: string;
  fontFamilyMono: string;
  fontFamilyDisplay: string;
  fontSizeXs: string;
  fontSizeSm: string;
  fontSizeMd: string;
  fontSizeLg: string;
  fontSizeXl: string;
  fontSize2xl: string;
  fontSize3xl: string;
  fontWeightRegular: string;
  fontWeightMedium: string;
  fontWeightSemibold: string;
  fontWeightBold: string;
  lineHeightTight: string;
  lineHeightBase: string;
  lineHeightRelaxed: string;
  letterSpacingTight: string;
  letterSpacingBase: string;
  letterSpacingWide: string;
}

export interface SpacingTokens {
  space0: string;
  space1: string;
  space2: string;
  space3: string;
  space4: string;
  space5: string;
  space6: string;
  space8: string;
  space10: string;
  space12: string;
  space16: string;
  space20: string;
  space24: string;
}

export interface RadiusTokens {
  radiusNone: string;
  radiusSm: string;
  radiusMd: string;
  radiusLg: string;
  radiusXl: string;
  radiusFull: string;
}

export interface ShadowTokens {
  shadowNone: string;
  shadowSm: string;
  shadowMd: string;
  shadowLg: string;
  shadowXl: string;
}

export interface MotionTokens {
  durationFast: string;
  durationBase: string;
  durationSlow: string;
  easingDefault: string;
  easingEmphasized: string;
  easingDecelerate: string;
}

export interface SemanticColorTokens {
  // Backgrounds
  bgBase: string;
  bgSubtle: string;
  bgMuted: string;
  bgOverlay: string;
  // Surfaces
  surfaceDefault: string;
  surfaceRaised: string;
  surfaceOverlay: string;
  // Borders
  borderDefault: string;
  borderSubtle: string;
  borderStrong: string;
  // Text
  textPrimary: string;
  textSecondary: string;
  textDisabled: string;
  textInverse: string;
  textOnAccent: string;
  // Accent (brand)
  accentDefault: string;
  accentHover: string;
  accentActive: string;
  accentSubtle: string;
  // A slightly adjusted border color that pairs with `accentDefault`.
  // Calculated automatically by `LucentProvider` so that a custom accent
  // colour looks good on either light or dark backgrounds.
  // Consumers may still override if they want precise control.
  accentBorder: string;
  // Status
  successDefault: string;
  successSubtle: string;
  successText: string;
  warningDefault: string;
  warningSubtle: string;
  warningText: string;
  dangerDefault: string;
  dangerHover: string;
  dangerSubtle: string;
  dangerText: string;
  infoDefault: string;
  infoSubtle: string;
  infoText: string;
  // Focus
  focusRing: string;
}

export interface LucentTokens
  extends SemanticColorTokens,
    TypographyTokens,
    SpacingTokens,
    RadiusTokens,
    ShadowTokens,
    MotionTokens {}

export type Theme = 'light' | 'dark';

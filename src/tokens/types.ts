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
  // Navigation — chrome/shell layer (sidebar, header, footer)
  navigation: string;
  // Backgrounds — main content area
  bgBase: string;
  bgSubtle: string;
  bgOverlay: string;
  // Surfaces — component elevation layer
  surface: string;          // flat inline components (cards, list items)
  surfaceSecondary: string; // tinted fill within a surface (striped rows, thead/tfoot, disabled inputs, nested panels)
  surfaceRaised: string;   // dropdowns, popovers
  surfaceOverlay: string;  // modals, dialogs
  surfaceTint: string;     // hue-neutral translucent overlay — darkens in light mode, lightens in dark mode
  // Borders
  borderDefault: string;
  borderSubtle: string;
  borderStrong: string;
  // Controls
  controlTrack: string; // neutral inactive track (toggle off, slider unfilled)
  // Text
  textPrimary: string;
  textSecondary: string;
  textDisabled: string;
  textInverse: string;
  // Accent (brand) — the 5 tokens derived from a single accent color.
  // Everything else (backgrounds, surfaces, borders, text) is neutral and
  // accent-independent.
  accentDefault: string;  // primary button bg, active toggle, checkbox fill, progress bar
  accentHover: string;    // hover state of the above
  accentSubtle: string;   // 8-12% tint for selected row bg, active nav item bg, pill backgrounds
  accentBorder: string;   // focus rings, selected item borders, active tab underline
  accentFg: string;       // text/icon color on top of an accent-colored surface
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
}

export interface LucentTokens
  extends SemanticColorTokens,
    TypographyTokens,
    SpacingTokens,
    RadiusTokens,
    ShadowTokens,
    MotionTokens {}

export type Theme = 'light' | 'dark';

/**
 * The minimal set of color tokens needed to produce a complete theme.
 * Pass these to `createTheme()` or `<LucentProvider anchors={...}>` and
 * all variant tokens (hover, active, subtle, text, etc.) are derived
 * automatically.
 *
 * @example
 * const myTheme = createTheme({
 *   bgBase:          '#f9fafb',
 *   borderDefault:   '#e5e7eb',
 *   accentDefault:   '#6366f1',
 *   successDefault:  '#22c55e',
 *   warningDefault:  '#f59e0b',
 *   dangerDefault:   '#ef4444',
 *   infoDefault:     '#3b82f6',
 *   navigation:      '#ffffff', // optional — chrome background
 * });
 */
export type ThemeAnchors = Pick<
  LucentTokens,
  | 'bgBase'
  | 'borderDefault'
  | 'accentDefault'
  | 'successDefault'
  | 'warningDefault'
  | 'dangerDefault'
  | 'infoDefault'
> &
  Partial<Pick<LucentTokens, 'textPrimary' | 'surface' | 'navigation'>>;

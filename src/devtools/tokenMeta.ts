import type { LucentTokens } from '../tokens/types.js';

export type ControlType = 'color' | 'slider' | 'text';

export interface TokenMeta {
  key: keyof LucentTokens;
  controlType: ControlType;
  sliderConfig?: { min: number; max: number; step: number; unit: string };
}

export interface TokenGroup {
  label: string;
  subgroups?: { label: string; tokens: TokenMeta[] }[];
  tokens?: TokenMeta[];
  defaultExpanded?: boolean;
}

function color(key: keyof LucentTokens): TokenMeta {
  return { key, controlType: 'color' };
}

function slider(
  key: keyof LucentTokens,
  min: number,
  max: number,
  step: number,
  unit: string,
): TokenMeta {
  return { key, controlType: 'slider', sliderConfig: { min, max, step, unit } };
}

function text(key: keyof LucentTokens): TokenMeta {
  return { key, controlType: 'text' };
}

export const TOKEN_GROUPS: TokenGroup[] = [
  {
    label: 'Colors',
    defaultExpanded: true,
    subgroups: [
      {
        label: 'Background',
        tokens: [color('bgBase'), color('bgSubtle'), color('bgOverlay')],
      },
      {
        label: 'Surface',
        tokens: [
          color('surface'), color('surfaceSecondary'), color('surfaceRaised'),
          color('surfaceOverlay'), color('surfaceTint'),
        ],
      },
      {
        label: 'Border',
        tokens: [color('borderDefault'), color('borderSubtle'), color('borderStrong'), color('controlTrack')],
      },
      {
        label: 'Text',
        tokens: [color('textPrimary'), color('textSecondary'), color('textDisabled'), color('textInverse')],
      },
      {
        label: 'Accent',
        tokens: [color('accentDefault'), color('accentHover'), color('accentSubtle'), color('accentBorder'), color('accentFg')],
      },
      {
        label: 'Success',
        tokens: [color('successDefault'), color('successSubtle'), color('successText')],
      },
      {
        label: 'Warning',
        tokens: [color('warningDefault'), color('warningSubtle'), color('warningText')],
      },
      {
        label: 'Danger',
        tokens: [color('dangerDefault'), color('dangerHover'), color('dangerSubtle'), color('dangerText')],
      },
      {
        label: 'Info',
        tokens: [color('infoDefault'), color('infoSubtle'), color('infoText')],
      },
    ],
  },
  {
    label: 'Typography',
    tokens: [
      text('fontFamilyBase'), text('fontFamilyMono'), text('fontFamilyDisplay'),
      slider('fontSizeXs', 0.5, 2, 0.0625, 'rem'),
      slider('fontSizeSm', 0.5, 2, 0.0625, 'rem'),
      slider('fontSizeMd', 0.5, 2, 0.0625, 'rem'),
      slider('fontSizeLg', 0.5, 3, 0.0625, 'rem'),
      slider('fontSizeXl', 0.5, 3, 0.0625, 'rem'),
      slider('fontSize2xl', 0.5, 4, 0.0625, 'rem'),
      slider('fontSize3xl', 0.5, 4, 0.0625, 'rem'),
      text('fontWeightRegular'), text('fontWeightMedium'), text('fontWeightSemibold'), text('fontWeightBold'),
      text('lineHeightTight'), text('lineHeightBase'), text('lineHeightRelaxed'),
      text('letterSpacingTight'), text('letterSpacingBase'), text('letterSpacingWide'),
    ],
  },
  {
    label: 'Spacing',
    tokens: [
      slider('space0', 0, 6, 0.125, 'rem'),
      slider('space1', 0, 6, 0.125, 'rem'),
      slider('space2', 0, 6, 0.125, 'rem'),
      slider('space3', 0, 6, 0.125, 'rem'),
      slider('space4', 0, 6, 0.125, 'rem'),
      slider('space5', 0, 6, 0.125, 'rem'),
      slider('space6', 0, 6, 0.125, 'rem'),
      slider('space8', 0, 6, 0.125, 'rem'),
      slider('space10', 0, 6, 0.125, 'rem'),
      slider('space12', 0, 8, 0.125, 'rem'),
      slider('space16', 0, 10, 0.125, 'rem'),
      slider('space20', 0, 12, 0.125, 'rem'),
      slider('space24', 0, 12, 0.125, 'rem'),
    ],
  },
  {
    label: 'Radius',
    tokens: [
      text('radiusNone'),
      slider('radiusSm', 0, 2, 0.0625, 'rem'),
      slider('radiusMd', 0, 2, 0.0625, 'rem'),
      slider('radiusLg', 0, 2, 0.0625, 'rem'),
      slider('radiusXl', 0, 3, 0.0625, 'rem'),
      text('radiusFull'),
    ],
  },
  {
    label: 'Shadows',
    tokens: [
      text('shadowNone'), text('shadowSm'), text('shadowMd'), text('shadowLg'), text('shadowXl'),
    ],
  },
  {
    label: 'Motion',
    tokens: [
      text('durationFast'), text('durationBase'), text('durationSlow'),
      text('easingDefault'), text('easingEmphasized'), text('easingDecelerate'),
    ],
  },
];

import type { DesignPreset } from '../types.js';
import { coralPalette } from '../palettes/coral.js';
import { sharpShape } from '../shapes/sharp.js';
import { compactDensity } from '../densities/compact.js';
import { brutalistShadow } from '../shadows/brutalist.js';

/**
 * Neo-Brutalist — the rebel.
 * Hard offset shadows, sharp corners, tight spacing.
 * Best for marketing sites, bold product launches, editorial.
 */
export const brutalistPreset: DesignPreset = {
  name: 'brutalist',
  palette: coralPalette,
  shape: sharpShape,
  density: compactDensity,
  shadow: brutalistShadow,
};

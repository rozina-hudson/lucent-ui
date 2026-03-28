import type { DesignPreset } from '../types.js';
import { slatePalette } from '../palettes/slate.js';
import { roundedShape } from '../shapes/rounded.js';
import { defaultDensity } from '../densities/default.js';
import { flatShadow } from '../shadows/flat.js';

/**
 * Utilitarian Minimal — print-inspired, content-first.
 * No shadows at all — depth through borders and typography hierarchy.
 * Best for editorial, documentation, reading-heavy products.
 */
export const minimalPreset: DesignPreset = {
  name: 'minimal',
  palette: slatePalette,
  shape: roundedShape,
  density: defaultDensity,
  shadow: flatShadow,
};

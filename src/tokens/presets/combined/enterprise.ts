import type { DesignPreset } from '../types.js';
import { defaultPalette } from '../palettes/default.js';
import { sharpShape } from '../shapes/sharp.js';
import { compactDensity } from '../densities/compact.js';
import { flatShadow } from '../shadows/flat.js';

export const enterprisePreset: DesignPreset = {
  name: 'enterprise',
  palette: defaultPalette,
  shape: sharpShape,
  density: compactDensity,
  shadow: flatShadow,
};

import type { DesignPreset } from '../types.js';
import { indigoPalette } from '../palettes/indigo.js';
import { roundedShape } from '../shapes/rounded.js';
import { defaultDensity } from '../densities/default.js';
import { subtleShadow } from '../shadows/subtle.js';

export const modernPreset: DesignPreset = {
  name: 'modern',
  palette: indigoPalette,
  shape: roundedShape,
  density: defaultDensity,
  shadow: subtleShadow,
};

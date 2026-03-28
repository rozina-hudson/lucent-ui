import type { DesignPreset } from '../types.js';
import { indigoPalette } from '../palettes/indigo.js';
import { roundedShape } from '../shapes/rounded.js';
import { defaultDensity } from '../densities/default.js';
import { naturalShadow } from '../shadows/natural.js';

/**
 * Modern Bento — the product grid standard.
 * Layered natural shadows, balanced roundness, consistent spacing.
 * Best for feature showcases, data dashboards, SaaS products.
 */
export const bentoPreset: DesignPreset = {
  name: 'bento',
  palette: indigoPalette,
  shape: roundedShape,
  density: defaultDensity,
  shadow: naturalShadow,
};

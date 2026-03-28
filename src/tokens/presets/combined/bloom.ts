import type { DesignPreset } from '../types.js';
import { indigoPalette } from '../palettes/indigo.js';
import { roundedShape } from '../shapes/rounded.js';
import { spaciousDensity } from '../densities/spacious.js';
import { glowShadow } from '../shadows/glow.js';

/**
 * Bloom — dark-mode-native glow aesthetic.
 * Accent-colored ambient glow, generous negative space, large radii.
 * Best for AI interfaces, creative tools, dark-first products (Vercel/Linear style).
 */
export const bloomPreset: DesignPreset = {
  name: 'bloom',
  palette: indigoPalette,
  shape: roundedShape,
  density: spaciousDensity,
  shadow: glowShadow,
};

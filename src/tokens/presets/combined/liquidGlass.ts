import type { DesignPreset } from '../types.js';
import { oceanPalette } from '../palettes/ocean.js';
import { pillShape } from '../shapes/pill.js';
import { spaciousDensity } from '../densities/spacious.js';
import { liquidGlassShadow } from '../shadows/liquidGlass.js';

/**
 * Liquid Glass — Apple-inspired premium aesthetic.
 * Extreme blur shadows, generous spacing, pill radii.
 * Best for high-end SaaS, floating modals, mobile-first web apps.
 */
export const liquidGlassPreset: DesignPreset = {
  name: 'liquidGlass',
  palette: oceanPalette,
  shape: pillShape,
  density: spaciousDensity,
  shadow: liquidGlassShadow,
};

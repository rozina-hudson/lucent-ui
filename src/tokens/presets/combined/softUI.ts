import type { DesignPreset } from '../types.js';
import { violetPalette } from '../palettes/violet.js';
import { pillShape } from '../shapes/pill.js';
import { defaultDensity } from '../densities/default.js';
import { neumorphicShadow } from '../shadows/neumorphic.js';

/**
 * Soft UI — tactile and organic neumorphism.
 * Dual-direction shadows, large radii, balanced spacing.
 * Best for physical product controllers, IoT dashboards, niche apps.
 */
export const softUIPreset: DesignPreset = {
  name: 'softUI',
  palette: violetPalette,
  shape: pillShape,
  density: defaultDensity,
  shadow: neumorphicShadow,
};

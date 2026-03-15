import type { DesignPreset } from '../types.js';
import { rosePalette } from '../palettes/rose.js';
import { pillShape } from '../shapes/pill.js';
import { spaciousDensity } from '../densities/spacious.js';
import { elevatedShadow } from '../shadows/elevated.js';

export const playfulPreset: DesignPreset = {
  name: 'playful',
  palette: rosePalette,
  shape: pillShape,
  density: spaciousDensity,
  shadow: elevatedShadow,
};

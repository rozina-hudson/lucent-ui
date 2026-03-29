import type { DesignPreset } from '../types.js';
import { emeraldPalette } from '../palettes/emerald.js';
import { sharpShape } from '../shapes/sharp.js';
import { compactDensity } from '../densities/compact.js';
import { glowShadow } from '../shadows/glow.js';

/**
 * Technical Mono — the dev-tool aesthetic.
 * Glow shadows, perfectly square corners, mathematical grid spacing.
 * Best for documentation, CLI tools, cybersecurity, developer products.
 */
export const terminalPreset: DesignPreset = {
  name: 'terminal',
  palette: emeraldPalette,
  shape: sharpShape,
  density: compactDensity,
  shadow: glowShadow,
};

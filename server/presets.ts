/**
 * Static preset metadata for MCP tools. These are descriptions only —
 * no runtime token resolution happens in the server.
 */

export interface PresetInfo {
  name: string;
  description: string;
}

export interface PaletteInfo extends PresetInfo {
  accent: string;
}

export interface CombinedInfo extends PresetInfo {
  palette: string;
  shape: string;
  density: string;
  shadow: string;
}

export const PALETTES: PaletteInfo[] = [
  { name: 'default', description: 'Monochrome — neutral grays, near-black accent', accent: '#111827' },
  { name: 'brand', description: 'Gold accent with warm cream-tinted grays', accent: '#e9c96b' },
  { name: 'indigo', description: 'Violet-indigo accent with cool-tinted grays', accent: '#6366f1' },
  { name: 'emerald', description: 'Green accent with cool green-tinted grays', accent: '#10b981' },
  { name: 'rose', description: 'Pink-rose accent with warm-tinted grays', accent: '#f43f5e' },
  { name: 'ocean', description: 'Sky-blue accent with cool blue-tinted grays', accent: '#0ea5e9' },
];

export const SHAPES: PresetInfo[] = [
  { name: 'sharp', description: 'Minimal border radius — enterprise / professional' },
  { name: 'rounded', description: 'Balanced border radius (default)' },
  { name: 'pill', description: 'Large border radius — playful / modern' },
];

export const DENSITIES: PresetInfo[] = [
  { name: 'compact', description: 'Tighter spacing — data-dense UIs' },
  { name: 'default', description: 'Balanced spacing' },
  { name: 'spacious', description: 'More breathing room — marketing / consumer' },
];

export const SHADOWS: PresetInfo[] = [
  { name: 'flat', description: 'No shadows — minimalist, flat design' },
  { name: 'subtle', description: 'Light shadows (default)' },
  { name: 'elevated', description: 'Pronounced shadows — material / depth' },
];

export const COMBINED: CombinedInfo[] = [
  { name: 'modern', description: 'Indigo accent with rounded corners and balanced spacing', palette: 'indigo', shape: 'rounded', density: 'default', shadow: 'subtle' },
  { name: 'enterprise', description: 'Monochrome with sharp corners and compact spacing', palette: 'default', shape: 'sharp', density: 'compact', shadow: 'flat' },
  { name: 'playful', description: 'Rose accent with pill corners and spacious layout', palette: 'rose', shape: 'pill', density: 'spacious', shadow: 'elevated' },
];

const VALID_PALETTES = new Set(PALETTES.map((p) => p.name));
const VALID_SHAPES = new Set(SHAPES.map((s) => s.name));
const VALID_DENSITIES = new Set(DENSITIES.map((d) => d.name));
const VALID_SHADOWS = new Set(SHADOWS.map((s) => s.name));
const VALID_COMBINED = new Set(COMBINED.map((c) => c.name));

export interface PresetSelection {
  preset?: string | undefined;
  palette?: string | undefined;
  shape?: string | undefined;
  density?: string | undefined;
  shadow?: string | undefined;
}

export function generatePresetConfig(selection: PresetSelection): { configFile: string; providerSnippet: string } | { error: string } {
  // Combined preset
  if (selection.preset) {
    if (!VALID_COMBINED.has(selection.preset)) {
      return { error: `Unknown combined preset "${selection.preset}". Available: ${[...VALID_COMBINED].join(', ')}` };
    }
    const configFile = [
      `import type { PresetProp } from 'lucent-ui';`,
      ``,
      `export const preset: PresetProp = '${selection.preset}';`,
    ].join('\n');

    const providerSnippet = [
      `import { LucentProvider } from 'lucent-ui';`,
      `import { preset } from './lucent.config';`,
      ``,
      `function App() {`,
      `  return (`,
      `    <LucentProvider preset={preset}>`,
      `      {/* your app */}`,
      `    </LucentProvider>`,
      `  );`,
      `}`,
    ].join('\n');

    return { configFile, providerSnippet };
  }

  // Mix-and-match
  const errors: string[] = [];
  if (selection.palette && !VALID_PALETTES.has(selection.palette)) errors.push(`palette "${selection.palette}"`);
  if (selection.shape && !VALID_SHAPES.has(selection.shape)) errors.push(`shape "${selection.shape}"`);
  if (selection.density && !VALID_DENSITIES.has(selection.density)) errors.push(`density "${selection.density}"`);
  if (selection.shadow && !VALID_SHADOWS.has(selection.shadow)) errors.push(`shadow "${selection.shadow}"`);
  if (errors.length > 0) {
    return { error: `Unknown values: ${errors.join(', ')}` };
  }

  const parts: string[] = [];
  if (selection.palette) parts.push(`  palette: '${selection.palette}',`);
  if (selection.shape) parts.push(`  shape: '${selection.shape}',`);
  if (selection.density) parts.push(`  density: '${selection.density}',`);
  if (selection.shadow) parts.push(`  shadow: '${selection.shadow}',`);

  const configFile = [
    `import type { PresetProp } from 'lucent-ui';`,
    ``,
    `export const preset: PresetProp = {`,
    ...parts,
    `};`,
  ].join('\n');

  const providerSnippet = [
    `import { LucentProvider } from 'lucent-ui';`,
    `import { preset } from './lucent.config';`,
    ``,
    `function App() {`,
    `  return (`,
    `    <LucentProvider preset={preset}>`,
    `      {/* your app */}`,
    `    </LucentProvider>`,
    `  );`,
    `}`,
  ].join('\n');

  return { configFile, providerSnippet };
}

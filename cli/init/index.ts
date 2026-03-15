import fs from 'node:fs';
import path from 'node:path';
import { choose, close } from './prompts.js';

const PALETTES = [
  { label: 'Default',  value: 'default', description: 'Monochrome — neutral grays, near-black accent' },
  { label: 'Brand',    value: 'brand',   description: 'Gold accent with warm cream-tinted grays' },
  { label: 'Indigo',   value: 'indigo',  description: 'Violet-indigo accent (#6366f1) with cool-tinted grays' },
  { label: 'Emerald',  value: 'emerald', description: 'Green accent (#10b981) with cool green-tinted grays' },
  { label: 'Rose',     value: 'rose',    description: 'Pink-rose accent (#f43f5e) with warm-tinted grays' },
  { label: 'Ocean',    value: 'ocean',   description: 'Sky-blue accent (#0ea5e9) with cool blue-tinted grays' },
];

const SHAPES = [
  { label: 'Sharp',   value: 'sharp',   description: 'Minimal border radius — enterprise / professional' },
  { label: 'Rounded', value: 'rounded', description: 'Balanced border radius (default)' },
  { label: 'Pill',    value: 'pill',    description: 'Large border radius — playful / modern' },
];

const DENSITIES = [
  { label: 'Compact',  value: 'compact',  description: 'Tighter spacing — data-dense UIs' },
  { label: 'Default',  value: 'default',  description: 'Balanced spacing' },
  { label: 'Spacious', value: 'spacious', description: 'More breathing room — marketing / consumer' },
];

const SHADOWS = [
  { label: 'Flat',     value: 'flat',     description: 'No shadows — minimalist, flat design' },
  { label: 'Subtle',   value: 'subtle',   description: 'Light shadows (default)' },
  { label: 'Elevated', value: 'elevated', description: 'Pronounced shadows — material / depth' },
];

const COMBINED = [
  { label: 'Modern',     value: 'modern',     description: 'Indigo + rounded + default spacing + subtle shadows' },
  { label: 'Enterprise', value: 'enterprise', description: 'Monochrome + sharp + compact + flat shadows' },
  { label: 'Playful',    value: 'playful',    description: 'Rose + pill + spacious + elevated shadows' },
  { label: 'Custom',     value: 'custom',     description: 'Mix and match each dimension yourself' },
];

interface PresetConfig {
  palette: string;
  shape: string;
  density: string;
  shadow: string;
}

function isDefaultConfig(config: PresetConfig): boolean {
  return config.palette === 'default' && config.shape === 'rounded' &&
    config.density === 'default' && config.shadow === 'subtle';
}

function generateConfigFile(config: PresetConfig): string {
  const lines = [
    `import type { PresetProp } from 'lucent-ui';`,
    '',
    `export const preset: PresetProp = {`,
    `  palette: '${config.palette}',`,
    `  shape: '${config.shape}',`,
    `  density: '${config.density}',`,
    `  shadow: '${config.shadow}',`,
    `};`,
    '',
  ];
  return lines.join('\n');
}

function generateCombinedConfigFile(presetName: string): string {
  const lines = [
    `import type { PresetProp } from 'lucent-ui';`,
    '',
    `export const preset: PresetProp = '${presetName}';`,
    '',
  ];
  return lines.join('\n');
}

function printSnippet(): void {
  console.log(`
Add this to your app entry point:

  import { LucentProvider } from 'lucent-ui';
  import { preset } from './lucent.config';

  function App() {
    return (
      <LucentProvider preset={preset}>
        {/* your app */}
      </LucentProvider>
    );
  }
`);
}

const COMBINED_PRESETS: Record<string, PresetConfig> = {
  modern: { palette: 'indigo', shape: 'rounded', density: 'default', shadow: 'subtle' },
  enterprise: { palette: 'default', shape: 'sharp', density: 'compact', shadow: 'flat' },
  playful: { palette: 'rose', shape: 'pill', density: 'spacious', shadow: 'elevated' },
};

export async function runInit(): Promise<void> {
  console.log('\n  Lucent UI — Design Preset Setup\n');

  const mode = await choose('How would you like to configure your design?', COMBINED);

  let configContent: string;

  if (mode !== 'custom') {
    configContent = generateCombinedConfigFile(mode);
    const details = COMBINED_PRESETS[mode];
    if (details) {
      console.log(`\n  Preset "${mode}":`);
      console.log(`    Palette:  ${details.palette}`);
      console.log(`    Shape:    ${details.shape}`);
      console.log(`    Density:  ${details.density}`);
      console.log(`    Shadow:   ${details.shadow}`);
    }
  } else {
    const palette = await choose('Choose a color palette:', PALETTES);
    const shape = await choose('Choose a shape style:', SHAPES);
    const density = await choose('Choose a density:', DENSITIES);
    const shadow = await choose('Choose a shadow style:', SHADOWS);

    const config: PresetConfig = { palette, shape, density, shadow };

    if (isDefaultConfig(config)) {
      console.log('\n  Your selections match the built-in defaults — no config file needed!');
      console.log('  Just use <LucentProvider> without any preset prop.\n');
      close();
      return;
    }

    configContent = generateConfigFile(config);
  }

  const outPath = path.resolve('lucent.config.ts');
  fs.writeFileSync(outPath, configContent, 'utf8');
  console.log(`\n  Config written to ${outPath}`);

  printSnippet();
  close();
}

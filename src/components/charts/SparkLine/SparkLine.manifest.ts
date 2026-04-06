import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'sparkline',
  name: 'SparkLine',
  tier: 'atom',
  domain: 'neutral',
  specVersion: '0.1',
  description: 'A compact, inline trend line for displaying data direction at a glance.',
  designIntent:
    'Use SparkLine inside KPI cards, table cells, or compact dashboard tiles to show a trend ' +
    'without axes or labels — surrounding context provides meaning. Defaults to smooth curves ' +
    'for a polished look; set smooth=false for raw data fidelity.',
  props: [
    { name: 'data', type: 'custom', required: true, description: 'Array of numeric values.' },
    { name: 'width', type: 'union', required: false, default: "'100%'", description: 'Pixel width or CSS string.' },
    { name: 'height', type: 'number', required: false, default: '32', description: 'Pixel height.' },
    { name: 'color', type: 'string', required: false, default: 'accent', description: 'Color variant name or CSS color.' },
    { name: 'filled', type: 'boolean', required: false, default: 'false', description: 'Show translucent area fill below the line.' },
    { name: 'strokeWidth', type: 'number', required: false, default: '1.5', description: 'Line stroke width.' },
    { name: 'smooth', type: 'boolean', required: false, default: 'true', description: 'Use smooth monotone-x curves.' },
  ],
  usageExamples: [
    { title: 'Basic', code: '<SparkLine data={[4, 7, 3, 8, 5, 9, 6]} />' },
    { title: 'Filled', code: '<SparkLine data={[4, 7, 3, 8, 5, 9, 6]} filled color="success" />' },
  ],
  compositionGraph: [],
  accessibility: {
    role: 'img',
    ariaAttributes: ['aria-label'],
    notes: 'Purely decorative — ensure surrounding text provides data context.',
  },
};

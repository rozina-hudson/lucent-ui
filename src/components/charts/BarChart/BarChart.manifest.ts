import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'bar-chart',
  name: 'BarChart',
  tier: 'atom',
  domain: 'neutral',
  specVersion: '0.1',
  description: 'A vertical bar chart with automatic axis labels and optional grid lines.',
  designIntent:
    'Use BarChart for categorical comparisons — revenue by month, counts by category, etc. ' +
    'Bars auto-scale to fit the data. Set showValues to display exact numbers above each bar. ' +
    'Per-point color overrides are available for highlighting specific bars.',
  props: [
    { name: 'data', type: 'custom', required: true, description: 'Array of { label, value, color? } objects.' },
    { name: 'width', type: 'union', required: false, default: "'100%'", description: 'Pixel width or CSS string.' },
    { name: 'height', type: 'number', required: false, default: '200', description: 'Pixel height.' },
    { name: 'color', type: 'string', required: false, default: 'accent', description: 'Bar color variant or CSS color.' },
    { name: 'gridLines', type: 'boolean', required: false, default: 'true', description: 'Show horizontal grid lines.' },
    { name: 'showValues', type: 'boolean', required: false, default: 'false', description: 'Show value labels above bars.' },
    { name: 'formatValue', type: 'custom', required: false, description: 'Custom value formatter function.' },
    { name: 'barGap', type: 'number', required: false, default: '0.3', description: 'Gap between bars (0–1 fraction of slot width).' },
    { name: 'barRadius', type: 'number', required: false, default: '2', description: 'Corner radius on bar tops.' },
  ],
  usageExamples: [
    { title: 'Basic', code: `<BarChart data={[{ label: 'Jan', value: 40 }, { label: 'Feb', value: 65 }, { label: 'Mar', value: 50 }]} />` },
    { title: 'With values', code: `<BarChart data={[{ label: 'A', value: 120 }, { label: 'B', value: 80 }]} showValues color="success" />` },
  ],
  compositionGraph: [],
  accessibility: {
    role: 'img',
    ariaAttributes: ['aria-label'],
    notes: 'Provide a descriptive ariaLabel summarising the data for screen readers.',
  },
};

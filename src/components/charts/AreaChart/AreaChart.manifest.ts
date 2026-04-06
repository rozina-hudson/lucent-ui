import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'area-chart',
  name: 'AreaChart',
  tier: 'atom',
  domain: 'neutral',
  specVersion: '0.1',
  description: 'A filled line chart for time-series data with optional multi-series support.',
  designIntent:
    'Use AreaChart for continuous data over time — revenue trends, user growth, etc. ' +
    'The translucent fill emphasises volume while the line shows direction. ' +
    'Multi-series mode auto-assigns colors from the lucent palette. ' +
    'Pass formatValue to customise y-axis labels (currency, percentages, etc.).',
  props: [
    { name: 'data', type: 'custom', required: false, description: 'Single-series data: { label, value }[].' },
    { name: 'series', type: 'custom', required: false, description: 'Multi-series data: { id, name, data, color? }[].' },
    { name: 'width', type: 'union', required: false, default: "'100%'", description: 'Pixel width or CSS string.' },
    { name: 'height', type: 'number', required: false, default: '200', description: 'Pixel height.' },
    { name: 'color', type: 'string', required: false, default: 'accent', description: 'Line/fill color for single-series.' },
    { name: 'gridLines', type: 'boolean', required: false, default: 'true', description: 'Show horizontal grid lines.' },
    { name: 'showDots', type: 'boolean', required: false, default: 'false', description: 'Show dots at data points.' },
    { name: 'smooth', type: 'boolean', required: false, default: 'true', description: 'Use smooth monotone-x curves.' },
    { name: 'fillOpacity', type: 'number', required: false, default: '0.15', description: 'Area fill opacity (0–1).' },
    { name: 'formatValue', type: 'custom', required: false, description: 'Custom value formatter for y-axis.' },
    { name: 'xLabelCount', type: 'number', required: false, description: 'Max x-axis labels to display.' },
  ],
  usageExamples: [
    { title: 'Basic', code: `<AreaChart data={[{ label: 'Jan', value: 40 }, { label: 'Feb', value: 65 }, { label: 'Mar', value: 50 }]} />` },
    { title: 'Multi-series', code: `<AreaChart series={[{ id: 'a', name: 'Revenue', data: [...] }, { id: 'b', name: 'Costs', data: [...] }]} />` },
  ],
  compositionGraph: [],
  accessibility: {
    role: 'img',
    ariaAttributes: ['aria-label'],
    notes: 'Provide ariaLabel summarising the data trend.',
  },
};

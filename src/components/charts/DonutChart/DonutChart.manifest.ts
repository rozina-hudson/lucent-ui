import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'donut-chart',
  name: 'DonutChart',
  tier: 'atom',
  domain: 'neutral',
  specVersion: '0.1',
  description: 'A ring chart for displaying proportions with an optional center label.',
  designIntent:
    'Use DonutChart for part-to-whole comparisons — category breakdown, budget allocation, etc. ' +
    'The center label slot is ideal for a total value or summary text. ' +
    'Segment colors auto-cycle through the lucent palette; override per-segment for semantic meaning.',
  props: [
    { name: 'data', type: 'custom', required: true, description: 'Array of { label, value, color? } segments.' },
    { name: 'size', type: 'number', required: false, default: '160', description: 'Overall pixel size (square).' },
    { name: 'thickness', type: 'number', required: false, default: '0.35', description: 'Ring thickness (0–1 fraction of radius).' },
    { name: 'segmentGap', type: 'number', required: false, default: '2', description: 'Gap between segments in degrees.' },
    { name: 'centerLabel', type: 'custom', required: false, description: 'ReactNode displayed in the center of the ring.' },
    { name: 'startAngle', type: 'number', required: false, default: '0', description: 'Starting angle in degrees (0 = 12 o\'clock).' },
  ],
  usageExamples: [
    { title: 'Basic', code: `<DonutChart data={[{ label: 'A', value: 60 }, { label: 'B', value: 40 }]} />` },
    { title: 'With center label', code: `<DonutChart data={[{ label: 'Used', value: 75 }, { label: 'Free', value: 25 }]} centerLabel={<Text size="lg" weight="bold">75%</Text>} />` },
  ],
  compositionGraph: [],
  accessibility: {
    role: 'img',
    ariaAttributes: ['aria-label'],
    notes: 'Provide ariaLabel describing the proportions for screen readers.',
  },
};

import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'spinner',
  name: 'Spinner',
  tier: 'atom',
  domain: 'neutral',
  specVersion: '0.1',
  description: 'An animated loading indicator for async operations.',
  designIntent:
    'Use Spinner for indeterminate loading states of short duration (< 3s). ' +
    'For full-page or skeleton-level loading, prefer Skeleton instead. ' +
    'The label prop is visually hidden but read by screen readers — always set it to a meaningful description of what is loading.',
  props: [
    { name: 'size', type: 'enum', required: false, default: 'md', description: 'Spinner diameter.', enumValues: ['xs', 'sm', 'md', 'lg'] },
    { name: 'label', type: 'string', required: false, default: 'Loading…', description: 'Visually hidden accessible label.' },
    { name: 'color', type: 'string', required: false, description: 'Override colour (CSS value). Defaults to currentColor.' },
  ],
  usageExamples: [
    { title: 'Default', code: `<Spinner />` },
    { title: 'Inside button', code: `<Button loading><Spinner size="sm" label="Saving…" /></Button>` },
    { title: 'Full-page overlay', code: `<div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}><Spinner size="lg" label="Loading dashboard…" /></div>` },
  ],
  compositionGraph: [],
  accessibility: {
    role: 'status',
    ariaAttributes: ['aria-label'],
    notes: 'The visible SVG is aria-hidden. The label is conveyed via a visually-hidden span inside role="status".',
  },
};

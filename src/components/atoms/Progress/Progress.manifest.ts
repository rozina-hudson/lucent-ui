import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'progress',
  name: 'Progress',
  tier: 'atom',
  domain: 'neutral',
  specVersion: '0.1',
  description: 'A horizontal bar indicating completion, progress, or resource usage.',
  designIntent:
    'Use Progress to visualise a bounded numeric value — task completion, disk usage, health bars, etc. ' +
    'Set warnAt/dangerAt thresholds for automatic colour shifts instead of hardcoding variants. ' +
    'Ascending thresholds (warnAt < dangerAt) suit "high is bad" metrics like CPU; ' +
    'descending thresholds (warnAt > dangerAt) suit "low is bad" metrics like battery.',
  props: [
    { name: 'value', type: 'number', required: true, description: 'Current progress value.' },
    { name: 'max', type: 'number', required: false, default: '100', description: 'Maximum value.' },
    { name: 'variant', type: 'enum', required: false, default: 'accent', description: 'Colour variant. Overridden when thresholds are set.', enumValues: ['accent', 'success', 'warning', 'danger'] },
    { name: 'size', type: 'enum', required: false, default: 'md', description: 'Bar height.', enumValues: ['sm', 'md', 'lg'] },
    { name: 'warnAt', type: 'number', required: false, description: 'Value at which variant auto-switches to warning.' },
    { name: 'dangerAt', type: 'number', required: false, description: 'Value at which variant auto-switches to danger.' },
    { name: 'label', type: 'union', required: false, description: 'true shows percentage; ReactNode shows custom label.' },
  ],
  usageExamples: [
    { title: 'Basic', code: `<Progress value={60} />` },
    { title: 'With label', code: `<Progress value={42} label />` },
    { title: 'Thresholds', code: `<Progress value={85} warnAt={70} dangerAt={90} label />` },
    { title: 'Danger variant', code: `<Progress value={95} variant="danger" size="lg" label />` },
  ],
  compositionGraph: [],
  accessibility: {
    role: 'progressbar',
    ariaAttributes: ['aria-valuenow', 'aria-valuemin', 'aria-valuemax'],
    notes: 'Uses native progressbar role. Add aria-label on the wrapping element for screen-reader context.',
  },
};

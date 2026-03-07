import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'slider',
  name: 'Slider',
  tier: 'atom',
  domain: 'neutral',
  specVersion: '0.1',

  description: 'A range input styled with Lucent tokens for selecting a numeric value within a bounded range.',

  designIntent:
    'Use Slider for continuous or stepped numeric inputs where the relative position matters — ' +
    'volume, brightness, border radius, spacing scale. Pair with showValue when the exact ' +
    'number is meaningful to the user. For precise numeric entry, use Input with type="number" ' +
    'instead. Disabled state uses muted colours without opacity hacks.',

  props: [
    {
      name: 'min',
      type: 'number',
      required: false,
      default: '0',
      description: 'Minimum value.',
    },
    {
      name: 'max',
      type: 'number',
      required: false,
      default: '100',
      description: 'Maximum value.',
    },
    {
      name: 'step',
      type: 'number',
      required: false,
      default: '1',
      description: 'Increment step between values.',
    },
    {
      name: 'value',
      type: 'number',
      required: false,
      description: 'Controlled current value. Pair with onChange.',
    },
    {
      name: 'defaultValue',
      type: 'number',
      required: false,
      description: 'Initial value for uncontrolled usage. Defaults to the midpoint of min/max.',
    },
    {
      name: 'onChange',
      type: 'function',
      required: false,
      description: 'Called on every value change.',
    },
    {
      name: 'label',
      type: 'string',
      required: false,
      description: 'Visible label rendered above the track.',
    },
    {
      name: 'showValue',
      type: 'boolean',
      required: false,
      default: 'false',
      description: 'Displays the current numeric value to the right of the label.',
    },
    {
      name: 'size',
      type: 'enum',
      required: false,
      default: 'md',
      description: 'Controls track thickness and thumb diameter.',
      enumValues: ['sm', 'md', 'lg'],
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      default: 'false',
      description: 'Prevents interaction and dims the control.',
    },
  ],

  usageExamples: [
    { title: 'Basic', code: `<Slider label="Volume" showValue />` },
    { title: 'Controlled', code: `<Slider label="Opacity" min={0} max={1} step={0.01} value={opacity} onChange={e => setOpacity(Number(e.target.value))} showValue />` },
    { title: 'Sizes', code: `<Slider size="sm" label="Small" />\n<Slider size="md" label="Medium" />\n<Slider size="lg" label="Large" />` },
    { title: 'Disabled', code: `<Slider label="Locked" disabled defaultValue={40} />` },
  ],

  compositionGraph: [],

  accessibility: {
    role: 'slider',
    ariaAttributes: ['aria-valuemin', 'aria-valuemax', 'aria-valuenow', 'aria-disabled'],
    keyboardInteractions: [
      'ArrowRight / ArrowUp — increase value by step',
      'ArrowLeft / ArrowDown — decrease value by step',
      'Home — jump to min',
      'End — jump to max',
    ],
  },
};

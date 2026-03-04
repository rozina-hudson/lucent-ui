import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'radio',
  name: 'Radio',
  tier: 'atom',
  domain: 'neutral',
  specVersion: '0.1',

  description: 'A mutually exclusive selection control. Use RadioGroup to manage a set of options.',

  designIntent:
    'Radio buttons enforce a single selection from a small set of options (typically 2–6). ' +
    'Always wrap Radio in a RadioGroup so name and selection state are shared automatically. ' +
    'For larger option sets (7+) prefer a Select. For independent true/false choices, use a ' +
    'Checkbox. RadioGroup orientation should match how the options relate — vertical for ' +
    'distinct choices, horizontal for brief inline options (e.g. Yes / No).',

  props: [
    {
      name: 'value',
      type: 'string',
      required: true,
      description: 'The value submitted when this radio is selected.',
    },
    {
      name: 'label',
      type: 'string',
      required: false,
      description: 'Visible label rendered beside the radio button.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      default: 'false',
      description: 'Prevents interaction. Inherits group-level disabled when inside RadioGroup.',
    },
    {
      name: 'size',
      type: 'enum',
      required: false,
      default: 'md',
      description: 'Size of the radio button circle.',
      enumValues: ['sm', 'md'],
    },
  ],

  usageExamples: [
    {
      title: 'Controlled RadioGroup',
      code: `
<RadioGroup name="plan" value={plan} onChange={setPlan}>
  <Radio value="free" label="Free" />
  <Radio value="pro" label="Pro" />
  <Radio value="enterprise" label="Enterprise" />
</RadioGroup>`.trim(),
    },
    {
      title: 'Horizontal orientation',
      code: `
<RadioGroup name="size" value={size} onChange={setSize} orientation="horizontal">
  <Radio value="s" label="S" />
  <Radio value="m" label="M" />
  <Radio value="l" label="L" />
</RadioGroup>`.trim(),
    },
    {
      title: 'Group-level disabled',
      code: `
<RadioGroup name="tier" value="basic" onChange={() => {}} disabled>
  <Radio value="basic" label="Basic" />
  <Radio value="advanced" label="Advanced" />
</RadioGroup>`.trim(),
    },
  ],

  compositionGraph: [
    { componentId: 'radio-group', componentName: 'RadioGroup', role: 'container', required: true },
    { componentId: 'radio', componentName: 'Radio', role: 'item', required: true },
  ],

  accessibility: {
    role: 'radio',
    ariaAttributes: ['aria-checked', 'aria-disabled'],
    keyboardInteractions: [
      'Arrow keys — move selection within the group',
      'Space — selects the focused radio',
    ],
  },
};

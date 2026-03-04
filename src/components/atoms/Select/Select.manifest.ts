import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'select',
  name: 'Select',
  tier: 'atom',
  domain: 'neutral',
  specVersion: '0.1',

  description: 'A dropdown for choosing one option from a list.',

  designIntent:
    'Select is best for 5–15 options where showing all at once would be too noisy. ' +
    'For fewer than 5 options, prefer RadioGroup (always-visible, faster to scan). ' +
    'For search-filtered or async options, a Combobox (Wave 3) is more appropriate. ' +
    'Always provide a placeholder when no default is sensible — this communicates the ' +
    'field is required and prevents silent zero-state submissions.',

  props: [
    {
      name: 'options',
      type: 'array',
      required: true,
      description: 'Array of { value, label, disabled? } option objects.',
    },
    {
      name: 'value',
      type: 'string',
      required: false,
      description: 'Controlled selected value. Pair with onChange.',
    },
    {
      name: 'onChange',
      type: 'function',
      required: false,
      description: 'Called when the selected value changes.',
    },
    {
      name: 'placeholder',
      type: 'string',
      required: false,
      description: 'Disabled first option shown when no value is selected.',
    },
    {
      name: 'label',
      type: 'string',
      required: false,
      description: 'Visible label rendered above the select.',
    },
    {
      name: 'helperText',
      type: 'string',
      required: false,
      description: 'Supplementary hint shown below the select.',
    },
    {
      name: 'errorText',
      type: 'string',
      required: false,
      description: 'Validation error message. Replaces helperText and applies error styling.',
    },
    {
      name: 'size',
      type: 'enum',
      required: false,
      default: 'md',
      description: 'Controls the height of the select control.',
      enumValues: ['sm', 'md', 'lg'],
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      default: 'false',
      description: 'Prevents interaction.',
    },
  ],

  usageExamples: [
    {
      title: 'Controlled',
      code: `
<Select
  label="Country"
  placeholder="Choose a country"
  options={countries}
  value={country}
  onChange={e => setCountry(e.target.value)}
/>`.trim(),
    },
    {
      title: 'With validation error',
      code: `<Select label="Role" options={roles} errorText="Please select a role" />`,
    },
    {
      title: 'With helper text',
      code: `<Select label="Timezone" options={timezones} helperText="Used for scheduling notifications" />`,
    },
  ],

  compositionGraph: [],

  accessibility: {
    role: 'combobox',
    ariaAttributes: ['aria-invalid', 'aria-describedby'],
    keyboardInteractions: [
      'Enter / Space — opens the option list',
      'Arrow keys — navigate options',
      'Escape — closes the list',
    ],
  },
};

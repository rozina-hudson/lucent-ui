import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'checkbox',
  name: 'Checkbox',
  tier: 'atom',
  domain: 'neutral',
  specVersion: '0.1',

  description: 'A binary selection control for boolean values or multi-select lists.',

  designIntent:
    'Checkboxes represent independent boolean choices — they do not affect each other. ' +
    'Use a Checkbox for settings that take effect immediately (e.g. "Remember me") or for ' +
    'selecting multiple items from a list. When only one option may be active at a time, use ' +
    'Radio instead. The indeterminate state communicates a "select all" parent whose children ' +
    'are partially checked — never use it for a third logical state.',

  props: [
    {
      name: 'checked',
      type: 'boolean',
      required: false,
      description: 'Controlled checked state. Pair with onChange for controlled usage.',
    },
    {
      name: 'defaultChecked',
      type: 'boolean',
      required: false,
      default: 'false',
      description: 'Initial checked state for uncontrolled usage.',
    },
    {
      name: 'onChange',
      type: 'function',
      required: false,
      description: 'Called when the checked state changes.',
    },
    {
      name: 'label',
      type: 'string',
      required: false,
      description: 'Visible label rendered beside the checkbox.',
    },
    {
      name: 'indeterminate',
      type: 'boolean',
      required: false,
      default: 'false',
      description: 'Displays a dash to indicate a partially-checked parent state.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      default: 'false',
      description: 'Prevents interaction and dims the control.',
    },
    {
      name: 'size',
      type: 'enum',
      required: false,
      default: 'md',
      description: 'Size of the checkbox box.',
      enumValues: ['sm', 'md'],
    },
  ],

  usageExamples: [
    { title: 'Controlled', code: `<Checkbox checked={agreed} onChange={e => setAgreed(e.target.checked)} label="I agree to the terms" />` },
    { title: 'Uncontrolled', code: `<Checkbox defaultChecked label="Send me updates" />` },
    { title: 'Indeterminate', code: `<Checkbox indeterminate label="Select all" />` },
    { title: 'Disabled', code: `<Checkbox disabled label="Unavailable option" />` },
  ],

  compositionGraph: [],

  accessibility: {
    role: 'checkbox',
    ariaAttributes: ['aria-checked', 'aria-disabled'],
    keyboardInteractions: ['Space — toggles checked state'],
  },
};

import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'toggle',
  name: 'Toggle',
  tier: 'atom',
  domain: 'neutral',
  specVersion: '0.1',

  description: 'A sliding switch for immediately-applied binary settings.',

  designIntent:
    'Toggles are for settings that take effect the moment they are flipped — no Save button ' +
    'needed. If the action requires a confirmation step or only applies on form submit, use a ' +
    'Checkbox instead. The "on" state is visually represented by the accent colour so the ' +
    'meaning is clear without relying on text alone. Keep the label short (2–4 words) and ' +
    'phrase it as the enabled state (e.g. "Dark mode", not "Enable dark mode").',

  props: [
    {
      name: 'checked',
      type: 'boolean',
      required: false,
      description: 'Controlled on/off state. Pair with onChange for controlled usage.',
    },
    {
      name: 'defaultChecked',
      type: 'boolean',
      required: false,
      default: 'false',
      description: 'Initial state for uncontrolled usage.',
    },
    {
      name: 'onChange',
      type: 'function',
      required: false,
      description: 'Called when the toggle is flipped.',
    },
    {
      name: 'label',
      type: 'string',
      required: false,
      description: 'Visible label rendered beside the toggle.',
    },
    {
      name: 'size',
      type: 'enum',
      required: false,
      default: 'md',
      description: 'Controls the track and thumb size.',
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
    { title: 'Controlled', code: `<Toggle checked={darkMode} onChange={e => setDarkMode(e.target.checked)} label="Dark mode" />` },
    { title: 'Uncontrolled', code: `<Toggle defaultChecked label="Email notifications" />` },
    { title: 'Sizes', code: `<Toggle size="sm" label="Compact" />\n<Toggle size="md" label="Default" />\n<Toggle size="lg" label="Large" />` },
    { title: 'Disabled', code: `<Toggle disabled label="Unavailable setting" />` },
  ],

  compositionGraph: [],

  accessibility: {
    role: 'switch',
    ariaAttributes: ['aria-checked', 'aria-disabled'],
    keyboardInteractions: ['Space — toggles the switch state'],
  },
};

import type { ComponentManifest } from '../types.js';

export const ButtonManifest: ComponentManifest = {
  id: 'button',
  name: 'Button',
  tier: 'atom',
  domain: 'neutral',
  specVersion: '0.1',
  description:
    'A clickable control that triggers an action. The primary interactive primitive in Lucent UI.',
  designIntent:
    'Buttons communicate available actions. Variant conveys hierarchy: use "primary" for the ' +
    'single most important action in a view, "secondary" for supporting actions, "ghost" for ' +
    'low-emphasis actions in dense UIs, and "danger" exclusively for destructive or irreversible ' +
    'operations. Size should match surrounding content density — prefer "md" as the default and ' +
    'reserve "sm" for toolbars or tables.',
  props: [
    {
      name: 'variant',
      type: 'enum',
      required: false,
      default: 'primary',
      description: 'Visual style conveying action hierarchy.',
      enumValues: ['primary', 'secondary', 'ghost', 'danger'],
    },
    {
      name: 'size',
      type: 'enum',
      required: false,
      default: 'md',
      description: 'Controls height and padding.',
      enumValues: ['sm', 'md', 'lg'],
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      description: 'Button label or content.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      default: 'false',
      description: 'Prevents interaction and applies disabled styling.',
    },
    {
      name: 'loading',
      type: 'boolean',
      required: false,
      default: 'false',
      description: 'Shows a spinner and prevents interaction while an async action is in progress.',
    },
    {
      name: 'fullWidth',
      type: 'boolean',
      required: false,
      default: 'false',
      description: 'Stretches the button to fill its container width.',
    },
    {
      name: 'leftIcon',
      type: 'ReactNode',
      required: false,
      description: 'Icon element rendered before the label.',
    },
    {
      name: 'rightIcon',
      type: 'ReactNode',
      required: false,
      description: 'Icon element rendered after the label.',
    },
    {
      name: 'onClick',
      type: 'function',
      required: false,
      description: 'Called when the button is clicked and not disabled or loading.',
    },
    {
      name: 'type',
      type: 'enum',
      required: false,
      default: 'button',
      description: 'Native button type attribute.',
      enumValues: ['button', 'submit', 'reset'],
    },
  ],
  usageExamples: [
    {
      title: 'Primary action',
      code: `<Button variant="primary" onClick={handleSave}>Save changes</Button>`,
    },
    {
      title: 'Destructive action',
      code: `<Button variant="danger" onClick={handleDelete}>Delete account</Button>`,
    },
    {
      title: 'Loading state',
      code: `<Button variant="primary" loading={isSaving}>Save changes</Button>`,
    },
    {
      title: 'With icon',
      code: `<Button variant="secondary" leftIcon={<PlusIcon />}>Add member</Button>`,
    },
    {
      title: 'Ghost in toolbar',
      code: `<Button variant="ghost" size="sm">Edit</Button>`,
    },
    {
      title: 'Full-width submit',
      code: `<Button variant="primary" type="submit" fullWidth>Sign in</Button>`,
    },
  ],
  compositionGraph: [],
  accessibility: {
    role: 'button',
    ariaAttributes: ['aria-disabled', 'aria-busy'],
    keyboardInteractions: ['Enter — activates the button', 'Space — activates the button'],
  },
};

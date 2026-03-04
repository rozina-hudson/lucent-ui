import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'icon',
  name: 'Icon',
  tier: 'atom',
  domain: 'neutral',
  specVersion: '0.1',

  description: 'A sized, accessible wrapper for any SVG or icon-set component.',

  designIntent:
    'Icon is intentionally icon-set agnostic — pass any SVG or third-party icon as children ' +
    'and it handles sizing and accessibility automatically. Use label for standalone icons that ' +
    'convey meaning without adjacent text (e.g. a close button). Omit label for decorative ' +
    'icons next to text, where the text already provides context. colour inherits from the ' +
    'parent by default via currentColor — override only when the icon must differ from its ' +
    'surrounding text.',

  props: [
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      description: 'The icon to render — any SVG element or icon-set component.',
    },
    {
      name: 'size',
      type: 'enum',
      required: false,
      default: 'md',
      description: 'Constrains the icon to a fixed square (xs=12, sm=14, md=16, lg=20, xl=24).',
      enumValues: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
      name: 'label',
      type: 'string',
      required: false,
      description: 'Accessible label (aria-label). Provide for meaningful standalone icons; omit for decorative ones.',
    },
    {
      name: 'color',
      type: 'string',
      required: false,
      description: 'CSS colour value. Defaults to currentColor (inherits from parent).',
    },
  ],

  usageExamples: [
    { title: 'Decorative (next to text)', code: `<Icon size="md"><SearchIcon /></Icon>` },
    { title: 'Meaningful (standalone)', code: `<Icon size="lg" label="Close dialog"><XIcon /></Icon>` },
    { title: 'Coloured', code: `<Icon color="var(--lucent-danger-default)"><AlertIcon /></Icon>` },
    { title: 'Inside a button', code: `<Button leftIcon={<Icon size="sm"><PlusIcon /></Icon>}>Add item</Button>` },
  ],

  compositionGraph: [],

  accessibility: {
    role: 'img',
    ariaAttributes: ['aria-label', 'aria-hidden'],
    notes: 'aria-hidden="true" is applied automatically when no label is given, hiding the icon from screen readers.',
  },
};

import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'text',
  name: 'Text',
  tier: 'atom',
  domain: 'neutral',
  specVersion: '0.1',

  description: 'Polymorphic typography primitive that maps semantic HTML elements to design-system type scales.',

  designIntent:
    'Text is the single source of truth for typography in Lucent UI. Rather than hard-coding font sizes ' +
    'and colors directly in components, every piece of rendered text should pass through this atom. ' +
    'The `as` prop controls the HTML element (and therefore semantic meaning), while `size`, `weight`, ' +
    '`color`, and `lineHeight` control appearance independently — decoupling semantics from style. ' +
    'Use `truncate` only in constrained-width containers where overflow must be prevented; it applies ' +
    'overflow: hidden + text-overflow: ellipsis. The `family` prop enables inline code or monospaced ' +
    'content without switching components.',

  props: [
    {
      name: 'as',
      type: 'enum',
      required: false,
      default: 'p',
      description: 'HTML element to render. Controls semantic meaning independently of visual style.',
      enumValues: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'div', 'label', 'strong', 'em', 'code'],
    },
    {
      name: 'size',
      type: 'enum',
      required: false,
      default: 'md',
      description: 'Font size from the type scale. Maps to the corresponding --lucent-font-size-* token.',
      enumValues: ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'],
    },
    {
      name: 'weight',
      type: 'enum',
      required: false,
      default: 'regular',
      description: 'Font weight. Maps to --lucent-font-weight-* tokens.',
      enumValues: ['regular', 'medium', 'semibold', 'bold'],
    },
    {
      name: 'color',
      type: 'enum',
      required: false,
      default: 'primary',
      description: 'Semantic text color. All values adapt automatically in light and dark themes.',
      enumValues: ['primary', 'secondary', 'disabled', 'inverse', 'onAccent', 'success', 'warning', 'danger', 'info'],
    },
    {
      name: 'align',
      type: 'enum',
      required: false,
      default: 'left',
      description: 'Text alignment.',
      enumValues: ['left', 'center', 'right'],
    },
    {
      name: 'lineHeight',
      type: 'enum',
      required: false,
      default: 'base',
      description: 'Line height. tight=1.25, base=1.5, relaxed=1.75.',
      enumValues: ['tight', 'base', 'relaxed'],
    },
    {
      name: 'family',
      type: 'enum',
      required: false,
      default: 'base',
      description: 'Font family. Use mono for code or tabular data. Use display (Unbounded) for headings and marketing copy.',
      enumValues: ['base', 'mono', 'display'],
    },
    {
      name: 'truncate',
      type: 'boolean',
      required: false,
      default: 'false',
      description: 'Clips overflow text with an ellipsis. Requires the container to have a constrained width.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      description: 'The text content to render.',
    },
    {
      name: 'style',
      type: 'object',
      required: false,
      description: 'Inline style overrides. Applied after computed token styles.',
    },
  ],

  usageExamples: [
    { title: 'Heading', code: `<Text as="h1" size="3xl" weight="bold">Page title</Text>` },
    { title: 'Body paragraph', code: `<Text size="md" color="secondary">Supporting copy goes here.</Text>` },
    { title: 'Label', code: `<Text as="label" size="sm" weight="medium" htmlFor="email">Email</Text>` },
    { title: 'Inline code', code: `<Text as="code" family="mono" size="sm">const x = 1;</Text>` },
    { title: 'Truncated', code: `<Text truncate style={{ maxWidth: 200 }}>Very long text that will be clipped</Text>` },
    { title: 'Status color', code: `<Text color="danger" size="xs">This field is required</Text>` },
  ],

  compositionGraph: [],

  accessibility: {
    notes:
      'The rendered element determines the implicit ARIA role. Use heading elements (h1–h6) for document ' +
      'headings so screen readers can navigate the page structure. Use `as="label"` with `htmlFor` to ' +
      'associate labels with form controls. Decorative text needs no additional ARIA.',
  },
};

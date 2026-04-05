import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'stack',
  name: 'Stack',
  tier: 'atom',
  domain: 'neutral',
  specVersion: '0.1',

  description: 'Vertical flex layout primitive that spaces children using design-system gap tokens.',

  designIntent:
    'Stack is the primary vertical layout container. Use it any time you need to arrange elements ' +
    'in a column with consistent spacing — form fields, card content, page sections, sidebar navigation. ' +
    'The gap prop maps to spacing tokens (--lucent-space-*), enforcing consistent vertical rhythm ' +
    'without manual margin management. Prefer Stack over raw inline flex styles for maintainability ' +
    'and readability. Use Row (the horizontal counterpart) when items should flow left-to-right. ' +
    'Stack does not add padding — wrap it in a Card or apply padding on a parent container instead.',

  props: [
    {
      name: 'gap',
      type: 'enum',
      required: false,
      default: '4',
      description: 'Spacing between children. Maps to --lucent-space-{n} tokens.',
      enumValues: ['0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16', '20', '24'],
    },
    {
      name: 'align',
      type: 'enum',
      required: false,
      default: 'stretch',
      description: 'Cross-axis alignment (alignItems). "stretch" fills the container width.',
      enumValues: ['start', 'center', 'end', 'stretch', 'baseline'],
    },
    {
      name: 'justify',
      type: 'enum',
      required: false,
      default: 'start',
      description: 'Main-axis distribution (justifyContent).',
      enumValues: ['start', 'center', 'end', 'between', 'around'],
    },
    {
      name: 'as',
      type: 'enum',
      required: false,
      default: 'div',
      description: 'HTML element to render. Use semantic elements when appropriate (nav for navigation, ul/ol for lists, section/header/footer/main/aside/article for landmarks). When rendering as ul/ol, list-style/margin/padding are auto-reset; consumers pass <li> children.',
      enumValues: ['div', 'section', 'nav', 'header', 'footer', 'main', 'aside', 'article', 'form', 'fieldset', 'ul', 'ol'],
    },
    {
      name: 'wrap',
      type: 'boolean',
      required: false,
      default: 'false',
      description: 'Whether children should wrap to the next line when they exceed the container width.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      description: 'The elements to arrange vertically.',
    },
    {
      name: 'style',
      type: 'object',
      required: false,
      description: 'Inline style overrides. Applied after computed layout styles.',
    },
    {
      name: 'className',
      type: 'string',
      required: false,
      description: 'CSS class name passthrough.',
    },
  ],

  usageExamples: [
    {
      title: 'Form layout',
      code: `<Stack gap="4">\n  <FormField label="Name"><Input /></FormField>\n  <FormField label="Email"><Input type="email" /></FormField>\n  <Button variant="primary">Submit</Button>\n</Stack>`,
    },
    {
      title: 'Card content',
      code: `<Card padding="lg">\n  <Stack gap="3">\n    <Text as="h3" size="lg" weight="semibold">Title</Text>\n    <Text size="sm" color="secondary">Description goes here.</Text>\n    <Button variant="outline" size="sm">Learn more</Button>\n  </Stack>\n</Card>`,
    },
    {
      title: 'Tight spacing',
      code: `<Stack gap="1">\n  <Text size="sm" weight="medium">Label</Text>\n  <Text size="xs" color="secondary">Helper text</Text>\n</Stack>`,
    },
    {
      title: 'Centered content',
      code: `<Stack gap="4" align="center" justify="center" style={{ minHeight: 200 }}>\n  <Spinner />\n  <Text color="secondary">Loading...</Text>\n</Stack>`,
    },
    {
      title: 'Semantic nav',
      code: `<Stack as="nav" gap="1">\n  <NavLink href="/home">Home</NavLink>\n  <NavLink href="/settings">Settings</NavLink>\n</Stack>`,
    },
    {
      title: 'Semantic list (ul)',
      code: `<Stack as="ul" gap="3" aria-label="Recent notes">\n  {notes.map(note => (\n    <li key={note.id}>\n      <Text size="sm">{note.body}</Text>\n    </li>\n  ))}\n</Stack>`,
    },
  ],

  compositionGraph: [],

  accessibility: {
    notes:
      'Stack renders a <div> by default, which has no implicit ARIA role. Use the `as` prop to render ' +
      'semantic elements (nav, section, form) when the content has a specific structural purpose. ' +
      'Add aria-label or aria-labelledby when using landmark elements.',
  },
};

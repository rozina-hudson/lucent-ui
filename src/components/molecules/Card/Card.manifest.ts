import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'card',
  name: 'Card',
  tier: 'molecule',
  domain: 'neutral',
  specVersion: '0.1',

  description: 'A surface container with optional header, body, and footer slots, configurable padding, shadow, and radius.',

  designIntent:
    'Card provides a consistent elevated surface for grouping related content. The header and footer slots ' +
    'are separated from the body by a border-default divider, giving visual structure without requiring ' +
    'the consumer to manage spacing. Padding, shadow, and radius are all configurable to accommodate ' +
    'flat/ghost cards, modal-like surfaces, and compact data-dense layouts. The overflow: hidden ensures ' +
    'children respect the border-radius without needing additional clipping.',

  props: [
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      description: 'The card body content.',
    },
    {
      name: 'header',
      type: 'ReactNode',
      required: false,
      description: 'Content rendered in the header slot, separated from the body by a divider.',
    },
    {
      name: 'footer',
      type: 'ReactNode',
      required: false,
      description: 'Content rendered in the footer slot, separated from the body by a divider.',
    },
    {
      name: 'padding',
      type: 'enum',
      required: false,
      default: 'md',
      description: 'Inner padding applied equally to header, body, and footer.',
      enumValues: ['none', 'sm', 'md', 'lg'],
    },
    {
      name: 'shadow',
      type: 'enum',
      required: false,
      default: 'sm',
      description: 'Box shadow elevation.',
      enumValues: ['none', 'sm', 'md', 'lg'],
    },
    {
      name: 'radius',
      type: 'enum',
      required: false,
      default: 'md',
      description: 'Border radius of the card.',
      enumValues: ['none', 'sm', 'md', 'lg'],
    },
    {
      name: 'style',
      type: 'object',
      required: false,
      description: 'Inline style overrides for the card wrapper.',
    },
  ],

  usageExamples: [
    {
      title: 'Simple card',
      code: `<Card>
  <Text>Some content here.</Text>
</Card>`,
    },
    {
      title: 'With header and footer',
      code: `<Card
  header={<Text weight="semibold">Card title</Text>}
  footer={<Button variant="primary">Save</Button>}
>
  <Text color="secondary">Card body content goes here.</Text>
</Card>`,
    },
    {
      title: 'Flat variant',
      code: `<Card shadow="none" radius="sm" padding="sm">
  <Text size="sm">Compact flat card</Text>
</Card>`,
    },
  ],

  compositionGraph: [],

  accessibility: {
    notes:
      'Card has no implicit ARIA role. If the card represents a landmark, wrap it in a <section> or <article> ' +
      'and provide an aria-label. For interactive cards (clickable), make the wrapper a <button> or <a> and ' +
      'ensure focus styles are visible.',
  },
};

import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'empty-state',
  name: 'EmptyState',
  tier: 'molecule',
  domain: 'neutral',
  specVersion: '0.1',

  description: 'A centered placeholder shown when a list or page has no content, with an optional illustration, title, description, and CTA.',

  designIntent:
    'EmptyState communicates the absence of data in a constructive way. The illustration slot accepts any ' +
    'ReactNode — an Icon atom, a custom SVG, or an image — and constrains it to a 64px square to maintain ' +
    'visual consistency. Title is required to ensure the state is always named; description is optional for ' +
    'additional context. The action slot accepts any ReactNode (typically a Button) so the consumer controls ' +
    'variant and label without prescribing them. The entire layout is center-aligned and padded to sit ' +
    'naturally inside a Card or page section.',

  props: [
    {
      name: 'title',
      type: 'string',
      required: true,
      description: 'Short headline naming the empty state (e.g. "No results found").',
    },
    {
      name: 'illustration',
      type: 'ReactNode',
      required: false,
      description: 'Icon, SVG, or image rendered above the title. Constrained to a 64px container.',
    },
    {
      name: 'description',
      type: 'string',
      required: false,
      description: 'Secondary text below the title providing context or next steps.',
    },
    {
      name: 'action',
      type: 'ReactNode',
      required: false,
      description: 'Call-to-action rendered below the description — typically a Button.',
    },
    {
      name: 'style',
      type: 'object',
      required: false,
      description: 'Inline style overrides for the outer wrapper.',
    },
  ],

  usageExamples: [
    {
      title: 'No search results',
      code: `<EmptyState
  illustration={<Icon size="xl"><SearchIcon /></Icon>}
  title="No results found"
  description="Try adjusting your search or filter to find what you're looking for."
  action={<Button variant="secondary" onClick={clearSearch}>Clear search</Button>}
/>`,
    },
    {
      title: 'Empty list with CTA',
      code: `<EmptyState
  title="No projects yet"
  description="Create your first project to get started."
  action={<Button variant="primary">New project</Button>}
/>`,
    },
    {
      title: 'Inside a Card',
      code: `<Card>
  <EmptyState title="Nothing here" description="Add items to see them listed." />
</Card>`,
    },
  ],

  compositionGraph: [
    { componentId: 'text', componentName: 'Text', role: 'Title and description', required: true },
  ],

  accessibility: {
    notes:
      'The title renders as an h3 by default. If EmptyState appears inside a section with its own heading ' +
      'hierarchy, override by passing a Text component as part of a custom layout. Ensure the action element ' +
      'has a descriptive label for screen readers.',
  },
};

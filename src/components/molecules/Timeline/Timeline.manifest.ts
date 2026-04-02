import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'timeline',
  name: 'Timeline',
  tier: 'molecule',
  domain: 'neutral',
  specVersion: '1.0',

  description: 'A vertical activity feed with filled status dots, inline timestamps, optional nested content blocks, and custom icons.',

  designIntent:
    'Timeline renders as a semantic <ol> with each event as a <li>, preserving document order for assistive technologies. ' +
    'Dots are compact (20px) and filled with the status color, with white iconography for high contrast — this mirrors modern activity-feed patterns. ' +
    'Title and date sit inline (date follows title) to keep the eye on a single reading line, rather than splitting attention across the row. ' +
    'Each item supports an optional content slot for embedded blocks — comment cards, review notes, nested detail panels — placed below the title/description. ' +
    'The connector line is thin (1.5px) and omitted on the last item. ' +
    'Status colors follow the same semantic token set as Alert and Badge so danger/success/warning/info carry consistent meaning across the design system. ' +
    'Custom icons slot in via the icon prop to handle domain-specific event types (e.g. a deploy icon, a payment icon).',

  props: [
    {
      name: 'items',
      type: 'array',
      required: true,
      description: 'Array of TimelineItem objects. Each has id, title, optional description, optional content (ReactNode for embedded blocks), optional date string, optional status, and optional icon.',
    },
    {
      name: 'style',
      type: 'object',
      required: false,
      description: 'Inline style overrides for the outer <ol> wrapper.',
    },
  ],

  usageExamples: [
    {
      title: 'Basic event log',
      code: `<Timeline
  items={[
    { id: '1', title: 'Order placed', date: 'Mar 1, 2026', status: 'success' },
    { id: '2', title: 'Payment processed', date: 'Mar 1, 2026', status: 'success' },
    { id: '3', title: 'Shipped', date: 'Mar 2, 2026', description: 'FedEx tracking: 1234567890' },
    { id: '4', title: 'Delivery failed', date: 'Mar 4, 2026', status: 'danger', description: 'No one home — will retry tomorrow.' },
  ]}
/>`,
    },
    {
      title: 'Activity feed with nested content',
      code: `<Timeline
  items={[
    { id: '1', title: 'Submitted for review', date: 'Mar 22', status: 'success' },
    {
      id: '2',
      title: 'Changes requested',
      date: 'Mar 25',
      status: 'warning',
      content: (
        <Card variant="outline" padding="sm" radius="md">
          <Text size="sm" weight="semibold">Oliver Brown</Text>
          <Text size="sm" color="secondary">Please update the error handling.</Text>
        </Card>
      ),
    },
    { id: '3', title: 'Resubmitted', date: 'Mar 28', status: 'info' },
    { id: '4', title: 'Approved', date: 'Mar 29', status: 'success' },
  ]}
/>`,
    },
  ],

  compositionGraph: [
    { componentId: 'text', componentName: 'Text', role: 'Event title, description, and date label', required: true },
    { componentId: 'card', componentName: 'Card', role: 'Container for nested content blocks in the content slot', required: false },
  ],

  accessibility: {
    role: 'list',
    ariaAttributes: [],
    keyboardInteractions: ['Standard document flow — no interactive elements unless custom icons include them'],
    notes: 'Timeline is a semantic <ol> with <li> items. It is non-interactive by default. If items contain interactive elements (links, buttons), those elements carry their own keyboard behaviour.',
  },
};

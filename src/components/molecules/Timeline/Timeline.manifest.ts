import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'timeline',
  name: 'Timeline',
  tier: 'molecule',
  domain: 'neutral',
  specVersion: '1.0',

  description: 'A vertical ordered event list with status-colored dots, connector lines, optional dates, and custom icons.',

  designIntent:
    'Timeline renders as a semantic <ol> with each event as a <li>, preserving document order for assistive technologies. ' +
    'The dot and connector are rendered in a fixed-width left column so content in the right column can wrap freely without misaligning the spine. ' +
    'The connector line is omitted on the last item — there is nothing to connect to. ' +
    'Status colors follow the same semantic token set as Alert and Badge so danger/success/warning/info carry consistent meaning across the design system. ' +
    'Default status (no explicit icon) renders a plain dot; success/danger/warning get built-in iconography inside the dot. ' +
    'Custom icons slot in via the icon prop to handle domain-specific event types (e.g. a deploy icon, a payment icon).',

  props: [
    {
      name: 'items',
      type: 'array',
      required: true,
      description: 'Array of TimelineItem objects. Each has id, title, optional description, optional date string, optional status, and optional icon.',
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
      title: 'With custom icons',
      code: `<Timeline
  items={[
    { id: 'deploy', title: 'v1.2.0 deployed', status: 'success', icon: <RocketIcon />, date: '2h ago' },
    { id: 'review', title: 'PR #47 merged', icon: <GitMergeIcon />, date: '3h ago' },
    { id: 'alert', title: 'Error rate spike', status: 'warning', icon: <AlertIcon />, date: '4h ago' },
  ]}
/>`,
    },
  ],

  compositionGraph: [
    { componentId: 'text', componentName: 'Text', role: 'Event title, description, and date label', required: true },
  ],

  accessibility: {
    role: 'list',
    ariaAttributes: [],
    keyboardInteractions: ['Standard document flow — no interactive elements unless custom icons include them'],
    notes: 'Timeline is a semantic <ol> with <li> items. It is non-interactive by default. If items contain interactive elements (links, buttons), those elements carry their own keyboard behaviour.',
  },
};

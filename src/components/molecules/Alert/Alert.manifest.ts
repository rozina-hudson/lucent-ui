import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'alert',
  name: 'Alert',
  tier: 'molecule',
  domain: 'neutral',
  specVersion: '0.1',

  description: 'An inline feedback banner with info, success, warning, and danger variants, optional title, and dismiss button.',

  designIntent:
    'Alert uses role="alert" so screen readers announce the message immediately when it appears. ' +
    'Each variant has a built-in icon that communicates intent visually; the icon can be overridden ' +
    'for custom scenarios. Title and body are both optional — you can show either, both, or just an ' +
    'icon with a body. The dismiss button is only rendered when onDismiss is provided, keeping the ' +
    'layout clean for non-dismissible alerts. All colors use status semantic tokens so they adapt ' +
    'correctly between light and dark themes.',

  props: [
    {
      name: 'variant',
      type: 'enum',
      required: false,
      default: 'info',
      description: 'Visual and semantic variant of the alert.',
      enumValues: ['info', 'success', 'warning', 'danger'],
    },
    {
      name: 'title',
      type: 'string',
      required: false,
      description: 'Bold title line rendered above the body.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: false,
      description: 'Alert body content — typically a short sentence or ReactNode.',
    },
    {
      name: 'onDismiss',
      type: 'function',
      required: false,
      description: 'When provided, renders a dismiss (×) button and calls this handler on click.',
    },
    {
      name: 'icon',
      type: 'ReactNode',
      required: false,
      description: 'Custom icon to replace the built-in variant icon.',
    },
    {
      name: 'style',
      type: 'object',
      required: false,
      description: 'Inline style overrides for the alert wrapper.',
    },
  ],

  usageExamples: [
    {
      title: 'Info with body',
      code: `<Alert variant="info">Your changes have been saved as a draft.</Alert>`,
    },
    {
      title: 'With title and dismiss',
      code: `<Alert variant="danger" title="Payment failed" onDismiss={() => setVisible(false)}>
  Check your card details and try again.
</Alert>`,
    },
    {
      title: 'Success confirmation',
      code: `<Alert variant="success" title="Order placed!">
  You'll receive a confirmation email shortly.
</Alert>`,
    },
  ],

  compositionGraph: [
    { componentId: 'text', componentName: 'Text', role: 'Title and body content', required: false },
  ],

  accessibility: {
    role: 'alert',
    ariaAttributes: ['aria-label'],
    notes:
      'role="alert" causes screen readers to announce the content immediately when rendered. ' +
      'For non-urgent status messages, consider using role="status" instead by overriding via style/wrapper.',
  },
};

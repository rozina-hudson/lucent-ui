import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'collapsible',
  name: 'Collapsible',
  tier: 'molecule',
  domain: 'neutral',
  specVersion: '0.1',

  description:
    'Animated expand/collapse container with a built-in chevron trigger and smooth height transition.',

  designIntent:
    'Collapsible hides secondary content behind a trigger button to reduce visual noise. ' +
    'Height is animated by snapshotting scrollHeight before closing and transitioning to 0, ' +
    'then removing the fixed height after the open transition completes so content can reflow freely. ' +
    'A built-in chevron rotates 180° on open, giving clear directional affordance. ' +
    'The `trigger` prop accepts only label content — the chevron and button chrome are owned by the component ' +
    'so callers cannot accidentally break the expand/collapse contract. ' +
    'The component supports controlled (open + onOpenChange) and uncontrolled (defaultOpen) modes.',

  props: [
    {
      name: 'trigger',
      type: 'ReactNode',
      required: true,
      description: 'Label content displayed inside the trigger button alongside the built-in chevron.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      description: 'Content revealed when the collapsible is open.',
    },
    {
      name: 'defaultOpen',
      type: 'boolean',
      required: false,
      default: 'false',
      description: 'Initial open state in uncontrolled mode.',
    },
    {
      name: 'open',
      type: 'boolean',
      required: false,
      description: 'Controlled open state. When provided the component is fully controlled.',
    },
    {
      name: 'onOpenChange',
      type: 'function',
      required: false,
      description: 'Callback fired with the new open boolean when the trigger is clicked.',
    },
    {
      name: 'style',
      type: 'object',
      required: false,
      description: 'Inline style overrides for the root container.',
    },
  ],

  usageExamples: [
    {
      title: 'Uncontrolled',
      code: `<Collapsible trigger="Advanced options">
  <Text size="sm" color="secondary">Hidden settings go here.</Text>
</Collapsible>`,
    },
    {
      title: 'Controlled',
      code: `const [open, setOpen] = useState(false);

<Collapsible open={open} onOpenChange={setOpen} trigger="Details">
  <Text size="sm">Detailed content</Text>
</Collapsible>`,
    },
    {
      title: 'Default open',
      code: `<Collapsible trigger="Description" defaultOpen>
  <Text size="sm" color="secondary">This section starts expanded.</Text>
</Collapsible>`,
    },
  ],

  compositionGraph: [],

  accessibility: {
    ariaAttributes: ['aria-expanded', 'aria-hidden'],
    notes:
      'The trigger is a <button> with aria-expanded reflecting the open state. ' +
      'The content wrapper has aria-hidden="true" when collapsed so screen readers skip it. ' +
      'The built-in chevron SVG is aria-hidden.',
  },
};

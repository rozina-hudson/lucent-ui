import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'collapsible',
  name: 'Collapsible',
  tier: 'molecule',
  domain: 'neutral',
  specVersion: '0.1',

  description:
    'Animated expand/collapse container with a built-in chevron trigger, smooth height transition, ' +
    'and CSS-driven hover feedback.',

  designIntent:
    'Collapsible hides secondary content behind a trigger button to reduce visual noise. ' +
    'Height animation uses direct DOM manipulation via useLayoutEffect to avoid React batching issues: ' +
    'on expand, scrollHeight is snapshotted and transitioned to, then the fixed height is cleared for reflow; ' +
    'on collapse, the current height is flushed to the DOM, a reflow is forced, then height is set to 0. ' +
    'Content fades in/out with opacity + translateY(-4px) at 80ms, while height transitions at 180ms ' +
    'using the easing-default token. ' +
    'A built-in chevron rotates 180° on open, giving clear directional affordance. ' +
    'Hover feedback uses a CSS rule via data-lucent-collapsible-trigger (same pattern as NavMenu): ' +
    '5% text-primary tint on the trigger background, chevron darkens to text-primary. ' +
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
      name: 'disabled',
      type: 'boolean',
      required: false,
      default: 'false',
      description: 'Disables the trigger button. Reduces opacity, sets cursor to not-allowed, and prevents toggling.',
    },
    {
      name: 'padded',
      type: 'boolean',
      required: false,
      default: 'true',
      description:
        'When true (default), applies built-in content padding (space-2 top, space-4 sides, space-3 bottom). ' +
        'Set to false when children provide their own padding — e.g. when nesting a Card inside the Collapsible ' +
        'for the CollapsibleCard combo recipe.',
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
    {
      title: 'CollapsibleCard recipe',
      code: `<Card variant="outline" padding="none" hoverable>
  <Collapsible trigger={<Text as="span" weight="semibold" size="sm">Filters</Text>} defaultOpen>
    <Text size="sm" color="secondary">Card + Collapsible composed together.</Text>
  </Collapsible>
</Card>`,
    },
    {
      title: 'CollapsibleCard combo recipe (padded={false})',
      code: `<Card variant="filled" padding="none" hoverable>
  <Collapsible trigger={<Text as="span" weight="semibold" size="sm">Details</Text>} padded={false}>
    <Card variant="elevated" padding="sm">
      <Text size="sm" color="secondary">Nested elevated card inside a filled card.</Text>
    </Card>
  </Collapsible>
</Card>`,
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

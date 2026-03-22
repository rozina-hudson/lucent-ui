import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'row',
  name: 'Row',
  tier: 'atom',
  domain: 'neutral',
  specVersion: '0.1',

  description: 'Horizontal flex layout primitive that spaces children using design-system gap tokens.',

  designIntent:
    'Row is the primary horizontal layout container. Use it any time you need to arrange elements ' +
    'side by side — button groups, label-value pairs, icon + text combos, toolbar actions. ' +
    'Default align is "center" (vertical centering), which is the most common horizontal layout need. ' +
    'Use justify="between" for space-between patterns like a header with title on the left and actions ' +
    'on the right. Set wrap=true when items should flow to the next line on narrow screens. ' +
    'Row does not add padding — wrap it in a Card or apply padding on a parent container instead. ' +
    'For vertical arrangement, use Stack instead.',

  props: [
    {
      name: 'gap',
      type: 'enum',
      required: false,
      default: '3',
      description: 'Spacing between children. Maps to --lucent-space-{n} tokens.',
      enumValues: ['0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16', '20', '24'],
    },
    {
      name: 'align',
      type: 'enum',
      required: false,
      default: 'center',
      description: 'Cross-axis alignment (alignItems). "center" vertically centers items, which is the most common need.',
      enumValues: ['start', 'center', 'end', 'stretch', 'baseline'],
    },
    {
      name: 'justify',
      type: 'enum',
      required: false,
      default: 'start',
      description: 'Main-axis distribution (justifyContent). Use "between" for label/action pairs.',
      enumValues: ['start', 'center', 'end', 'between', 'around'],
    },
    {
      name: 'as',
      type: 'enum',
      required: false,
      default: 'div',
      description: 'HTML element to render. Use semantic elements when appropriate (nav for navigation, form for forms).',
      enumValues: ['div', 'section', 'nav', 'form', 'fieldset', 'ul', 'ol'],
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
      description: 'The elements to arrange horizontally.',
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
      title: 'Settings toggle',
      code: `<Row gap="3" justify="between">\n  <Text size="sm">Push notifications</Text>\n  <Toggle />\n</Row>`,
    },
    {
      title: 'Button group',
      code: `<Row gap="2">\n  <Button variant="primary">Save</Button>\n  <Button variant="outline">Cancel</Button>\n</Row>`,
    },
    {
      title: 'Stats row',
      code: `<Row gap="6" wrap>\n  <Stack gap="1">\n    <Text size="2xl" weight="bold">1,234</Text>\n    <Text size="xs" color="secondary">Users</Text>\n  </Stack>\n  <Stack gap="1">\n    <Text size="2xl" weight="bold">56.7%</Text>\n    <Text size="xs" color="secondary">Conversion</Text>\n  </Stack>\n</Row>`,
    },
    {
      title: 'Icon + text',
      code: `<Row gap="2" align="center">\n  <Icon name="check" size={16} />\n  <Text size="sm" color="success">Verified</Text>\n</Row>`,
    },
    {
      title: 'Header with actions',
      code: `<Row justify="between">\n  <Text as="h2" size="xl" weight="semibold">Dashboard</Text>\n  <Row gap="2">\n    <Button variant="outline" size="sm">Export</Button>\n    <Button variant="primary" size="sm">New report</Button>\n  </Row>\n</Row>`,
    },
  ],

  compositionGraph: [],

  accessibility: {
    notes:
      'Row renders a <div> by default, which has no implicit ARIA role. Use the `as` prop to render ' +
      'semantic elements (nav, section) when the content has a specific structural purpose. ' +
      'For toolbar patterns, consider adding role="toolbar" via the role prop.',
  },
};

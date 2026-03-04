import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'divider',
  name: 'Divider',
  tier: 'atom',
  domain: 'neutral',
  specVersion: '0.1',
  description: 'A visual separator between content sections, horizontal or vertical.',
  designIntent:
    'Use horizontal Divider to separate sections in a layout. Use vertical Divider inline between sibling elements (e.g. nav links, toolbar buttons). ' +
    'Use the label prop for "OR" separators in auth flows or form sections — never use a plain text node next to a divider for this.',
  props: [
    { name: 'orientation', type: 'enum', required: false, default: 'horizontal', description: 'Direction of the divider line.', enumValues: ['horizontal', 'vertical'] },
    { name: 'label', type: 'string', required: false, description: 'Optional centered label (horizontal only). Common use: "OR", "AND", section titles.' },
    { name: 'spacing', type: 'string', required: false, default: 'var(--lucent-space-4)', description: 'Margin on the axis perpendicular to the line.' },
  ],
  usageExamples: [
    { title: 'Section separator', code: `<Divider />` },
    { title: 'With label', code: `<Divider label="OR" />` },
    { title: 'Vertical in nav', code: `<nav style={{ display: 'flex', alignItems: 'center' }}><a>Home</a><Divider orientation="vertical" /><a>About</a></nav>` },
  ],
  compositionGraph: [],
  accessibility: {
    role: 'separator',
    ariaAttributes: ['aria-orientation', 'aria-label'],
  },
};

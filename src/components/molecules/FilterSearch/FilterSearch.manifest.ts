import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'filter-search',
  name: 'FilterSearch',
  tier: 'molecule',
  domain: 'neutral',
  specVersion: '1.0',

  description: 'A collapsible search button that expands into a text input on click and collapses back when blurred empty.',

  designIntent:
    'FilterSearch saves toolbar space by rendering as a compact square icon button until the user needs it. ' +
    'Clicking expands to a full Input with autofocus. Blurring with an empty value collapses it back. ' +
    'If a value is present the input stays expanded so the user can see their active search. ' +
    'Use in filter bars above DataTables and lists where search is secondary to structured filters.',

  props: [
    { name: 'value', type: 'string', required: false, description: 'Controlled search value.' },
    { name: 'defaultValue', type: 'string', required: false, default: '""', description: 'Initial value for uncontrolled usage.' },
    { name: 'onChange', type: 'function', required: false, description: 'Called with the current input value on each keystroke.' },
    { name: 'placeholder', type: 'string', required: false, default: '"Search…"', description: 'Placeholder shown in the expanded input.' },
    { name: 'variant', type: 'enum', required: false, default: 'secondary', description: 'Button style when collapsed.', enumValues: ['secondary', 'outline'] },
    { name: 'size', type: 'enum', required: false, default: 'sm', description: 'Controls button and input height.', enumValues: ['sm', 'md', 'lg'] },
    { name: 'width', type: 'number', required: false, default: '260', description: 'Width of the expanded input in pixels.' },
    { name: 'disabled', type: 'boolean', required: false, default: 'false', description: 'Disables the button and input.' },
    { name: 'style', type: 'object', required: false, description: 'Inline style overrides.' },
  ],

  usageExamples: [
    { title: 'Basic', code: `<FilterSearch placeholder="Search candidates…" />` },
    { title: 'Controlled', code: `const [q, setQ] = useState('');\n<FilterSearch value={q} onChange={setQ} />` },
    { title: 'Outline variant', code: `<FilterSearch variant="outline" />` },
  ],

  compositionGraph: [
    { componentId: 'button', componentName: 'Button', role: 'Collapsed icon trigger', required: true },
    { componentId: 'input', componentName: 'Input', role: 'Expanded text field', required: true },
  ],

  accessibility: {
    role: 'search',
    keyboardInteractions: ['Enter / Space on icon button expands to input', 'Escape or blur with empty value collapses back'],
    notes: 'The collapsed button has aria-label="Search". The expanded input receives autofocus.',
  },
};

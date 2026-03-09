import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'segmented-control',
  name: 'SegmentedControl',
  tier: 'atom',
  domain: 'neutral',
  specVersion: '0.1',

  description: 'A pill-group selector where exactly one option is always active, with a sliding indicator.',

  designIntent:
    'Use SegmentedControl for mutually exclusive view switches or mode selectors that have ' +
    '2–5 options and where all options should be visible simultaneously (unlike Select). ' +
    'Common uses: view mode (Grid / List / Table), time range (Day / Week / Month), ' +
    'format picker (Hex / RGB / HSL). Keep labels short (1–2 words) so the control stays compact. ' +
    'For more than 5 options or dynamic option lists, prefer Select.',

  props: [
    {
      name: 'options',
      type: 'SegmentedOption[]',
      required: true,
      description: 'Array of { value, label, disabled? }. 2–5 options recommended.',
    },
    {
      name: 'value',
      type: 'string',
      required: false,
      description: 'Controlled selected value. Pair with onChange.',
    },
    {
      name: 'defaultValue',
      type: 'string',
      required: false,
      description: 'Initial value for uncontrolled usage. Defaults to the first option.',
    },
    {
      name: 'onChange',
      type: 'function',
      required: false,
      description: 'Called with the newly selected value.',
    },
    {
      name: 'size',
      type: 'enum',
      required: false,
      default: 'md',
      description: 'Height and font size of the control.',
      enumValues: ['sm', 'md', 'lg'],
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      default: 'false',
      description: 'Disables all options.',
    },
    {
      name: 'fullWidth',
      type: 'boolean',
      required: false,
      default: 'false',
      description: 'Stretches the control to fill its container, distributing options equally.',
    },
  ],

  usageExamples: [
    {
      title: 'Controlled',
      code: `const [view, setView] = useState('grid');
<SegmentedControl
  value={view}
  onChange={setView}
  options={[
    { value: 'grid', label: 'Grid' },
    { value: 'list', label: 'List' },
    { value: 'table', label: 'Table' },
  ]}
/>`,
    },
    {
      title: 'With icons',
      code: `<SegmentedControl
  defaultValue="week"
  options={[
    { value: 'day',   label: <><CalIcon /> Day</>   },
    { value: 'week',  label: <><CalIcon /> Week</>  },
    { value: 'month', label: <><CalIcon /> Month</> },
  ]}
/>`,
    },
    {
      title: 'Full-width, sizes',
      code: `<SegmentedControl fullWidth size="sm" defaultValue="a" options={[{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }]} />
<SegmentedControl fullWidth size="md" defaultValue="a" options={[{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }]} />
<SegmentedControl fullWidth size="lg" defaultValue="a" options={[{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }]} />`,
    },
  ],

  compositionGraph: [],

  accessibility: {
    role: 'group (radiogroup)',
    ariaAttributes: ['aria-checked', 'role="radio"', 'disabled'],
    keyboardInteractions: [
      'Tab — focuses the group',
      'Click — selects an option',
    ],
  },
};

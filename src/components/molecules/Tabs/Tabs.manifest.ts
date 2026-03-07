import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'tabs',
  name: 'Tabs',
  tier: 'molecule',
  domain: 'neutral',
  specVersion: '0.1',

  description:
    'Controlled or uncontrolled tab strip with a sliding accent indicator and full ARIA tablist keyboard navigation.',

  designIntent:
    'Tabs organises sibling content panels behind a horizontal strip of tab buttons. ' +
    'The active tab is marked by a sliding 2px accent-coloured underline that animates between tabs ' +
    'using left/width transitions (no animation on the initial render to avoid a flash). ' +
    'Hover shows a subtle muted pill on the inner label span — intentionally scoped to the label area ' +
    'so it does not bleed into the bottom border zone where the indicator lives. ' +
    'Active text is medium-weight; inactive tabs are secondary-coloured to reduce visual noise. ' +
    'Disabled tabs are rendered with not-allowed cursor and disabled colour, and are skipped by ' +
    'keyboard navigation. The component supports controlled (value + onChange) and uncontrolled ' +
    '(defaultValue) modes.',

  props: [
    {
      name: 'tabs',
      type: 'array',
      required: true,
      description:
        'Array of TabItem objects: { value: string; label: ReactNode; content: ReactNode; disabled?: boolean }.',
    },
    {
      name: 'defaultValue',
      type: 'string',
      required: false,
      description: 'Initially selected tab value in uncontrolled mode. Defaults to the first tab.',
    },
    {
      name: 'value',
      type: 'string',
      required: false,
      description: 'Controlled active tab value. When provided the component is fully controlled.',
    },
    {
      name: 'onChange',
      type: 'function',
      required: false,
      description: 'Callback fired with the new tab value when the user selects a tab.',
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
      title: 'Uncontrolled tabs',
      code: `<Tabs
  tabs={[
    { value: 'overview', label: 'Overview', content: <p>Overview content</p> },
    { value: 'details', label: 'Details', content: <p>Details content</p> },
    { value: 'history', label: 'History', content: <p>History content</p> },
  ]}
/>`,
    },
    {
      title: 'Controlled tabs',
      code: `const [tab, setTab] = useState('overview');

<Tabs
  value={tab}
  onChange={setTab}
  tabs={[
    { value: 'overview', label: 'Overview', content: <p>Overview</p> },
    { value: 'details', label: 'Details', content: <p>Details</p> },
  ]}
/>`,
    },
    {
      title: 'With a disabled tab',
      code: `<Tabs
  tabs={[
    { value: 'active', label: 'Active', content: <p>Active</p> },
    { value: 'disabled', label: 'Disabled', content: <p>Hidden</p>, disabled: true },
  ]}
/>`,
    },
  ],

  compositionGraph: [],

  accessibility: {
    role: 'tablist',
    ariaAttributes: [
      'role="tablist"',
      'role="tab"',
      'role="tabpanel"',
      'aria-selected',
      'aria-controls',
      'aria-labelledby',
    ],
    keyboardInteractions: [
      'ArrowRight — move focus to the next enabled tab and activate it',
      'ArrowLeft — move focus to the previous enabled tab and activate it',
      'Home — move focus and activate the first enabled tab',
      'End — move focus and activate the last enabled tab',
    ],
    notes:
      'Each tab button has role="tab", aria-selected, and aria-controls pointing to its panel. ' +
      'Each panel has role="tabpanel" and aria-labelledby pointing to its tab. ' +
      'Inactive tabs have tabIndex=-1; only the active tab is in the natural tab order. ' +
      'Disabled tabs are excluded from keyboard cycling.',
  },
};

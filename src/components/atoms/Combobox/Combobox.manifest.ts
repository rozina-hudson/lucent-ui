import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'combobox',
  name: 'Combobox',
  tier: 'atom',
  domain: 'neutral',
  specVersion: '0.1',

  description:
    'A searchable single-select form field — type to filter, Enter to commit a value from a known option set.',

  designIntent:
    'Combobox fills the gap between Select (native dropdown, no search — unusable past ~15 options) ' +
    'and FilterSelect (filter-bar pill, wrong chrome for forms). Use it anywhere a Select would feel ' +
    'too long to scan: timezones, country pickers, currencies, long taxonomies. Visually it mirrors ' +
    'Input so it drops into FormField cleanly alongside other form controls. ' +
    'Typing filters the option list (case-insensitive match on label and hint). Enter commits the ' +
    'highlighted match; Escape reverts to the previously committed value without changes. Options ' +
    'support a secondary `hint` (e.g. "UTC-05:00") and can be grouped via `group`. ' +
    'By default only values that exist in `options` can be committed — pair with `allowCustomValue` ' +
    'for free-form text with autocomplete suggestions (e.g. tag input).',

  props: [
    {
      name: 'options',
      type: 'array',
      required: true,
      description: 'Array of { value, label, hint?, group?, disabled? } option objects.',
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
      description: 'Initial selected value in uncontrolled mode.',
    },
    {
      name: 'onChange',
      type: 'function',
      required: false,
      description: 'Called with the new value when a commit happens (click, Enter, or Tab on match).',
    },
    {
      name: 'placeholder',
      type: 'string',
      required: false,
      description: 'Placeholder shown when no value is selected.',
    },
    {
      name: 'label',
      type: 'string',
      required: false,
      description: 'Visible label rendered above the field. Omit if wrapping in FormField.',
    },
    {
      name: 'helperText',
      type: 'string',
      required: false,
      description: 'Supplementary hint rendered below the field.',
    },
    {
      name: 'errorText',
      type: 'string',
      required: false,
      description: 'Validation error message. Replaces helperText and applies error styling.',
    },
    {
      name: 'size',
      type: 'enum',
      required: false,
      default: 'md',
      description: 'Field height — matches Input at each tier.',
      enumValues: ['sm', 'md', 'lg'],
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      default: 'false',
      description: 'Prevents interaction.',
    },
    {
      name: 'allowCustomValue',
      type: 'boolean',
      required: false,
      default: 'false',
      description:
        'When true, committing a query that does not match any option passes the raw text to onChange. ' +
        'Use for free-form text with autocomplete suggestions.',
    },
    {
      name: 'emptyMessage',
      type: 'ReactNode',
      required: false,
      default: '"No matches"',
      description: 'Content shown inside the dropdown when no options match the query.',
    },
    {
      name: 'id',
      type: 'string',
      required: false,
      description: 'Input id for label association. Auto-generated when omitted.',
    },
    {
      name: 'name',
      type: 'string',
      required: false,
      description: 'Form field name.',
    },
  ],

  usageExamples: [
    {
      title: 'Uncontrolled',
      code: `
<Combobox
  label="Framework"
  placeholder="Search frameworks…"
  options={[
    { value: 'react',  label: 'React' },
    { value: 'vue',    label: 'Vue' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'solid',  label: 'Solid' },
  ]}
  defaultValue="react"
/>`.trim(),
    },
    {
      title: 'Controlled with hints (timezone picker)',
      code: `
const [tz, setTz] = useState('America/New_York');

<Combobox
  label="Timezone"
  placeholder="Search timezones…"
  options={[
    { value: 'America/New_York',    label: 'America/New_York',    hint: 'UTC-05:00' },
    { value: 'Europe/London',       label: 'Europe/London',       hint: 'UTC+00:00' },
    { value: 'Asia/Tokyo',          label: 'Asia/Tokyo',          hint: 'UTC+09:00' },
  ]}
  value={tz}
  onChange={setTz}
/>`.trim(),
    },
    {
      title: 'Grouped options',
      code: `
<Combobox
  label="Currency"
  options={[
    { value: 'usd', label: 'US Dollar',    hint: 'USD', group: 'Americas' },
    { value: 'cad', label: 'CA Dollar',    hint: 'CAD', group: 'Americas' },
    { value: 'eur', label: 'Euro',         hint: 'EUR', group: 'Europe' },
    { value: 'gbp', label: 'British Pound', hint: 'GBP', group: 'Europe' },
  ]}
/>`.trim(),
    },
    {
      title: 'Inside FormField',
      code: `
<FormField label="Assignee" htmlFor="assignee" helperText="Required">
  <Combobox id="assignee" options={users} value={assignee} onChange={setAssignee} />
</FormField>`.trim(),
    },
    {
      title: 'Free-form with suggestions',
      code: `
<Combobox
  label="Tag"
  allowCustomValue
  options={existingTags}
  value={tag}
  onChange={setTag}
  placeholder="Pick or type a tag"
/>`.trim(),
    },
    {
      title: 'With validation error',
      code: `<Combobox label="Country" options={countries} errorText="Please select a country" />`,
    },
  ],

  compositionGraph: [],

  accessibility: {
    role: 'combobox',
    ariaAttributes: [
      'aria-autocomplete="list"',
      'aria-expanded',
      'aria-controls',
      'aria-activedescendant',
      'aria-invalid',
      'aria-describedby',
    ],
    keyboardInteractions: [
      'Type — filters the option list',
      'ArrowDown — open dropdown / move to next enabled option',
      'ArrowUp — move to previous enabled option',
      'Home / End — jump to first / last option',
      'Enter — commit the highlighted option (or the typed value when allowCustomValue is true)',
      'Tab — commit highlighted match if query is present, then move focus',
      'Escape — close the dropdown without committing',
    ],
    notes:
      'Follows the WAI-ARIA 1.2 combobox pattern (list autocomplete with manual selection). ' +
      'The listbox renders via portal and is linked to the input with aria-controls. ' +
      'The currently highlighted option is reflected by aria-activedescendant so screen readers ' +
      'announce it without moving DOM focus from the input.',
  },
};

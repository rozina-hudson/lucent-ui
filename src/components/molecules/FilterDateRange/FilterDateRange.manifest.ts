import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'filter-date-range',
  name: 'FilterDateRange',
  tier: 'molecule',
  domain: 'neutral',
  specVersion: '1.0',

  description: 'A compact date range filter button that opens a dual-calendar DateRangePicker popover. Shows the formatted range in the trigger when active.',

  designIntent:
    'FilterDateRange wraps DateRangePicker with a Button trigger instead of the default input-style trigger. ' +
    'When no range is selected, the button shows the label prop. When a range is set, it shows "start → end" dates. ' +
    'The outline variant starts as an outlined button and upgrades to secondary when a range is selected. ' +
    'Use in filter bars alongside FilterSearch, FilterSelect, and FilterMultiSelect for date-based filtering.',

  props: [
    { name: 'label', type: 'string', required: false, default: '"Date range"', description: 'Text shown on the trigger button when no range is selected.' },
    { name: 'value', type: 'object', required: false, description: 'Controlled DateRange value ({ start: Date, end: Date }).' },
    { name: 'defaultValue', type: 'object', required: false, description: 'Initial range for uncontrolled usage.' },
    { name: 'onChange', type: 'function', required: false, description: 'Called with the selected DateRange.' },
    { name: 'variant', type: 'enum', required: false, default: 'secondary', description: 'Button style. "outline" switches to "secondary" when a range is selected.', enumValues: ['secondary', 'outline'] },
    { name: 'size', type: 'enum', required: false, default: 'sm', description: 'Controls button height and calendar scale.', enumValues: ['sm', 'md', 'lg'] },
    { name: 'min', type: 'object', required: false, description: 'Earliest selectable date.' },
    { name: 'max', type: 'object', required: false, description: 'Latest selectable date.' },
    { name: 'disabled', type: 'boolean', required: false, default: 'false', description: 'Disables the trigger button.' },
    { name: 'style', type: 'object', required: false, description: 'Inline style overrides.' },
  ],

  usageExamples: [
    { title: 'Basic', code: `<FilterDateRange label="Date added" />` },
    {
      title: 'Controlled',
      code: `const [range, setRange] = useState<DateRange | undefined>();
<FilterDateRange label="Date range" value={range} onChange={setRange} />`,
    },
    { title: 'Outline variant', code: `<FilterDateRange label="Date range" variant="outline" />` },
    {
      title: 'With min/max',
      code: `<FilterDateRange label="Period" min={new Date(2026, 0, 1)} max={new Date(2026, 11, 31)} />`,
    },
  ],

  compositionGraph: [
    { componentId: 'button', componentName: 'Button', role: 'Trigger button with chevron', required: true },
    { componentId: 'date-range-picker', componentName: 'DateRangePicker', role: 'Dual-calendar popover', required: true },
  ],

  accessibility: {
    role: 'group',
    keyboardInteractions: ['Enter / Space to open calendar', 'Escape to close', 'Arrow keys to navigate calendar days'],
    notes: 'Delegates to DateRangePicker for full calendar keyboard navigation and aria-haspopup="dialog".',
  },
};

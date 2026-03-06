import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'date-range-picker',
  name: 'DateRangePicker',
  tier: 'molecule',
  domain: 'neutral',
  specVersion: '1.0',

  description: 'A two-calendar date range picker. First click sets the start date, second click sets the end; the selected interval is highlighted across both calendars.',

  designIntent:
    'DateRangePicker composes two Calendar primitives from DatePicker side by side, advancing in lockstep (left = current month, right = next month). ' +
    'Selection is a two-click flow: first click anchors the start, a hint appears ("Now pick the end date"), second click resolves the range with automatic start/end ordering so users can click in either direction. ' +
    'The highlight range (accent-subtle background) spans both calendars to give clear visual feedback for the selected interval. ' +
    'Navigation (prev/next month) advances both calendars together to maintain the one-month-apart constraint.',

  props: [
    {
      name: 'value',
      type: 'object',
      required: false,
      description: 'Controlled DateRange { start: Date; end: Date }. When provided the component is fully controlled.',
    },
    {
      name: 'defaultValue',
      type: 'object',
      required: false,
      description: 'Initial DateRange for uncontrolled usage.',
    },
    {
      name: 'onChange',
      type: 'function',
      required: false,
      description: 'Called with the completed DateRange after the user picks both start and end.',
    },
    {
      name: 'placeholder',
      type: 'string',
      required: false,
      default: '"Pick a date range"',
      description: 'Trigger button text when no range is selected.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      default: 'false',
      description: 'Disables the trigger button and all interaction.',
    },
    {
      name: 'min',
      type: 'object',
      required: false,
      description: 'Earliest selectable Date.',
    },
    {
      name: 'max',
      type: 'object',
      required: false,
      description: 'Latest selectable Date.',
    },
    {
      name: 'style',
      type: 'object',
      required: false,
      description: 'Inline style overrides for the outer wrapper.',
    },
  ],

  usageExamples: [
    {
      title: 'Uncontrolled',
      code: `<DateRangePicker onChange={({ start, end }) => console.log(start, end)} />`,
    },
    {
      title: 'Controlled',
      code: `const [range, setRange] = useState<DateRange>();
<DateRangePicker value={range} onChange={setRange} min={new Date()} />`,
    },
  ],

  compositionGraph: [
    { componentId: 'date-picker', componentName: 'DatePicker', role: 'Calendar primitive (two instances, left and right)', required: true },
    { componentId: 'text', componentName: 'Text', role: 'Mid-selection hint and calendar headers', required: true },
  ],

  accessibility: {
    role: 'dialog',
    ariaAttributes: ['aria-haspopup', 'aria-expanded', 'aria-label', 'aria-pressed'],
    keyboardInteractions: ['Enter/Space to open', 'Click first day to set start', 'Click second day to set end', 'Escape/click outside to cancel'],
    notes: 'Inherits Calendar accessibility from DatePicker. The two-step selection flow is reinforced with a visible "Now pick the end date" hint.',
  },
};

import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'date-picker',
  name: 'DatePicker',
  tier: 'molecule',
  domain: 'neutral',
  specVersion: '1.0',

  description: 'A single-date picker with a calendar popover, month navigation, today highlight, min/max constraints, and controlled or uncontrolled modes.',

  designIntent:
    'DatePicker deliberately avoids native <input type="date"> to guarantee consistent cross-browser appearance that matches the Lucent token system. ' +
    'The trigger button shows the selected date in YYYY-MM-DD format (ISO-sortable, unambiguous locale-wise) or a placeholder. ' +
    'The calendar popover renders as a role="dialog" and closes on outside click. ' +
    'Today is outlined rather than filled so it doesn\'t compete visually with the selected date. ' +
    'Disabled dates (outside min/max) are grayed out and non-interactive. ' +
    'The Calendar primitive is exported separately so DateRangePicker can compose two calendars side by side.',

  props: [
    {
      name: 'value',
      type: 'object',
      required: false,
      description: 'Controlled selected Date. When provided the component is fully controlled.',
    },
    {
      name: 'defaultValue',
      type: 'object',
      required: false,
      description: 'Initial selected Date for uncontrolled usage.',
    },
    {
      name: 'onChange',
      type: 'function',
      required: false,
      description: 'Called with the newly selected Date when the user picks a day.',
    },
    {
      name: 'placeholder',
      type: 'string',
      required: false,
      default: '"Pick a date"',
      description: 'Trigger button text when no date is selected.',
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
      description: 'Earliest selectable Date. Days before this are grayed out.',
    },
    {
      name: 'max',
      type: 'object',
      required: false,
      description: 'Latest selectable Date. Days after this are grayed out.',
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
      code: `<DatePicker onChange={(d) => console.log(d)} />`,
    },
    {
      title: 'Controlled with constraints',
      code: `const [date, setDate] = useState<Date>();
<DatePicker
  value={date}
  onChange={setDate}
  min={new Date()}
  placeholder="Select a future date"
/>`,
    },
  ],

  compositionGraph: [
    { componentId: 'text', componentName: 'Text', role: 'Month/year header and weekday labels', required: true },
  ],

  accessibility: {
    role: 'dialog',
    ariaAttributes: ['aria-haspopup', 'aria-expanded', 'aria-label', 'aria-pressed'],
    keyboardInteractions: ['Enter/Space to open calendar', 'Click day to select', 'Escape closes popover (click outside)'],
    notes: 'The calendar popover is role="dialog". Each day button has aria-label with the full date and aria-pressed for selected state. Full arrow-key navigation within the calendar grid is a planned enhancement.',
  },
};

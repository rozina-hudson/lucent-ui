import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'filter-select',
  name: 'FilterSelect',
  tier: 'molecule',
  domain: 'neutral',
  specVersion: '1.0',

  description: 'A compact single-select filter button that opens a Menu dropdown. Shows the selected label in the trigger and a "Clear" footer when active.',

  designIntent:
    'FilterSelect wraps Button + Menu into a self-contained single-select filter. ' +
    'The trigger shows the label prop when nothing is selected and switches to the selected option label when active. ' +
    'A "Clear" footer appears when a value is selected so the user can reset without an external clear button. ' +
    'The outline variant starts as an outlined button and upgrades to secondary when a value is picked, ' +
    'giving a visual signal that the filter is active. ' +
    'Use for sort controls, single-category filters, and any exclusive-choice filter in a toolbar.',

  props: [
    { name: 'label', type: 'string', required: true, description: 'Text shown on the trigger button when no value is selected.' },
    { name: 'options', type: 'array', required: true, description: 'Array of { value, label, disabled? } option objects.' },
    { name: 'value', type: 'string', required: false, description: 'Controlled selected value.' },
    { name: 'defaultValue', type: 'string', required: false, description: 'Initial value for uncontrolled usage.' },
    { name: 'onChange', type: 'function', required: false, description: 'Called with the selected value, or undefined when cleared.' },
    { name: 'variant', type: 'enum', required: false, default: 'secondary', description: 'Button style. "outline" switches to "secondary" when a value is selected.', enumValues: ['secondary', 'outline'] },
    { name: 'size', type: 'enum', required: false, default: 'sm', description: 'Controls button and menu item size.', enumValues: ['sm', 'md', 'lg'] },
    { name: 'disabled', type: 'boolean', required: false, default: 'false', description: 'Disables the trigger button.' },
    { name: 'icon', type: 'ReactNode', required: false, description: 'Icon rendered before the label via leftIcon on the trigger button.' },
    { name: 'style', type: 'object', required: false, description: 'Inline style overrides for the Menu wrapper.' },
  ],

  usageExamples: [
    {
      title: 'Sort control',
      code: `<FilterSelect label="Newest first" icon={<SortIcon />} options={[
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'name', label: 'Name A–Z' },
]} />`,
    },
    {
      title: 'Outline variant',
      code: `<FilterSelect label="Availability" variant="outline" options={[
  { value: 'available', label: 'Available' },
  { value: 'unavailable', label: 'Unavailable' },
]} />`,
    },
    {
      title: 'Controlled',
      code: `const [sort, setSort] = useState<string | undefined>();
<FilterSelect label="Sort" value={sort} onChange={setSort} options={sortOptions} />`,
    },
  ],

  compositionGraph: [
    { componentId: 'button', componentName: 'Button', role: 'Trigger button with chevron', required: true },
    { componentId: 'menu', componentName: 'Menu', role: 'Dropdown popover', required: true },
    { componentId: 'text', componentName: 'Text', role: 'Clear footer label', required: true },
  ],

  accessibility: {
    role: 'listbox',
    keyboardInteractions: ['Arrow keys to navigate', 'Enter / Space to select', 'Escape to close'],
    notes: 'Delegates to Menu for full WAI-ARIA menu button keyboard navigation.',
  },
};

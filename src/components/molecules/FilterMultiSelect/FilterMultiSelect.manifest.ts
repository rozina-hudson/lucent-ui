import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'filter-multi-select',
  name: 'FilterMultiSelect',
  tier: 'molecule',
  domain: 'neutral',
  specVersion: '1.0',

  description: 'A compact multi-select filter button with a dropdown panel of checkbox items, accent count badge, optional color swatches, and a "Clear all" footer.',

  designIntent:
    'FilterMultiSelect encapsulates the full multi-select filter pattern into a single component. ' +
    'The trigger button shows the label plus an accent Chip with the selection count when items are active. ' +
    'The dropdown stays open on toggle so users can check multiple items without reopening. ' +
    'Each option renders a Checkbox for selection state; when a swatch color is provided, the label renders as a Chip with a colored dot. ' +
    'An always-visible "Clear all" footer (disabled when nothing is selected) lets users reset without an external button. ' +
    'The outline variant starts as an outlined button and upgrades to secondary when items are checked. ' +
    'This replaces the verbose pattern of manually wiring Menu open state, keepOpen hacks, and count badges.',

  props: [
    { name: 'label', type: 'string', required: true, description: 'Text shown on the trigger button.' },
    { name: 'options', type: 'array', required: true, description: 'Array of { value, label, swatch?, disabled? } option objects.' },
    { name: 'value', type: 'array', required: false, description: 'Controlled array of selected values.' },
    { name: 'defaultValue', type: 'array', required: false, default: '[]', description: 'Initial selected values for uncontrolled usage.' },
    { name: 'onChange', type: 'function', required: false, description: 'Called with the updated array of selected values on each change.' },
    { name: 'variant', type: 'enum', required: false, default: 'secondary', description: 'Button style. "outline" switches to "secondary" when items are selected.', enumValues: ['secondary', 'outline'] },
    { name: 'size', type: 'enum', required: false, default: 'sm', description: 'Controls button, checkbox, and chip size.', enumValues: ['sm', 'md', 'lg'] },
    { name: 'disabled', type: 'boolean', required: false, default: 'false', description: 'Disables the trigger button.' },
    { name: 'icon', type: 'ReactNode', required: false, description: 'Icon rendered before the label via leftIcon on the trigger button.' },
    { name: 'style', type: 'object', required: false, description: 'Inline style overrides for the outer wrapper.' },
  ],

  usageExamples: [
    {
      title: 'Tags with swatches',
      code: `<FilterMultiSelect label="Tags" options={[
  { value: 'react', label: 'React', swatch: '#3b82f6' },
  { value: 'devops', label: 'DevOps', swatch: '#10b981' },
  { value: 'data', label: 'Data Science', swatch: '#6366f1' },
]} />`,
    },
    {
      title: 'Plain labels',
      code: `<FilterMultiSelect label="Status" options={[
  { value: 'active', label: 'Active' },
  { value: 'archived', label: 'Archived' },
  { value: 'on-hold', label: 'On hold' },
]} />`,
    },
    {
      title: 'Outline variant',
      code: `<FilterMultiSelect label="Tags" variant="outline" options={tagOptions} />`,
    },
    {
      title: 'Controlled',
      code: `const [tags, setTags] = useState<string[]>([]);
<FilterMultiSelect label="Tags" value={tags} onChange={setTags} options={tagOptions} />`,
    },
  ],

  compositionGraph: [
    { componentId: 'button', componentName: 'Button', role: 'Trigger button with chevron and count badge', required: true },
    { componentId: 'chip', componentName: 'Chip', role: 'Count badge in trigger and swatch labels in dropdown', required: true },
    { componentId: 'checkbox', componentName: 'Checkbox', role: 'Selection indicator per option row', required: true },
    { componentId: 'text', componentName: 'Text', role: 'Plain option labels and Clear all footer', required: true },
  ],

  accessibility: {
    role: 'listbox',
    ariaAttributes: ['aria-multiselectable', 'aria-selected', 'aria-disabled', 'aria-label'],
    keyboardInteractions: ['↑↓ to navigate options', 'Enter / Space to toggle selection', 'Escape to close'],
    notes: 'The dropdown panel has role="listbox" with aria-multiselectable. Each option has role="option" with aria-selected.',
  },
};

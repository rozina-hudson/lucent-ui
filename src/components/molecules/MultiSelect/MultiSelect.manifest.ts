import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'multi-select',
  name: 'MultiSelect',
  tier: 'molecule',
  domain: 'neutral',
  specVersion: '1.0',

  description: 'A tag-based multi-option selector with inline search, keyboard navigation, and an optional selection cap.',

  designIntent:
    'MultiSelect renders selected values as removable tags inside the trigger area, giving immediate visual feedback on what is selected. ' +
    'The search input sits inline with the tags so there is no separate search field to discover. ' +
    'Backspace with an empty query removes the last selected tag — a standard UX pattern in multi-select inputs. ' +
    'The max prop caps selection without disabling the entire component: unselected options beyond the cap are grayed out and show a hint. ' +
    'The dropdown closes on outside click, Escape, or when focus leaves. ' +
    'Checkbox indicators in the dropdown make the selected state scannable at a glance without relying solely on background color.',

  props: [
    {
      name: 'options',
      type: 'array',
      required: true,
      description: 'Array of { value, label, disabled? } option objects.',
    },
    {
      name: 'value',
      type: 'array',
      required: false,
      description: 'Controlled array of selected values.',
    },
    {
      name: 'defaultValue',
      type: 'array',
      required: false,
      default: '[]',
      description: 'Initial selected values for uncontrolled usage.',
    },
    {
      name: 'onChange',
      type: 'function',
      required: false,
      description: 'Called with the updated array of selected values on each change.',
    },
    {
      name: 'placeholder',
      type: 'string',
      required: false,
      default: '"Select…"',
      description: 'Placeholder shown when nothing is selected.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      default: 'false',
      description: 'Disables interaction and dims the component.',
    },
    {
      name: 'max',
      type: 'number',
      required: false,
      description: 'Maximum number of selectable options. Unselected options beyond the cap are grayed out.',
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
      code: `<MultiSelect
  options={[
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'svelte', label: 'Svelte' },
  ]}
  placeholder="Select frameworks…"
/>`,
    },
    {
      title: 'Controlled with max',
      code: `const [tags, setTags] = useState<string[]>([]);
<MultiSelect
  options={allTags}
  value={tags}
  onChange={setTags}
  max={3}
  placeholder="Up to 3 tags"
/>`,
    },
  ],

  compositionGraph: [
    { componentId: 'text', componentName: 'Text', role: 'Option labels, empty state, and max hint', required: true },
  ],

  accessibility: {
    role: 'combobox',
    ariaAttributes: ['aria-autocomplete', 'aria-controls', 'aria-expanded', 'aria-multiselectable', 'aria-selected', 'aria-disabled'],
    keyboardInteractions: ['↑↓ to navigate options', 'Enter to toggle selection', 'Escape to close', 'Backspace to remove last tag'],
    notes: 'The input carries role="combobox" with aria-expanded and aria-controls pointing to the listbox. Each option has role="option" with aria-selected. Remove buttons on tags have descriptive aria-label.',
  },
};

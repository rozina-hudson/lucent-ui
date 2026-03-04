import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'search-input',
  name: 'SearchInput',
  tier: 'molecule',
  domain: 'neutral',
  specVersion: '0.1',

  description: 'A search field with a built-in magnifier icon, clear button, and an optional results dropdown.',

  designIntent:
    'SearchInput is intentionally dumb about filtering — the consumer passes already-filtered results ' +
    'so the component stays stateless and flexible. The clear button appears only when the input has a ' +
    'value, keeping the right side clean at rest. The results dropdown is rendered absolutely below the ' +
    'input and closes after a 150ms delay on blur to allow result clicks to register before focus is lost. ' +
    'Spinner replaces the clear button during loading to communicate async state without layout shift.',

  props: [
    {
      name: 'value',
      type: 'string',
      required: true,
      description: 'Controlled input value.',
    },
    {
      name: 'onChange',
      type: 'function',
      required: true,
      description: 'Called with the new string value whenever the input changes.',
    },
    {
      name: 'placeholder',
      type: 'string',
      required: false,
      default: '"Search…"',
      description: 'Placeholder text for the input.',
    },
    {
      name: 'results',
      type: 'array',
      required: false,
      default: '[]',
      description: 'Pre-filtered list of SearchResult objects ({ id, label }) to display in the dropdown.',
    },
    {
      name: 'onResultSelect',
      type: 'function',
      required: false,
      description: 'Called with the selected SearchResult when a dropdown item is clicked.',
    },
    {
      name: 'isLoading',
      type: 'boolean',
      required: false,
      default: 'false',
      description: 'Shows a spinner in the right slot to indicate async search in progress.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      default: 'false',
      description: 'Disables the input.',
    },
    {
      name: 'id',
      type: 'string',
      required: false,
      description: 'HTML id forwarded to the underlying input element.',
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
      title: 'Basic controlled search',
      code: `const [query, setQuery] = useState('');
const [results, setResults] = useState([]);

<SearchInput
  value={query}
  onChange={(v) => { setQuery(v); setResults(filter(v)); }}
  results={results}
  onResultSelect={(r) => console.log(r)}
/>`,
    },
    {
      title: 'Loading state',
      code: `<SearchInput value={query} onChange={setQuery} isLoading={isFetching} results={[]} />`,
    },
  ],

  compositionGraph: [
    { componentId: 'input', componentName: 'Input', role: 'Search text field with icon slots', required: true },
    { componentId: 'spinner', componentName: 'Spinner', role: 'Loading indicator in the right slot', required: false },
  ],

  accessibility: {
    role: 'combobox',
    ariaAttributes: ['aria-expanded', 'aria-haspopup', 'aria-label'],
    keyboardInteractions: ['Enter to select focused result', 'Escape to close dropdown'],
    notes:
      'The results list uses role="listbox" with role="option" items. For full keyboard navigation ' +
      '(arrow keys to move between results), wire up onKeyDown on the Input and manage an activeIndex state.',
  },
};

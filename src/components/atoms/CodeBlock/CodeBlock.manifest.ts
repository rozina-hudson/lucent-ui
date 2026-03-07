import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'code-block',
  name: 'CodeBlock',
  tier: 'atom',
  domain: 'neutral',
  specVersion: '0.1',

  description:
    'A styled <pre><code> block with an optional language label and copy-to-clipboard button.',

  designIntent:
    'Use CodeBlock for displaying static code snippets, API examples, or terminal output. ' +
    'It is intentionally zero-dependency — no syntax highlighting library is bundled. ' +
    'The component provides structure, theming, and clipboard UX; if syntax highlighting is ' +
    'needed, pre-process the code externally and pass HTML (or use a render prop). ' +
    'Horizontal scrolling handles long lines without wrapping.',

  props: [
    {
      name: 'code',
      type: 'string',
      required: true,
      description: 'The source code string to display.',
    },
    {
      name: 'language',
      type: 'string',
      required: false,
      description:
        'Optional language label shown in the header (e.g. "tsx", "bash"). ' +
        'No syntax highlighting is applied — this is purely cosmetic.',
    },
    {
      name: 'showCopyButton',
      type: 'boolean',
      required: false,
      default: 'true',
      description:
        'Renders a copy-to-clipboard button in the header. ' +
        'Briefly shows a "Copied!" confirmation state on success.',
    },
  ],

  usageExamples: [
    {
      title: 'Basic',
      code: `<CodeBlock code={\`const greeting = 'hello';\`} />`,
    },
    {
      title: 'With language label',
      code: `<CodeBlock language="tsx" code={\`<Button variant="primary">Save</Button>\`} />`,
    },
    {
      title: 'No copy button',
      code: `<CodeBlock showCopyButton={false} code="npm install lucent-ui" />`,
    },
    {
      title: 'Terminal output',
      code: `<CodeBlock language="bash" code={\`$ lucent-ui init\nCreated 3 components.\`} />`,
    },
  ],

  compositionGraph: [],

  accessibility: {
    role: 'region',
    ariaAttributes: ['aria-label (copy button)'],
    keyboardInteractions: [
      'Tab — focuses the copy button',
      'Enter / Space — copies the code',
    ],
  },
};

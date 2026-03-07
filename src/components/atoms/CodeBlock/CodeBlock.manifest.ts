import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'code-block',
  name: 'CodeBlock',
  tier: 'atom',
  domain: 'neutral',
  specVersion: '0.1',

  description:
    'A styled code display with optional tabs, a language label, copy-to-clipboard, and an AI prompt variant.',

  designIntent:
    'Use CodeBlock for static code snippets, install commands, API examples, and AI prompt sharing. ' +
    'The tabs prop switches between related snippets (e.g. pnpm / npm / yarn). ' +
    'The prompt variant renders a single-line truncated display suited to AI tool prompts — ' +
    'the full text is always copied even when visually clipped. ' +
    'Zero-dependency — no syntax highlighting library is bundled.',

  props: [
    {
      name: 'code',
      type: 'string',
      required: false,
      description: 'Code string — used in single (non-tabbed) mode.',
    },
    {
      name: 'language',
      type: 'string',
      required: false,
      description: 'Language label shown in the header (non-tabbed mode only). Purely cosmetic.',
    },
    {
      name: 'tabs',
      type: 'array',
      required: false,
      description:
        'Tabbed mode. Each entry has { label, code, language?, icon? }. ' +
        'Switching tabs resets the copied state.',
    },
    {
      name: 'variant',
      type: 'enum',
      required: false,
      default: 'code',
      enumValues: ['code', 'prompt'],
      description:
        '"code" renders a <pre><code> block with horizontal scroll. ' +
        '"prompt" renders a single-line truncated span suited to AI prompts.',
    },
    {
      name: 'helperText',
      type: 'string',
      required: false,
      description: 'Descriptive text rendered between the tab bar and the code area.',
    },
    {
      name: 'showCopyButton',
      type: 'boolean',
      required: false,
      default: 'true',
      description:
        'Renders a copy-to-clipboard button. ' +
        'Shows a "Copied!" confirmation for 2 s on success.',
    },
  ],

  usageExamples: [
    {
      title: 'Single snippet',
      code: `<CodeBlock language="tsx" code={\`<Button variant="primary">Save</Button>\`} />`,
    },
    {
      title: 'Tabbed install commands',
      code: `<CodeBlock tabs={[\n  { label: 'pnpm', code: 'pnpm add lucent-ui', language: 'bash' },\n  { label: 'npm',  code: 'npm install lucent-ui', language: 'bash' },\n]} />`,
    },
    {
      title: 'AI prompt',
      code: `<CodeBlock\n  variant="prompt"\n  helperText="Paste into Claude:"\n  tabs={[\n    { label: 'Claude', icon: '♦', code: '"Add a Button with variant=\\"primary\\"."' },\n    { label: 'Cursor', icon: '↖', code: '@lucent-ui Add a primary Button.' },\n  ]}\n/>`,
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

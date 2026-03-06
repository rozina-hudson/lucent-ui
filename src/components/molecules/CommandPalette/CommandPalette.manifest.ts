import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'command-palette',
  name: 'CommandPalette',
  tier: 'overlay',
  domain: 'neutral',
  specVersion: '1.0',

  description: 'A keyboard-driven modal command palette with fuzzy search, grouped results, and a built-in ⌘K / Ctrl+K global shortcut.',

  designIntent:
    'CommandPalette renders as a portal-style overlay (fixed, full-viewport) with a centred panel that animates in with a subtle scale+fade. ' +
    'The ⌘K shortcut is registered as a global window listener so it works regardless of focus — consumers can override the key via shortcutKey prop. ' +
    'Clicking the backdrop dismisses the palette; Escape also closes it. ' +
    'Results are filtered client-side against label and description using simple substring match — no fuzzy library needed. ' +
    'Navigation is purely keyboard-driven: ↑↓ move the active index, Enter selects, mouse hover syncs the active index so mouse and keyboard stay in sync. ' +
    'Groups are derived from the group field on each CommandItem; the order of groups follows the order they first appear in the commands array. ' +
    'The component is controlled-or-uncontrolled: pass open + onOpenChange for controlled use, or omit both to use internal state.',

  props: [
    {
      name: 'commands',
      type: 'array',
      required: true,
      description: 'Array of CommandItem objects. Each has id, label, onSelect, and optional description, icon, group, disabled.',
    },
    {
      name: 'placeholder',
      type: 'string',
      required: false,
      default: '"Search commands…"',
      description: 'Placeholder text for the search input.',
    },
    {
      name: 'shortcutKey',
      type: 'string',
      required: false,
      default: '"k"',
      description: 'Key that opens the palette when pressed with Meta (Mac) or Ctrl (Windows). Defaults to "k" for ⌘K.',
    },
    {
      name: 'open',
      type: 'boolean',
      required: false,
      description: 'Controlled open state. When provided, the component is fully controlled.',
    },
    {
      name: 'onOpenChange',
      type: 'function',
      required: false,
      description: 'Called when the palette requests an open/close state change.',
    },
    {
      name: 'style',
      type: 'object',
      required: false,
      description: 'Inline style overrides for the backdrop element.',
    },
  ],

  usageExamples: [
    {
      title: 'Uncontrolled with ⌘K',
      code: `<CommandPalette
  commands={[
    { id: 'new', label: 'New document', icon: <PlusIcon />, onSelect: () => router.push('/new') },
    { id: 'settings', label: 'Settings', description: 'Open app settings', onSelect: () => router.push('/settings') },
    { id: 'logout', label: 'Log out', group: 'Account', onSelect: handleLogout },
  ]}
/>`,
    },
    {
      title: 'Controlled with custom shortcut',
      code: `const [open, setOpen] = useState(false);
<>
  <Button onClick={() => setOpen(true)}>Open palette</Button>
  <CommandPalette
    commands={commands}
    open={open}
    onOpenChange={setOpen}
    shortcutKey="p"
  />
</>`,
    },
  ],

  compositionGraph: [
    { componentId: 'text', componentName: 'Text', role: 'Group labels, item labels, descriptions, and empty state', required: true },
  ],

  accessibility: {
    role: 'dialog',
    ariaAttributes: ['aria-label', 'aria-modal', 'aria-expanded', 'aria-selected', 'aria-disabled', 'aria-controls', 'aria-autocomplete'],
    keyboardInteractions: ['⌘K / Ctrl+K to open', '↑↓ to navigate', 'Enter to select', 'Escape to close'],
    notes: 'The backdrop and panel use role="dialog" with aria-modal="true". The input is role="searchbox". The result list is role="listbox" with role="option" items. Focus is moved to the search input on open.',
  },
};

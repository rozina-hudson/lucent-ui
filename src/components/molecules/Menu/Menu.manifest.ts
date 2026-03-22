import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'menu',
  name: 'Menu',
  tier: 'molecule',
  domain: 'neutral',
  specVersion: '0.1',

  description:
    'A dropdown menu triggered by clicking a host element. Renders in a portal to avoid overflow clipping, ' +
    'supports placement with auto-flip, keyboard navigation (arrow keys, Enter, Escape), and outside-click dismissal.',

  designIntent:
    'Menu provides a contextual action list that appears from a trigger element. It is a foundational ' +
    'overlay primitive — Select dropdowns, notification feeds, and context menus can all be composed from ' +
    'this building block.\n\n' +

    '## Compound component API\n' +
    'Menu uses a compound component pattern (`Menu`, `MenuItem`, `MenuSeparator`, `MenuGroup`) rather than ' +
    'a flat data array. Menu items have divergent structures — actions, separators, groups, icons, shortcut ' +
    'hints, danger state — that compose naturally as JSX children rather than discriminated union objects.\n\n' +

    '## Sizing\n' +
    'The `size` prop (`sm` | `md` | `lg`) flows from the root `Menu` through context to all sub-components. ' +
    'Font sizes are aligned with Button: sm → `font-size-sm`, md → `font-size-md`, lg → `font-size-lg`. ' +
    'Item padding and gap use `space-2` for sm/md and `space-3` for lg, matching MultiSelect dropdown spacing. ' +
    'Group labels stay one step smaller than item text. Checkmark icons scale from 12px to 16px.\n\n' +

    '## Placement & auto-flip\n' +
    'The `placement` prop sets the preferred position (default `bottom-start`). When the popover would ' +
    'overflow the viewport, it automatically flips to the opposite side. Horizontal alignment (`-start`, ' +
    '`-end`, or centered) is preserved during the flip. Position is computed with `getBoundingClientRect` ' +
    'on mount and rendered via `position: fixed` in a portal.\n\n' +

    '## Portal rendering\n' +
    'The popover is portaled to `document.body` via `createPortal`. This prevents overflow clipping from ' +
    'parent containers with `overflow: hidden`. The trigger wrapper stays inline in the DOM tree so it ' +
    'participates in layout normally.\n\n' +

    '## Keyboard navigation\n' +
    'Follows WAI-ARIA Menu Button pattern. Arrow keys cycle through enabled items (wrapping). Enter/Space ' +
    'selects the active item and closes the menu. Escape closes without selection. Tab closes and lets ' +
    'focus move naturally. Home/End jump to first/last enabled item.\n\n' +

    '## Dismissal\n' +
    'Menus close on outside click (mousedown, deferred via `requestAnimationFrame` to avoid catching the ' +
    'opening click), Escape, Tab, and scroll (armed after 50ms to skip mount-triggered scroll events). ' +
    'After close, focus returns to the trigger element.\n\n' +

    '## Selected state\n' +
    'MenuItem accepts a `selected` prop that renders a trailing accent-colored checkmark. The selected item ' +
    'gets a `color-mix(in srgb, accent-default 12%, surface-overlay)` background with `shadow-sm` elevation, ' +
    'making it visually stronger than the hover state (`surface-secondary`). Uses `role="menuitemcheckbox"` ' +
    'with `aria-checked` for accessibility.\n\n' +

    '## Animation\n' +
    'Both entrance and exit use a subtle scale + fade (`scale(0.97) ↔ 1`, `opacity 0 ↔ 1`) over 120ms. ' +
    'Entrance uses `easing-decelerate`, exit uses `easing-default`. `transform-origin` is set based on the ' +
    'actual placement (after auto-flip). The portal stays mounted during the exit animation via a `visible` ' +
    'state with `pointerEvents: none` to prevent interaction while fading out.',

  props: [
    {
      name: 'trigger',
      type: 'ReactNode',
      required: true,
      description:
        'The element that toggles the menu on click. Typically a Button with a chevron. ' +
        'Wrapped in a <span> that receives click, keyboard, and ARIA attributes.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      description: 'MenuItem, MenuSeparator, and/or MenuGroup elements.',
    },
    {
      name: 'size',
      type: 'enum',
      required: false,
      default: 'md',
      description:
        'Size of the menu panel. Controls item padding, gap, font size, and checkmark icon size. ' +
        'Font sizes match Button at each tier: sm → font-size-sm, md → font-size-md, lg → font-size-lg.',
      enumValues: ['sm', 'md', 'lg'],
    },
    {
      name: 'placement',
      type: 'enum',
      required: false,
      default: 'bottom-start',
      description:
        'Preferred placement relative to the trigger. Auto-flips when near viewport edges.',
      enumValues: ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'right'],
    },
    {
      name: 'open',
      type: 'boolean',
      required: false,
      description: 'Controlled open state. When provided, the menu becomes controlled.',
    },
    {
      name: 'onOpenChange',
      type: 'function',
      required: false,
      description: 'Callback fired when the menu opens or closes. Receives the new open state.',
    },
    {
      name: 'style',
      type: 'object',
      required: false,
      description: 'Inline style overrides for the popover panel.',
    },
    // MenuItem props
    {
      name: 'MenuItem.onSelect',
      type: 'function',
      required: true,
      description: 'Fires when the item is selected via click or Enter/Space.',
    },
    {
      name: 'MenuItem.children',
      type: 'ReactNode',
      required: true,
      description: 'Label content. Rendered via the Text atom at the size determined by the parent Menu.',
    },
    {
      name: 'MenuItem.icon',
      type: 'ReactNode',
      required: false,
      description: 'Leading icon rendered before the label.',
    },
    {
      name: 'MenuItem.shortcut',
      type: 'string',
      required: false,
      description: 'Trailing shortcut hint (e.g. "Cmd+D"). Displayed in secondary text.',
    },
    {
      name: 'MenuItem.disabled',
      type: 'boolean',
      required: false,
      default: 'false',
      description: 'Disables selection, grays out the item, and skips it during keyboard navigation.',
    },
    {
      name: 'MenuItem.danger',
      type: 'boolean',
      required: false,
      default: 'false',
      description: 'Renders the item in danger color for destructive actions.',
    },
    {
      name: 'MenuItem.selected',
      type: 'boolean',
      required: false,
      default: 'false',
      description:
        'Marks the item as currently selected. Shows a trailing checkmark in accent color, ' +
        'accent-tinted background via color-mix, and shadow-sm elevation. Visually stronger than hover.',
    },
    {
      name: 'MenuItem.style',
      type: 'object',
      required: false,
      description: 'Inline style overrides for the item.',
    },
    // MenuSeparator props
    {
      name: 'MenuSeparator.style',
      type: 'object',
      required: false,
      description: 'Inline style overrides for the separator line.',
    },
    // MenuGroup props
    {
      name: 'MenuGroup.label',
      type: 'string',
      required: true,
      description: 'Label shown above the group. Rendered one font step smaller than item text.',
    },
    {
      name: 'MenuGroup.children',
      type: 'ReactNode',
      required: true,
      description: 'MenuItem elements within the group.',
    },
    {
      name: 'MenuGroup.style',
      type: 'object',
      required: false,
      description: 'Inline style overrides for the group wrapper.',
    },
  ],

  usageExamples: [
    {
      title: 'Basic menu',
      code: `<Menu trigger={<Button chevron>Actions</Button>}>
  <MenuItem onSelect={() => console.log('edit')}>Edit</MenuItem>
  <MenuItem onSelect={() => console.log('duplicate')}>Duplicate</MenuItem>
  <MenuSeparator />
  <MenuItem onSelect={() => console.log('delete')} danger>Delete</MenuItem>
</Menu>`,
    },
    {
      title: 'With icons and shortcuts',
      code: `<Menu trigger={<Button variant="outline" chevron>Options</Button>}>
  <MenuItem icon={<EditIcon />} shortcut="⌘E" onSelect={edit}>Edit</MenuItem>
  <MenuItem icon={<CopyIcon />} shortcut="⌘D" onSelect={duplicate}>Duplicate</MenuItem>
  <MenuSeparator />
  <MenuItem icon={<TrashIcon />} onSelect={remove} danger>Delete</MenuItem>
</Menu>`,
    },
    {
      title: 'With groups',
      code: `<Menu trigger={<Button chevron>File</Button>} placement="bottom-start">
  <MenuGroup label="Document">
    <MenuItem onSelect={newDoc}>New</MenuItem>
    <MenuItem onSelect={openDoc}>Open</MenuItem>
  </MenuGroup>
  <MenuSeparator />
  <MenuGroup label="Export">
    <MenuItem onSelect={exportPdf}>PDF</MenuItem>
    <MenuItem onSelect={exportCsv}>CSV</MenuItem>
  </MenuGroup>
</Menu>`,
    },
    {
      title: 'Selected items (e.g. sort order)',
      code: `const [sort, setSort] = useState('name');
<Menu trigger={<Button variant="outline" chevron>Sort by</Button>}>
  <MenuItem selected={sort === 'name'} onSelect={() => setSort('name')}>Name</MenuItem>
  <MenuItem selected={sort === 'date'} onSelect={() => setSort('date')}>Date modified</MenuItem>
  <MenuItem selected={sort === 'size'} onSelect={() => setSort('size')}>Size</MenuItem>
</Menu>`,
    },
    {
      title: 'Size variants',
      code: `<Menu size="sm" trigger={<Button size="sm" chevron>Small</Button>}>
  <MenuItem onSelect={() => {}}>Option A</MenuItem>
  <MenuItem onSelect={() => {}}>Option B</MenuItem>
</Menu>

<Menu size="lg" trigger={<Button size="lg" chevron>Large</Button>}>
  <MenuItem onSelect={() => {}}>Option A</MenuItem>
  <MenuItem onSelect={() => {}}>Option B</MenuItem>
</Menu>`,
    },
    {
      title: 'Controlled open state',
      code: `const [open, setOpen] = useState(false);
<Menu trigger={<Button>Menu</Button>} open={open} onOpenChange={setOpen}>
  <MenuItem onSelect={() => {}}>Option A</MenuItem>
  <MenuItem onSelect={() => {}}>Option B</MenuItem>
</Menu>`,
    },
  ],

  compositionGraph: [
    { componentId: 'text', componentName: 'Text', role: 'Item labels and group headers', required: true },
  ],

  accessibility: {
    role: 'menu',
    ariaAttributes: [
      'role="menu" on the popover panel',
      'role="menuitemcheckbox" with aria-checked on each MenuItem',
      'role="separator" on MenuSeparator',
      'role="group" with aria-label on MenuGroup',
      'aria-haspopup="menu" on the trigger wrapper',
      'aria-expanded on the trigger wrapper',
      'aria-controls linking trigger to popover via id',
      'aria-disabled on disabled MenuItems',
    ],
    keyboardInteractions: [
      'Enter/Space on trigger — toggle menu',
      'ArrowDown on trigger — open menu, focus first item',
      'ArrowUp on trigger — open menu, focus last item',
      'ArrowDown — focus next enabled item (wraps)',
      'ArrowUp — focus previous enabled item (wraps)',
      'Enter/Space — select focused item, close menu',
      'Escape — close menu, return focus to trigger',
      'Tab — close menu, let focus move naturally',
      'Home — focus first enabled item',
      'End — focus last enabled item',
    ],
    notes:
      'Focus returns to the trigger element after the menu is dismissed via Escape or selection. ' +
      'Disabled items are skipped during keyboard navigation and have aria-disabled. ' +
      'Selected items use role="menuitemcheckbox" with aria-checked for screen reader announcement. ' +
      'The popover is portaled to document.body but remains semantically linked to the trigger via aria-controls.',
  },
};

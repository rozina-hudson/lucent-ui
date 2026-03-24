import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'nav-menu',
  name: 'NavMenu',
  tier: 'molecule',
  domain: 'neutral',
  specVersion: '0.1',

  description:
    'Multi-level navigation menu supporting vertical (sidebar) and horizontal (top bar) orientations with a sliding highlight pill, CSS-driven hover states, collapsible section groups, and expandable tree items.',

  designIntent:
    // ── Composition pattern (most important for correct usage) ──
    'CRITICAL COMPOSITION PATTERN — There are two different nesting mechanisms that serve different purposes:\n\n' +
    '1. NavMenu.Sub (tree nesting): Place <NavMenu.Sub> as a DIRECT CHILD of <NavMenu.Item> to make that item ' +
    'expandable with nested children. NavMenu.Sub is a bare fragment — it accepts ONLY children, no other props ' +
    '(no label, no icon). The parent Item auto-detects the Sub child and renders itself as a collapsible toggle ' +
    'with expand/collapse behavior. The label, icon, and badge props all go on the parent Item, not on Sub.\n' +
    'Example: <NavMenu.Item icon={<Gear />}>Settings<NavMenu.Sub><NavMenu.Item>General</NavMenu.Item></NavMenu.Sub></NavMenu.Item>\n\n' +
    '2. NavMenu.Group (section grouping): Wraps multiple sibling items under an uppercase section header. ' +
    'Groups are for visual organization — they do NOT create parent-child navigation relationships. ' +
    'A Group with label="Admin" containing Users and Roles items means "these items are in the Admin section", ' +
    'NOT "Admin is a parent page with Users and Roles as sub-pages". Groups have their own independent collapse.\n' +
    'Example: <NavMenu.Group label="Admin"><NavMenu.Item>Users</NavMenu.Item><NavMenu.Item>Roles</NavMenu.Item></NavMenu.Group>\n\n' +
    'WHEN TO USE WHICH:\n' +
    '- Use NavMenu.Sub when an item IS a parent page with child pages (tree hierarchy, e.g. Settings → General, Team, Billing)\n' +
    '- Use NavMenu.Group when items BELONG to a section but are all peers (flat grouping, e.g. "Admin" section containing Users, Roles)\n' +
    '- They can be combined: a Group can contain Items that themselves have Sub children\n\n' +
    // ── Highlight system ──
    'SLIDING HIGHLIGHT: A single pill follows the active item, driven from the root via DOM measurement. ' +
    'The root queries for data-active / data-active-parent attributes and positions an always-in-DOM pill ' +
    'using requestAnimationFrame. MutationObserver + ResizeObserver auto-trigger re-measurement; ' +
    'aria-hidden ancestry detects collapsed items. Three highlight states: ' +
    '(1) child active — full accent pill, ' +
    '(2) collapsed with active child — lighter pill (12% accent tint) on the parent button, ' +
    '(3) self-active parent — full accent pill on the parent itself (isActive on parent, no active children). ' +
    'Hover uses a CSS rule on [data-lucent-navitem] with :not() exclusions, rendering a 5% translucent tint. ' +
    'Inverse mode uses surface background with accent right-border (inset -3px) and elevation shadow. ' +
    'The hasIcons prop controls left-padding alignment globally for items, group headers, and sub-menu children.',

  props: [
    {
      name: 'orientation',
      type: 'enum',
      required: false,
      default: '"vertical"',
      description: 'Layout direction. Vertical for sidebars, horizontal for top navigation bars.',
      enumValues: ['vertical', 'horizontal'],
    },
    {
      name: 'inverse',
      type: 'boolean',
      required: false,
      default: 'false',
      description:
        'Uses surface background with accent right-border and elevation shadow instead of accent fill for the active highlight pill.',
    },
    {
      name: 'size',
      type: 'enum',
      required: false,
      default: '"md"',
      description: 'Size variant controlling font size, padding, gap, and icon width.',
      enumValues: ['sm', 'md', 'lg'],
    },
    {
      name: 'hasIcons',
      type: 'boolean',
      required: false,
      default: 'false',
      description:
        'Whether items use icons. Tightens left padding on items and group headers so text aligns with icon positions. ' +
        'Sub-menu children automatically inherit parent icon awareness via context for consistent text alignment.',
    },
    {
      name: 'aria-label',
      type: 'string',
      required: false,
      default: '"Navigation"',
      description: 'Accessible label for the root <nav> element.',
    },
    {
      name: 'style',
      type: 'object',
      required: false,
      description: 'Inline style overrides for the root <nav> element.',
    },
  ],

  usageExamples: [
    {
      title: 'Expandable parent item with NavMenu.Sub (tree nesting)',
      code: `<NavMenu orientation="vertical">
  <NavMenu.Item href="/dashboard" isActive>Dashboard</NavMenu.Item>
  <NavMenu.Item>
    Settings
    <NavMenu.Sub>
      <NavMenu.Item href="/settings/general">General</NavMenu.Item>
      <NavMenu.Item href="/settings/team">Team</NavMenu.Item>
      <NavMenu.Item href="/settings/billing">Billing</NavMenu.Item>
    </NavMenu.Sub>
  </NavMenu.Item>
  <NavMenu.Item href="/help">Help</NavMenu.Item>
</NavMenu>`,
      description:
        'NavMenu.Sub goes INSIDE a NavMenu.Item to make it expandable. The parent Item ("Settings") becomes a ' +
        'toggle button — clicking it expands/collapses the child items. NavMenu.Sub is a bare fragment that only ' +
        'accepts children. The label "Settings" and any icon/badge props go on the parent Item, never on Sub.',
    },
    {
      title: 'Section grouping with NavMenu.Group (flat organization)',
      code: `<NavMenu orientation="vertical">
  <NavMenu.Group label="Main">
    <NavMenu.Item href="/dashboard" isActive>Dashboard</NavMenu.Item>
    <NavMenu.Item href="/analytics">Analytics</NavMenu.Item>
  </NavMenu.Group>
  <NavMenu.Separator />
  <NavMenu.Group label="Admin" defaultOpen={false}>
    <NavMenu.Item href="/users">Users</NavMenu.Item>
    <NavMenu.Item href="/roles">Roles</NavMenu.Item>
  </NavMenu.Group>
</NavMenu>`,
      description:
        'NavMenu.Group wraps peer items under an uppercase section header. It does NOT create a parent-child ' +
        'navigation relationship — items inside a Group are all at the same level. Groups have their own ' +
        'independent collapse via the label header toggle. Use Group for sections, use Sub for tree nesting.',
    },
    {
      title: 'Combined: Groups containing items with Sub children',
      code: `<NavMenu orientation="vertical" hasIcons>
  <NavMenu.Group label="Workspace">
    <NavMenu.Item icon={<FolderIcon />} href="/projects">Projects</NavMenu.Item>
    <NavMenu.Item icon={<GearIcon />}>
      Settings
      <NavMenu.Sub>
        <NavMenu.Item href="/settings/general" isActive>General</NavMenu.Item>
        <NavMenu.Item href="/settings/team">Team</NavMenu.Item>
      </NavMenu.Sub>
    </NavMenu.Item>
  </NavMenu.Group>
  <NavMenu.Separator />
  <NavMenu.Group label="Admin">
    <NavMenu.Item icon={<UserIcon />} href="/users">Users</NavMenu.Item>
  </NavMenu.Group>
</NavMenu>`,
      description:
        'Groups and Sub can be combined. Here the "Workspace" Group contains a "Settings" Item with Sub children. ' +
        'The Group provides section organization; the Sub provides tree hierarchy within an item.',
    },
    {
      title: 'Self-active parent (section-level page)',
      code: `<NavMenu orientation="vertical" hasIcons>
  <NavMenu.Item isActive icon={<TextIcon />}>
    Text & Labels
    <NavMenu.Sub>
      <NavMenu.Item href="/text">Text</NavMenu.Item>
      <NavMenu.Item href="/badge">Badge</NavMenu.Item>
      <NavMenu.Item href="/chip">Chip</NavMenu.Item>
    </NavMenu.Sub>
  </NavMenu.Item>
  <NavMenu.Item icon={<InputIcon />}>
    Input Fields
    <NavMenu.Sub>
      <NavMenu.Item href="/input" isActive>Input</NavMenu.Item>
      <NavMenu.Item href="/select">Select</NavMenu.Item>
    </NavMenu.Sub>
  </NavMenu.Item>
</NavMenu>`,
      description:
        'Setting isActive on a parent Item (with Sub) while no child has isActive highlights the parent itself ' +
        'with the full accent pill. The sub-nav expands but no child is individually selected — the parent ' +
        'represents "all items in this section". Clicking a specific child moves the highlight to that child.',
    },
    {
      title: 'Inverse mode',
      code: `<NavMenu orientation="vertical" inverse>
  <NavMenu.Group label="Main">
    <NavMenu.Item href="/dashboard" isActive>Dashboard</NavMenu.Item>
    <NavMenu.Item href="/analytics">Analytics</NavMenu.Item>
  </NavMenu.Group>
</NavMenu>`,
      description:
        'Inverse highlight: surface background with accent right-border and elevation shadow. Text stays text-primary.',
    },
    {
      title: 'Horizontal top navigation with dropdown',
      code: `<NavMenu orientation="horizontal">
  <NavMenu.Item href="/dashboard" isActive>Dashboard</NavMenu.Item>
  <NavMenu.Item href="/projects">Projects</NavMenu.Item>
  <NavMenu.Item>
    Settings
    <NavMenu.Sub>
      <NavMenu.Item href="/settings/general">General</NavMenu.Item>
      <NavMenu.Item href="/settings/team">Team</NavMenu.Item>
    </NavMenu.Sub>
  </NavMenu.Item>
</NavMenu>`,
      description:
        'In horizontal orientation, Items with Sub children render as dropdown menus instead of inline expand. ' +
        'The Sub pattern is the same — only the visual rendering changes based on orientation.',
    },
    {
      title: 'Badges, disabled items, and polymorphic rendering',
      code: `<NavMenu orientation="vertical" hasIcons>
  <NavMenu.Item href="/inbox" icon={<InboxIcon />} badge={<Chip size="sm" variant="accent">3</Chip>}>Inbox</NavMenu.Item>
  <NavMenu.Item as={Link} href="/settings" icon={<GearIcon />} isActive>Settings</NavMenu.Item>
  <NavMenu.Item href="/archive" icon={<ArchiveIcon />} disabled>Archived</NavMenu.Item>
</NavMenu>`,
      description:
        'Items support badge (right-aligned content), disabled state, and polymorphic rendering via the "as" prop ' +
        '(e.g. React Router Link). Disabled items use not-allowed cursor and muted text.',
    },
  ],

  compositionGraph: [
    {
      componentId: 'nav-menu-item',
      componentName: 'NavMenu.Item',
      role:
        'Navigation link or expandable parent. When it contains a NavMenu.Sub child, it automatically becomes ' +
        'a collapsible toggle with expand/collapse behavior — the label, icon, and badge go on the Item. ' +
        'Props: children, href, isActive, icon, badge, disabled, onClick, as, style.',
      required: true,
    },
    {
      componentId: 'nav-menu-sub',
      componentName: 'NavMenu.Sub',
      role:
        'Bare fragment placed as a DIRECT CHILD of NavMenu.Item to make that item expandable with nested children. ' +
        'Accepts ONLY children — no label, icon, or other props. The parent Item detects it and switches to ' +
        'parent-toggle rendering. In vertical orientation, children expand inline below the parent; ' +
        'in horizontal orientation, children render as a dropdown. ' +
        'Do NOT confuse with NavMenu.Group — Sub creates tree hierarchy, Group creates flat section organization.',
      required: false,
    },
    {
      componentId: 'nav-menu-group',
      componentName: 'NavMenu.Group',
      role:
        'Section grouping that wraps peer items under an uppercase header label. Does NOT create parent-child ' +
        'navigation relationships — items inside are all at the same level. Has its own independent collapse. ' +
        'Props: children, label, defaultOpen, open, onOpenChange, collapsible, style. ' +
        'Do NOT confuse with NavMenu.Sub — Group is for flat section headers, Sub is for tree nesting inside an Item.',
      required: false,
    },
    {
      componentId: 'nav-menu-separator',
      componentName: 'NavMenu.Separator',
      role: 'Visual divider between sections. Horizontal line in vertical mode, vertical line in horizontal mode.',
      required: false,
    },
  ],

  accessibility: {
    role: 'navigation',
    ariaAttributes: [
      'aria-label on root <nav>',
      'aria-expanded on parent items (Items with Sub children)',
      'aria-current="page" on active leaf items',
      'aria-disabled on disabled items',
      'aria-hidden on collapsed sub-menu content and the highlight pill',
      'role="separator" on dividers',
    ],
    keyboardInteractions: [
      'Enter / Space — toggle parent item expand/collapse',
      'ArrowRight (vertical) / ArrowDown (horizontal) — expand parent item',
      'ArrowLeft (vertical) / ArrowUp (horizontal) — collapse parent item',
      'Escape — close open sub-menu',
    ],
    notes:
      'Parent items (Items containing NavMenu.Sub) use aria-expanded to communicate open/closed state. ' +
      'Active leaf items use aria-current="page". Disabled items use aria-disabled with no click handler. ' +
      'Collapsed sections are marked aria-hidden="true", which the sliding highlight uses to detect ' +
      'visibility — items inside aria-hidden containers are skipped in favor of the parent fallback. ' +
      'Separators use role="separator". The highlight pill is aria-hidden.',
  },
};

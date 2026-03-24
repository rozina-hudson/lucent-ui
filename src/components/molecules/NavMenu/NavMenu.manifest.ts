import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'nav-menu',
  name: 'NavMenu',
  tier: 'molecule',
  domain: 'neutral',
  specVersion: '0.1',

  description:
    'Multi-level navigation menu supporting vertical (sidebar) and horizontal (top bar) orientations with a sliding highlight pill, CSS-driven hover states, collapsible groups, and nested sub-menus.',

  designIntent:
    'NavMenu provides hierarchical navigation for sidebar and top-bar layouts. ' +
    'A single sliding highlight pill follows the active item, driven entirely from the root via DOM measurement — ' +
    'the root queries for data-active / data-active-parent attributes and positions an absolutely-placed pill ' +
    'using requestAnimationFrame. MutationObserver and ResizeObserver auto-trigger re-measurement; ' +
    'aria-hidden ancestry is used to detect collapsed items (not offsetHeight), eliminating all timeout-based coordination. ' +
    'Hover states use a CSS rule on [data-lucent-navitem] with :not() exclusions for active, parent-active, hint, and disabled states, ' +
    'rendering a 5% translucent text-primary tint that never conflicts with the accent pill. ' +
    'In vertical orientation, parent items expand inline with smooth height animation (same pattern as Collapsible) ' +
    'and children are indented by depth level. When a parent with an active child is collapsed, the pill slides ' +
    'to the parent button with a lighter visual style (12% accent tint or surface-secondary in inverse mode) ' +
    'so text remains readable without on-accent color. When re-expanded, the pill slides back to the child. ' +
    'Parent items support "self-active" mode: setting isActive on a parent with no active children ' +
    'highlights the parent with the full accent pill, useful for section-level pages that represent all children. ' +
    'Inverse mode uses surface background with accent right-border (inset -3px) and elevation shadow. ' +
    'The hasIcons prop controls left-padding alignment globally: when true, items use tighter padding (space-2) ' +
    'and group headers align with icon start; sub-menu children inherit parentHasIcon via context so their ' +
    'text aligns with the parent label text regardless of whether they have icons themselves. ' +
    'In horizontal orientation, parent items show dropdown sub-menus on hover/click with enter/exit animation ' +
    'and viewport collision detection. Groups are flattened in horizontal mode. ' +
    'Three sizes (sm/md/lg) scale font, padding, gap, and icon width via a token map. ' +
    'The compound API (NavMenu.Item, NavMenu.Group, NavMenu.Sub, NavMenu.Separator) keeps the tree declarative.',

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
      title: 'Vertical sidebar with icons',
      code: `<NavMenu orientation="vertical" hasIcons>
  <NavMenu.Item icon={<DashIcon />} href="/dashboard" isActive>Dashboard</NavMenu.Item>
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
  <NavMenu.Item icon={<HelpIcon />} href="/help">Help</NavMenu.Item>
</NavMenu>`,
      description:
        'Sidebar with icons, groups, and nested sub-menu. hasIcons tightens padding so group headers align with icons ' +
        'and sub-menu children align with parent text.',
    },
    {
      title: 'Vertical sidebar without icons',
      code: `<NavMenu orientation="vertical">
  <NavMenu.Item href="/dashboard" isActive>Dashboard</NavMenu.Item>
  <NavMenu.Group label="Workspace">
    <NavMenu.Item href="/projects">Projects</NavMenu.Item>
    <NavMenu.Item>
      Settings
      <NavMenu.Sub>
        <NavMenu.Item href="/settings/general">General</NavMenu.Item>
        <NavMenu.Item href="/settings/team">Team</NavMenu.Item>
      </NavMenu.Sub>
    </NavMenu.Item>
  </NavMenu.Group>
</NavMenu>`,
      description:
        'Without hasIcons, items and group headers use standard padding (space-4) for comfortable text-only layout.',
    },
    {
      title: 'Horizontal top navigation',
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
        'Top bar layout. Parent items show dropdown sub-menus on hover/click with viewport collision detection.',
    },
    {
      title: 'Inverse mode with section groups',
      code: `<NavMenu orientation="vertical" inverse>
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
        'Inverse highlight: surface background with accent right-border and elevation shadow. Text stays text-primary.',
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
        'Setting isActive on a parent with no active children gives it the full accent highlight. ' +
        'The sub-nav expands but no child is individually selected — the parent represents all items. ' +
        'Clicking a specific child moves the highlight to that child.',
    },
    {
      title: 'Compact sidebar (sm size)',
      code: `<NavMenu orientation="vertical" size="sm" hasIcons>
  <NavMenu.Item href="/dash" icon={<DashIcon />} isActive>Dashboard</NavMenu.Item>
  <NavMenu.Item href="/projects" icon={<FolderIcon />}>Projects</NavMenu.Item>
  <NavMenu.Item icon={<GearIcon />}>
    Settings
    <NavMenu.Sub>
      <NavMenu.Item href="/settings/general">General</NavMenu.Item>
      <NavMenu.Item href="/settings/team">Team</NavMenu.Item>
    </NavMenu.Sub>
  </NavMenu.Item>
</NavMenu>`,
      description: 'Small size variant for compact sidebar layouts with tighter padding and smaller font.',
    },
    {
      title: 'Badges and disabled items',
      code: `<NavMenu orientation="vertical" hasIcons>
  <NavMenu.Item href="/inbox" icon={<InboxIcon />} badge={<Chip size="sm" variant="accent">3</Chip>}>Inbox</NavMenu.Item>
  <NavMenu.Item href="/settings" icon={<GearIcon />} isActive>Settings</NavMenu.Item>
  <NavMenu.Item href="/archive" icon={<ArchiveIcon />} disabled>Archived</NavMenu.Item>
</NavMenu>`,
      description: 'Items with badge counts and disabled state. Disabled items use not-allowed cursor and muted text.',
    },
    {
      title: 'Polymorphic items with React Router',
      code: `<NavMenu orientation="vertical">
  <NavMenu.Item as={Link} href="/dashboard" isActive>Dashboard</NavMenu.Item>
  <NavMenu.Item as={Link} href="/projects">Projects</NavMenu.Item>
</NavMenu>`,
      description: 'Using the "as" prop to render items as React Router Link components instead of anchor tags.',
    },
  ],

  compositionGraph: [
    {
      componentId: 'nav-menu-item',
      componentName: 'NavMenu.Item',
      role: 'Individual navigation link or parent toggle. Sets data-active when self-active, data-active-parent when collapsed with an active child. Uses data-lucent-navitem for CSS hover targeting.',
      required: true,
    },
    {
      componentId: 'nav-menu-sub',
      componentName: 'NavMenu.Sub',
      role: 'Marker wrapper for nested sub-menu children inside a parent NavMenu.Item.',
      required: false,
    },
    {
      componentId: 'nav-menu-group',
      componentName: 'NavMenu.Group',
      role: 'Section grouping with optional uppercase label header and independent collapse. Header left padding responds to hasIcons context.',
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
      'aria-expanded on parent items with sub-menus',
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
      'Parent items use aria-expanded to communicate open/closed state. ' +
      'Active leaf items use aria-current="page". Disabled items use aria-disabled with no click handler. ' +
      'Collapsed sections are marked aria-hidden="true", which the sliding highlight uses to detect ' +
      'visibility — items inside aria-hidden containers are skipped in favor of the parent fallback. ' +
      'Separators use role="separator". The highlight pill is aria-hidden.',
  },
};

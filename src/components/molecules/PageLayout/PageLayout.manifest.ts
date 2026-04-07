import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'page-layout',
  name: 'PageLayout',
  tier: 'molecule',
  domain: 'neutral',
  specVersion: '0.1',

  description:
    'Full-viewport shell layout with optional header, left sidebar (with header/footer slots), right panel, and footer slots arranged in a flex column/row structure.',

  designIntent:
    'PageLayout owns the outermost chrome of an application page. Chrome regions (header, sidebar, footer) ' +
    'default to the navigation token so the main content card feels elevated against the chrome — especially ' +
    'noticeable with tinted navigation values. The body row is a flex row containing ' +
    'an optional left sidebar, a bordered main content card, and an optional right panel — all as structural ' +
    'siblings so they share the same vertical space. The header and footer sit outside the body row as ' +
    'flex children of the outer column, ensuring they span the full width. ' +
    'The left sidebar is a flex column with three zones: sidebarHeader (pinned top — logo/branding), ' +
    'sidebar (scrollable middle — navigation), and sidebarFooter (pinned bottom — account/help/settings). ' +
    'All three zones are optional and render independently. ' +
    'sidebarCollapsedWidth controls the collapsed width (default 0 for full collapse, set to e.g. 56 for icon-only rail). ' +
    'On narrow viewports (below sidebarDrawerBreakpoint, default 768px), sidebarMode "auto" automatically ' +
    'switches the sidebar to a slide-in drawer overlay with a hamburger toggle in the header, ' +
    'keeping the main content full-width. The drawer renders via portal with backdrop, ' +
    'closes on backdrop click or Escape, and locks body scroll while open. ' +
    'The main card automatically drops its right margin when a right panel is present so no manual mainStyle override is needed. ' +
    'The footer is intentionally narrow (default 28px) and should be used sparingly — suited to ' +
    'status bars, connection indicators, keyboard shortcut hints, or contextual action strips, ' +
    'in the style of an editor status bar. It is not meant as a general-purpose page footer.',

  props: [
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      description: 'Content rendered inside the main content card.',
    },
    {
      name: 'header',
      type: 'ReactNode',
      required: false,
      description: 'Content rendered in the full-width header bar above the body row.',
    },
    {
      name: 'headerHeight',
      type: 'string',
      required: false,
      default: '48',
      description: 'Header height in px (number) or any CSS value (string). Default: 48.',
    },
    {
      name: 'sidebar',
      type: 'ReactNode',
      required: false,
      description: 'Scrollable content in the middle zone of the left sidebar (typically navigation).',
    },
    {
      name: 'sidebarHeader',
      type: 'ReactNode',
      required: false,
      description: 'Pinned content at the top of the sidebar — logo, app name, branding. Does not scroll.',
    },
    {
      name: 'sidebarFooter',
      type: 'ReactNode',
      required: false,
      description: 'Pinned content at the bottom of the sidebar — account switcher, help, secondary actions. Does not scroll.',
    },
    {
      name: 'sidebarWidth',
      type: 'string',
      required: false,
      default: '240',
      description: 'Left sidebar width in px (number) or any CSS value (string). Default: 240.',
    },
    {
      name: 'sidebarCollapsedWidth',
      type: 'string',
      required: false,
      default: '0',
      description: 'Width the sidebar collapses to — 0 for full collapse (default), 56 for icon-only rail.',
    },
    {
      name: 'sidebarCollapsed',
      type: 'boolean',
      required: false,
      default: 'false',
      description: 'When true, collapses the left sidebar to sidebarCollapsedWidth with a transition.',
    },
    {
      name: 'sidebarMode',
      type: 'string',
      required: false,
      default: '"auto"',
      description:
        'Sidebar display mode. "inline" = always inline, "drawer" = always drawer overlay, ' +
        '"auto" = switches to drawer below sidebarDrawerBreakpoint. Default: "auto".',
    },
    {
      name: 'sidebarDrawerBreakpoint',
      type: 'number',
      required: false,
      default: '768',
      description: 'Viewport width (px) below which sidebar switches to drawer mode. Only used when sidebarMode="auto". Default: 768.',
    },
    {
      name: 'sidebarDrawerOpen',
      type: 'boolean',
      required: false,
      default: 'false',
      description: 'Controlled open state when sidebar is in drawer mode.',
    },
    {
      name: 'onSidebarDrawerOpenChange',
      type: '(open: boolean) => void',
      required: false,
      description: 'Called when the drawer open state changes (backdrop click, escape key).',
    },
    {
      name: 'rightSidebar',
      type: 'ReactNode',
      required: false,
      description: 'Content rendered in the right panel, a flex sibling of <main> after it.',
    },
    {
      name: 'rightSidebarWidth',
      type: 'string',
      required: false,
      default: '240',
      description: 'Right panel width in px (number) or any CSS value (string). Default: 240.',
    },
    {
      name: 'rightSidebarCollapsed',
      type: 'boolean',
      required: false,
      default: 'false',
      description: 'When true, collapses the right panel to zero width with a transition.',
    },
    {
      name: 'footer',
      type: 'ReactNode',
      required: false,
      description: 'Content rendered in the full-width footer bar below the body row.',
    },
    {
      name: 'footerHeight',
      type: 'string',
      required: false,
      default: '28',
      description: 'Footer height in px (number) or any CSS value (string). Default: 28 — sized for a compact status bar.',
    },
    {
      name: 'chromeBackground',
      type: 'string',
      required: false,
      default: '"navigation"',
      description:
        'Background token for chrome regions (header, sidebar, footer). ' +
        '"navigation" uses the dedicated chrome token (default); ' +
        '"bgBase" uses the content area background; ' +
        '"bgSubtle" uses a subtle shade of bgBase for chrome distinction; ' +
        '"surface" matches the component surface color; ' +
        '"surfaceSecondary" uses the tinted fill token for a more visible chrome/stage separation.',
    },
    {
      name: 'mainStyle',
      type: 'object',
      required: false,
      description: 'Inline style overrides for the main content card (border, borderRadius, boxShadow, etc.).',
    },
    {
      name: 'style',
      type: 'object',
      required: false,
      description: 'Inline style overrides for the outermost layout wrapper.',
    },
  ],

  usageExamples: [
    {
      title: 'Header and left sidebar',
      code: `<PageLayout
  header={<div>My App</div>}
  sidebar={<nav>...</nav>}
  sidebarWidth={200}
>
  <div>Page content</div>
</PageLayout>`,
    },
    {
      title: 'With right panel',
      code: `<PageLayout
  header={<div>My App</div>}
  sidebar={<nav>...</nav>}
  rightSidebar={<aside>Details panel</aside>}
  rightSidebarWidth={280}
>
  <div>Page content</div>
</PageLayout>`,
    },
    {
      title: 'Collapsible sidebar with logo and account footer',
      code: `<PageLayout
  sidebarHeader={<Logo collapsed={isCollapsed} />}
  sidebar={<NavMenu orientation="vertical" hasIcons>...</NavMenu>}
  sidebarFooter={<AccountMenu collapsed={isCollapsed} />}
  sidebarCollapsed={isCollapsed}
  sidebarCollapsedWidth={56}
>
  <div>Page content</div>
</PageLayout>`,
    },
    {
      title: 'With status bar footer',
      code: `<PageLayout
  header={<div>My App</div>}
  sidebar={<nav>...</nav>}
  footer={
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%', padding: '0 8px' }}>
      <Text size="xs" color="secondary">main</Text>
      <Text size="xs" color="info">Ready</Text>
    </div>
  }
>
  <div>Page content</div>
</PageLayout>`,
    },
  ],

  compositionGraph: [
    { componentId: 'text', componentName: 'Text', role: 'Header/footer/sidebar labels', required: false },
    { componentId: 'nav-link', componentName: 'NavLink', role: 'Sidebar navigation items', required: false },
  ],

  accessibility: {
    notes:
      'The left sidebar renders as a <div>; wrap its contents in a <nav> with aria-label for landmark semantics. ' +
      'The right panel renders as <aside> which is a complementary landmark — provide an aria-label if multiple ' +
      'aside elements are present on the page. The main content renders as <main>, which is a main landmark ' +
      'and should appear only once per page.',
  },
};

import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'nav-link',
  name: 'NavLink',
  tier: 'atom',
  domain: 'neutral',
  specVersion: '0.1',

  description:
    'Polymorphic navigation link atom that renders an active, hover, and disabled state using accent background and token colours.',

  designIntent:
    'NavLink is the single primitive for all sidebar and top-nav items. ' +
    'The active state uses the accent background with on-accent text so it stands out clearly ' +
    'regardless of theme. Hover applies a subtle muted background only on inactive items. ' +
    'The disabled state drains colour without changing layout. ' +
    'Polymorphism via the `as` prop lets consumers pass a router Link (react-router, Next.js, etc.) ' +
    'without losing the visual contract — the component owns style, the consumer owns routing.',

  props: [
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      description: 'Label content of the nav item.',
    },
    {
      name: 'href',
      type: 'string',
      required: false,
      description: 'Destination URL passed to the underlying element. Omitted when disabled.',
    },
    {
      name: 'isActive',
      type: 'boolean',
      required: false,
      default: 'false',
      description: 'When true, renders the accent background and sets aria-current="page".',
    },
    {
      name: 'icon',
      type: 'ReactNode',
      required: false,
      description: 'Optional leading icon rendered before the label.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      default: 'false',
      description: 'Disables interaction and renders muted text. Removes href and onClick.',
    },
    {
      name: 'onClick',
      type: 'function',
      required: false,
      description: 'Click handler. Omitted when disabled.',
    },
    {
      name: 'as',
      type: 'React.ElementType',
      required: false,
      default: '"a"',
      description: 'Root element type. Pass a router Link component for SPA navigation.',
    },
    {
      name: 'style',
      type: 'object',
      required: false,
      description: 'Inline style overrides merged onto the root element.',
    },
  ],

  usageExamples: [
    {
      title: 'Basic link',
      code: `<NavLink href="/dashboard">Dashboard</NavLink>`,
    },
    {
      title: 'Active state with icon',
      code: `<NavLink href="/settings" isActive icon={<Icon name="settings" size={16} />}>
  Settings
</NavLink>`,
    },
    {
      title: 'With react-router Link',
      code: `import { Link } from 'react-router-dom';

<NavLink as={Link} to="/profile">Profile</NavLink>`,
    },
    {
      title: 'Disabled',
      code: `<NavLink href="/admin" disabled>Admin</NavLink>`,
    },
  ],

  compositionGraph: [],

  accessibility: {
    ariaAttributes: ['aria-current="page"', 'aria-disabled'],
    notes:
      'Sets aria-current="page" on the active item. When disabled, aria-disabled is set and ' +
      'href/onClick are removed so the element is not interactive. Wrap a list of NavLinks in ' +
      'a <nav> element with an aria-label for landmark semantics.',
  },
};

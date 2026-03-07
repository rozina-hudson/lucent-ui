import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'breadcrumb',
  name: 'Breadcrumb',
  tier: 'molecule',
  domain: 'neutral',
  specVersion: '0.1',

  description:
    'Horizontal breadcrumb trail that renders an ordered list of navigable items with a configurable separator.',

  designIntent:
    'Breadcrumb communicates the user\'s location within a hierarchy. ' +
    'All intermediate items are secondary-coloured and interactive (link or button), brightening to primary on hover. ' +
    'The last item is always the current page: rendered as static primary text with aria-current="page", never a link. ' +
    'The separator is aria-hidden so screen readers announce only the labels. ' +
    'Items accept any ReactNode label so icons or badges can be embedded when needed.',

  props: [
    {
      name: 'items',
      type: 'array',
      required: true,
      description:
        'Ordered array of BreadcrumbItem objects: { label: ReactNode; href?: string; onClick?: () => void }. ' +
        'The last item is always the current page and is rendered as static text.',
    },
    {
      name: 'separator',
      type: 'ReactNode',
      required: false,
      default: '"/"',
      description: 'Visual separator rendered between items. Defaults to "/".',
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
      title: 'Basic breadcrumb',
      code: `<Breadcrumb
  items={[
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects' },
    { label: 'My Project' },
  ]}
/>`,
    },
    {
      title: 'Custom separator',
      code: `<Breadcrumb
  items={[
    { label: 'Home', href: '/' },
    { label: 'Settings' },
  ]}
  separator="›"
/>`,
    },
    {
      title: 'Button-based items (SPA navigation)',
      code: `<Breadcrumb
  items={[
    { label: 'Home', onClick: () => navigate('/') },
    { label: 'Reports', onClick: () => navigate('/reports') },
    { label: 'Q1 Summary' },
  ]}
/>`,
    },
  ],

  compositionGraph: [
    { componentId: 'text', componentName: 'Text', role: 'Current page (last) item label', required: true },
  ],

  accessibility: {
    role: 'navigation',
    ariaAttributes: ['aria-label="Breadcrumb"', 'aria-current="page"'],
    notes:
      'Rendered as a <nav aria-label="Breadcrumb"> containing an <ol>. ' +
      'The last item receives aria-current="page". Separators are aria-hidden.',
  },
};

import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'page-header',
  name: 'PageHeader',
  tier: 'molecule',
  domain: 'neutral',
  specVersion: '0.1',

  description:
    'A page-level header pairing breadcrumbs, a large display title, optional subtitle, and up to one primary CTA with 0–3 secondary outline actions.',

  designIntent:
    'PageHeader is the canonical chrome for a page body. It encapsulates the action-bar pattern — ' +
    'breadcrumbs on top, a 3xl display title with optional subtitle below, action buttons anchored ' +
    'to the title baseline, and a divider separating the header from page content. ' +
    'The component owns three zones: breadcrumbs (nav context), title block, and action slot. ' +
    '\n\n' +
    '## Multi-action support\n' +
    'The `action` prop holds the single primary CTA (rightmost position, `variant="primary"` by ' +
    'default). The `secondaryActions` prop accepts 0–3 additional actions that render to the left ' +
    'of the primary action with `variant="outline"` by default, keeping them visually subordinate. ' +
    'This covers the common detail-page need for Edit / Archive / primary-CTA triples without ' +
    'forcing consumers to rebuild the header from primitives. Beyond 3 secondary actions, reach for ' +
    'SplitButton or an overflow menu instead of widening the row.\n\n' +
    '## Responsive behaviour\n' +
    'Both the outer title/action Row and the inner action Row set `wrap` so the button group flows ' +
    'below the title on narrow viewports instead of overflowing. `align="end"` anchors the buttons ' +
    'to the baseline of the subtitle line when the layout is horizontal.\n\n' +
    '## Styling\n' +
    'All spacing, typography, and colors come from Lucent tokens — no custom values. The title uses ' +
    'the display font family and 3xl size; the subtitle uses the base font at sm/secondary. The ' +
    'bottom divider can be hidden via `hideDivider` when the header sits directly above another ' +
    'bordered surface.',

  props: [
    {
      name: 'title',
      type: 'string',
      required: true,
      description: 'Page title rendered as an h1 in the display font at 3xl size.',
    },
    {
      name: 'subtitle',
      type: 'ReactNode',
      required: false,
      description: 'Optional subtitle or metadata line rendered below the title at sm/secondary.',
    },
    {
      name: 'breadcrumbs',
      type: 'array',
      required: false,
      description:
        'Breadcrumb items rendered above the title via the Breadcrumb molecule. Provides navigation context.',
    },
    {
      name: 'action',
      type: 'object',
      required: false,
      description:
        'Single primary CTA rendered rightmost. Shape: { label, onClick?, variant?, leftIcon?, rightIcon?, disabled?, loading? }. ' +
        'Defaults to variant="primary". Pass `null` to explicitly omit when spreading dynamic props.',
    },
    {
      name: 'secondaryActions',
      type: 'array',
      required: false,
      description:
        '0–3 secondary actions rendered to the left of `action`. Each item uses the same PageHeaderAction shape as `action`. ' +
        'Defaults to variant="outline" so they stay visually subordinate. For more than 3 actions, use a SplitButton or overflow menu.',
    },
    {
      name: 'hideDivider',
      type: 'boolean',
      required: false,
      default: 'false',
      description: 'Hide the bottom divider. Use when the header sits directly above another bordered surface.',
    },
    {
      name: 'style',
      type: 'object',
      required: false,
      description: 'Inline style overrides for the outer Stack wrapper.',
    },
  ],

  usageExamples: [
    {
      title: 'Minimal — title only',
      code: `<PageHeader title="Settings" />`,
    },
    {
      title: 'With subtitle and single primary action',
      code: `<PageHeader
  title="Acme Corp"
  subtitle="Last updated 5 minutes ago"
  action={{ label: 'New report', onClick: () => createReport() }}
/>`,
    },
    {
      title: 'Detail view with secondary actions (Edit / Archive / Submit)',
      code: `<PageHeader
  title="Sana Khan"
  subtitle="Senior Product Designer · Added 3 days ago"
  breadcrumbs={[
    { label: 'Home', href: '#' },
    { label: 'Candidates', href: '#' },
    { label: 'Sana Khan' },
  ]}
  secondaryActions={[
    { label: 'Edit', onClick: () => openEdit() },
    { label: 'Archive', onClick: () => archive() },
  ]}
  action={{ label: 'Submit to opportunity', onClick: () => submit() }}
/>`,
    },
    {
      title: 'Danger zone',
      code: `<PageHeader
  title="Danger zone"
  subtitle="These actions are irreversible."
  breadcrumbs={[
    { label: 'Home', href: '#' },
    { label: 'Settings', href: '#' },
    { label: 'Danger zone' },
  ]}
  action={{ label: 'Delete project', variant: 'danger', onClick: () => confirmDelete() }}
/>`,
    },
    {
      title: 'No primary CTA, secondary actions only',
      code: `<PageHeader
  title="Reports"
  secondaryActions={[
    { label: 'Export', onClick: () => exportAll() },
    { label: 'Filter', onClick: () => openFilter() },
  ]}
/>`,
    },
  ],

  compositionGraph: [
    { componentId: 'breadcrumb', componentName: 'Breadcrumb', role: 'Navigation context above the title', required: false },
    { componentId: 'stack', componentName: 'Stack', role: 'Vertical layout for title and subtitle', required: true },
    { componentId: 'row', componentName: 'Row', role: 'Horizontal layout for title block and action slot', required: true },
    { componentId: 'text', componentName: 'Text', role: 'Title and subtitle rendering', required: true },
    { componentId: 'button', componentName: 'Button', role: 'Primary and secondary action buttons', required: false },
    { componentId: 'divider', componentName: 'Divider', role: 'Separator between header chrome and page content', required: false },
  ],

  accessibility: {
    notes:
      'The title renders as an <h1>, providing the page heading landmark for assistive tech. ' +
      'Breadcrumbs render inside <nav aria-label="Breadcrumb">. Action buttons inherit Button\'s ' +
      'focus ring, keyboard activation, and aria-label forwarding — pass aria-label on each action ' +
      'object when the label alone is insufficient (e.g. icon-only buttons).',
  },
};

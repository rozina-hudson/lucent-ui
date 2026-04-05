import type { CompositionPattern } from '../types.js';

export const PATTERN: CompositionPattern = {
  id: 'action-bar',
  name: 'Action Bar',
  description: 'Page-level or card-level header pairing a title with action buttons. Page headers use breadcrumb, large display title, and a divider below; card headers are compact with small text. Supports multi-action headers with secondary outline buttons preceding the primary CTA.',
  category: 'action',
  components: ['text', 'button', 'row', 'stack', 'breadcrumb', 'divider', 'card'],

  structure: `
Page header:
Stack gap="4"
├── Breadcrumb                               ← navigation context
├── Row justify="between" align="end" wrap
│   ├── Stack gap="1"
│   │   ├── Text (h1, 3xl, bold, display)    ← page title
│   │   └── Text (sm, secondary)             ← subtitle
│   └── Row gap="2" wrap                     ← actions (wraps below title on narrow screens)
│       ├── Button[] (outline, sm)           ← secondary actions (0–3, leftmost)
│       └── Button (primary, sm)             ← primary CTA (rightmost, always single)
└── Divider

Card header:
Row justify="between" align="start"
├── Stack gap="1"
│   ├── Text (xs, secondary, uppercase, tight) ← category label
│   └── Text (md, semibold, tight)            ← section title
└── Row gap="1"                              ← compact actions (top-aligned)
    └── Button[] (ghost, xs)
  `.trim(),

  code: `<Stack gap="4">
  <Breadcrumb items={[
    { label: 'Home', href: '#' },
    { label: 'Projects', href: '#' },
    { label: 'Acme Corp' },
  ]} />
  <Row justify="between" align="end">
    <Stack gap="1">
      <Text as="h1" size="3xl" weight="bold" family="display">Acme Corp</Text>
      <Text size="sm" color="secondary">Last updated 5 minutes ago</Text>
    </Stack>
    <Row gap="2">
      <Button variant="outline" size="sm">Export</Button>
      <Button variant="primary" size="sm">New report</Button>
    </Row>
  </Row>
  <Divider />
</Stack>`,

  variants: [
    {
      title: 'Page header — detail view with secondary actions',
      code: `<Stack gap="4">
  <Breadcrumb items={[
    { label: 'Home', href: '#' },
    { label: 'Candidates', href: '#' },
    { label: 'Sana Khan' },
  ]} />
  <Row justify="between" align="end" wrap gap="3">
    <Stack gap="1">
      <Text as="h1" size="3xl" weight="bold" family="display">Sana Khan</Text>
      <Text size="sm" color="secondary">Senior Product Designer · Added 3 days ago</Text>
    </Stack>
    <Row gap="2" wrap>
      <Button variant="outline" size="sm">Edit</Button>
      <Button variant="outline" size="sm">Archive</Button>
      <Button variant="primary" size="sm">Submit to opportunity</Button>
    </Row>
  </Row>
  <Divider />
</Stack>`,
    },
    {
      title: 'Page header — danger zone',
      code: `<Stack gap="4">
  <Breadcrumb items={[
    { label: 'Home', href: '#' },
    { label: 'Settings', href: '#' },
    { label: 'Danger zone' },
  ]} />
  <Row justify="between" align="end">
    <Stack gap="1">
      <Text as="h1" size="3xl" weight="bold" family="display">Danger zone</Text>
      <Text size="sm" color="secondary">These actions are irreversible.</Text>
    </Stack>
    <Button variant="danger" size="sm">Delete project</Button>
  </Row>
  <Divider />
</Stack>`,
    },
    {
      title: 'Card header (compact with label)',
      code: `<Card variant="outline" padding="md" style={{ width: 400 }}>
  <Stack gap="4">
    <Row justify="between" align="start">
      <Stack gap="1">
        <Text size="xs" color="secondary" weight="medium" style={{ letterSpacing: 'var(--lucent-letter-spacing-tight)', textTransform: 'uppercase' }}>Activity</Text>
        <Text size="md" weight="semibold" style={{ letterSpacing: 'var(--lucent-letter-spacing-base)' }}>Recent activity</Text>
      </Stack>
      <Row gap="1">
        <Button variant="ghost" size="xs">Filter</Button>
        <Button variant="ghost" size="xs">Export</Button>
      </Row>
    </Row>
    <Text size="xs" color="secondary">No activity to show yet.</Text>
  </Stack>
</Card>`,
    },
  ],

  designNotes:
    'Page headers and card headers have very different scales. Page headers use 3xl ' +
    'display font for the title, Breadcrumb for navigation context, and a Divider to ' +
    'separate the header from page content below. align="end" on the Row anchors the ' +
    'buttons to the baseline of the title block so they sit level with the subtitle. ' +
    'Card headers are compact: sm semibold text with xs/ghost buttons that recede ' +
    'visually. The primary action is always rightmost following natural reading order. ' +
    'Both patterns use justify="between" to push title and actions to opposite edges. ' +
    'Multi-action page headers (e.g. detail views with Edit / Archive / Submit) follow ' +
    'the three-zone CTA rule: 0–3 secondary actions render as variant="outline" to the ' +
    'left of a single primary button, keeping them visually subordinate. Beyond 3 ' +
    'secondary actions, reach for SplitButton or an overflow menu instead of widening ' +
    'the row. Both the outer title/action Row and the inner action Row set wrap so the ' +
    'buttons flow below the title on narrow viewports instead of overflowing.',
};

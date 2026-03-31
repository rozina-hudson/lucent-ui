import type { CompositionPattern } from '../types.js';

export const PATTERN: CompositionPattern = {
  id: 'dashboard-header',
  name: 'Dashboard Header',
  description: 'Full dashboard header combining breadcrumb navigation, page title with action buttons, and a row of KPI stat cards with trend indicators.',
  category: 'dashboard',
  components: ['text', 'button', 'chip', 'card', 'stack', 'row', 'breadcrumb', 'divider'],

  structure: `
Stack gap="5"
├── Stack gap="4"                             ← action bar
│   ├── Breadcrumb                            ← navigation context
│   ├── Row justify="between" align="end"
│   │   ├── Stack gap="1"
│   │   │   ├── Text (h1, 3xl, bold, display) ← page title
│   │   │   └── Text (sm, secondary)          ← subtitle
│   │   └── Row gap="2"
│   │       ├── Button (outline, sm, leftIcon) ← Export
│   │       └── Button (primary, sm, leftIcon) ← New report
│   └── Divider
└── Row gap="3" wrap                          ← stats row
    └── Card[] (outline, padding="md", flex=1)
        └── Stack gap="3"
            ├── Text (xs, secondary, medium)   ← metric label
            ├── Text (2xl, bold, display)      ← value
            └── Row gap="2" align="center"
                ├── Chip (success/danger, sm, borderless) ← trend
                └── Text (xs, secondary)       ← comparison
  `.trim(),

  code: `<Stack gap="5" style={{ maxWidth: 860 }}>
  <Stack gap="4">
    <Breadcrumb items={[
      { label: 'Home', href: '#' },
      { label: 'Analytics', href: '#' },
      { label: 'Overview' },
    ]} />
    <Row justify="between" align="end">
      <Stack gap="1">
        <Text as="h1" size="3xl" weight="bold" family="display">Analytics Overview</Text>
        <Text size="sm" color="secondary">Last updated 5 minutes ago</Text>
      </Stack>
      <Row gap="2">
        <Button variant="outline" size="sm" leftIcon={<DownloadIcon />}>Export</Button>
        <Button variant="primary" size="sm" leftIcon={<PlusIcon />}>New report</Button>
      </Row>
    </Row>
    <Divider />
  </Stack>
  <Row gap="3" wrap>
    <Card variant="outline" padding="md" style={{ flex: 1, minWidth: 180 }}>
      <Stack gap="3">
        <Text size="xs" color="secondary" weight="medium">Total Visitors</Text>
        <Text size="2xl" weight="bold" family="display">24.8k</Text>
        <Row gap="2" align="center">
          <Chip variant="success" size="sm" borderless>+18%</Chip>
          <Text size="xs" color="secondary">20.9k last month</Text>
        </Row>
      </Stack>
    </Card>
    <Card variant="outline" padding="md" style={{ flex: 1, minWidth: 180 }}>
      <Stack gap="3">
        <Text size="xs" color="secondary" weight="medium">Conversion Rate</Text>
        <Text size="2xl" weight="bold" family="display">3.24%</Text>
        <Row gap="2" align="center">
          <Chip variant="success" size="sm" borderless>+0.4%</Chip>
          <Text size="xs" color="secondary">2.84% last month</Text>
        </Row>
      </Stack>
    </Card>
    <Card variant="outline" padding="md" style={{ flex: 1, minWidth: 180 }}>
      <Stack gap="3">
        <Text size="xs" color="secondary" weight="medium">Avg. Session</Text>
        <Text size="2xl" weight="bold" family="display">4m 32s</Text>
        <Row gap="2" align="center">
          <Chip variant="danger" size="sm" borderless>-12%</Chip>
          <Text size="xs" color="secondary">5m 08s last month</Text>
        </Row>
      </Stack>
    </Card>
    <Card variant="outline" padding="md" style={{ flex: 1, minWidth: 180 }}>
      <Stack gap="3">
        <Text size="xs" color="secondary" weight="medium">Revenue</Text>
        <Text size="2xl" weight="bold" family="display">$48.2k</Text>
        <Row gap="2" align="center">
          <Chip variant="success" size="sm" borderless>+24%</Chip>
          <Text size="xs" color="secondary">$38.9k last month</Text>
        </Row>
      </Stack>
    </Card>
  </Row>
</Stack>`,

  designNotes:
    'This composition combines two common dashboard patterns: the ActionBar and StatsRow. ' +
    'The breadcrumb provides navigation context above the title. align="end" on the ' +
    'title row anchors the action buttons to the baseline of the subtitle. Button ' +
    'leftIcon props add visual affordance to Export (download icon) and New report ' +
    '(plus icon). The Divider separates the header chrome from the metric content below. ' +
    'Stat cards use flex: 1 with minWidth: 180 for responsive equal sizing. Display font ' +
    'on metric values creates instant visual hierarchy. Trend chips use success/danger ' +
    'variants with borderless styling so they read as inline metadata, not interactive tags.',
};

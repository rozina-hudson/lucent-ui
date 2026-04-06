import type { CompositionPattern } from '../types.js';

export const PATTERN: CompositionPattern = {
  id: 'metrics-dashboard',
  name: 'Metrics Dashboard',
  description:
    'KPI cards with progress indicators and tabbed time-range switching (7d / 30d / 90d). Each card shows a metric label, large value, trend chip, and progress bar.',
  category: 'dashboard',
  components: ['card', 'text', 'progress', 'tabs', 'chip', 'stack', 'row'],

  structure: `
Stack gap="5"
├── Row gap="3" align="center" justify="between"
│   ├── Text (xl, bold)                        ← section title
│   └── Tabs (pills, sm)                       ← time range selector (7d / 30d / 90d)
└── Row gap="4" wrap
    └── Card[] (elevated, padding lg, flex 1)
        └── Stack gap="3"
            ├── Text (xs, secondary, medium)    ← metric label
            ├── Row gap="2" align="baseline"
            │   ├── Text (2xl, bold, display)   ← value
            │   └── Chip (success/danger, sm)   ← trend delta
            └── Progress (sm)                   ← completion bar
  `.trim(),

  code: `<Stack gap="5">
  <Row gap="3" align="center" justify="between">
    <Text size="xl" weight="bold">Overview</Text>
    <Tabs
      variant="pills"
      tabs={[
        { value: '7d', label: '7d' },
        { value: '30d', label: '30d' },
        { value: '90d', label: '90d' },
      ]}
      defaultValue="30d"
      style={{ fontSize: 'var(--lucent-font-size-sm)' }}
    />
  </Row>
  <Row gap="4" wrap>
    <Card variant="elevated" padding="lg" style={{ flex: 1, minWidth: 220 }}>
      <Stack gap="3">
        <Text size="xs" color="secondary" weight="medium">Revenue</Text>
        <Row gap="2" align="baseline">
          <Text size="2xl" weight="bold" family="display">$48.2k</Text>
          <Chip variant="success" size="sm" borderless>+12.5%</Chip>
        </Row>
        <Progress value={72} size="sm" />
      </Stack>
    </Card>
    <Card variant="elevated" padding="lg" style={{ flex: 1, minWidth: 220 }}>
      <Stack gap="3">
        <Text size="xs" color="secondary" weight="medium">Active Users</Text>
        <Row gap="2" align="baseline">
          <Text size="2xl" weight="bold" family="display">2,847</Text>
          <Chip variant="success" size="sm" borderless>+8.1%</Chip>
        </Row>
        <Progress value={64} size="sm" />
      </Stack>
    </Card>
    <Card variant="elevated" padding="lg" style={{ flex: 1, minWidth: 220 }}>
      <Stack gap="3">
        <Text size="xs" color="secondary" weight="medium">Churn Rate</Text>
        <Row gap="2" align="baseline">
          <Text size="2xl" weight="bold" family="display">3.2%</Text>
          <Chip variant="danger" size="sm" borderless>+0.8%</Chip>
        </Row>
        <Progress value={32} size="sm" variant="danger" />
      </Stack>
    </Card>
    <Card variant="elevated" padding="lg" style={{ flex: 1, minWidth: 220 }}>
      <Stack gap="3">
        <Text size="xs" color="secondary" weight="medium">Avg. Response</Text>
        <Row gap="2" align="baseline">
          <Text size="2xl" weight="bold" family="display">1.4s</Text>
          <Chip variant="success" size="sm" borderless>-18%</Chip>
        </Row>
        <Progress value={86} size="sm" variant="success" />
      </Stack>
    </Card>
  </Row>
</Stack>`,

  variants: [
    {
      title: 'Outline cards with threshold-based progress',
      code: `<Stack gap="5">
  <Row gap="3" align="center" justify="between">
    <Text size="xl" weight="bold">System Health</Text>
    <Tabs
      variant="pills"
      tabs={[
        { value: '1h', label: '1h' },
        { value: '24h', label: '24h' },
        { value: '7d', label: '7d' },
      ]}
      defaultValue="24h"
      style={{ fontSize: 'var(--lucent-font-size-sm)' }}
    />
  </Row>
  <Row gap="4" wrap>
    <Card variant="outline" padding="lg" style={{ flex: 1, minWidth: 220 }}>
      <Stack gap="3">
        <Text size="xs" color="secondary" weight="medium">CPU Usage</Text>
        <Row gap="2" align="baseline">
          <Text size="2xl" weight="bold" family="display">67%</Text>
          <Chip variant="warning" size="sm" borderless>+12%</Chip>
        </Row>
        <Progress value={67} size="sm" warnAt={60} dangerAt={85} />
      </Stack>
    </Card>
    <Card variant="outline" padding="lg" style={{ flex: 1, minWidth: 220 }}>
      <Stack gap="3">
        <Text size="xs" color="secondary" weight="medium">Memory</Text>
        <Row gap="2" align="baseline">
          <Text size="2xl" weight="bold" family="display">4.2 GB</Text>
          <Chip variant="success" size="sm" borderless>-3%</Chip>
        </Row>
        <Progress value={52} size="sm" warnAt={70} dangerAt={90} />
      </Stack>
    </Card>
    <Card variant="outline" padding="lg" style={{ flex: 1, minWidth: 220 }}>
      <Stack gap="3">
        <Text size="xs" color="secondary" weight="medium">Disk I/O</Text>
        <Row gap="2" align="baseline">
          <Text size="2xl" weight="bold" family="display">340 MB/s</Text>
          <Chip variant="danger" size="sm" borderless>+45%</Chip>
        </Row>
        <Progress value={91} size="sm" warnAt={60} dangerAt={85} />
      </Stack>
    </Card>
  </Row>
</Stack>`,
    },
  ],

  designNotes:
    'The header row pairs a bold title with pill-style Tabs for time-range switching — ' +
    'pills read as a toggle group rather than navigation, which matches the "filter" intent. ' +
    'Each KPI card uses a three-tier Stack: label (xs, secondary) anchors meaning at the top, ' +
    'the value (2xl, display) commands attention in the middle, and a slim Progress bar at the ' +
    'bottom gives an at-a-glance ratio without requiring the user to interpret numbers. ' +
    'The trend Chip sits baseline-aligned next to the value so the delta reads as part of the ' +
    'same data point. Elevated cards with flex: 1 + minWidth ensure equal sizing that wraps ' +
    'gracefully at narrow viewports. The system-health variant demonstrates warnAt/dangerAt ' +
    'thresholds on Progress — the bar auto-colors based on the value, removing the need ' +
    'for manual variant assignment on each metric.',
};

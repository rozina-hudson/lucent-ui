import type { CompositionRecipe } from '../types.js';

export const RECIPE: CompositionRecipe = {
  id: 'stats-row',
  name: 'Stats Row',
  description: 'Row of individual stat cards with label, large display-font value, and trend chip with comparison.',
  category: 'dashboard',
  components: ['card', 'text', 'chip', 'avatar', 'stack', 'row'],

  structure: `
Row gap="3" wrap
├── Card (outline, padding="md", flex=1)
│   └── Stack gap="3"
│       ├── Text (xs, secondary, medium)     ← metric label
│       ├── Text (2xl, bold, display)        ← value
│       └── Row gap="2" align="center"
│           ├── Chip (success/danger, sm)    ← trend %
│           └── Text (xs, secondary)         ← comparison
├── Card ...
└── Card ...
  `.trim(),

  code: `<Row gap="3" wrap>
  <Card variant="outline" padding="md" style={{ flex: 1, minWidth: 180 }}>
    <Stack gap="3">
      <Text size="xs" color="secondary" weight="medium">Total Events</Text>
      <Text size="2xl" weight="bold" family="display">32</Text>
      <Row gap="2" align="center">
        <Chip variant="success" size="sm" borderless>+20%</Chip>
        <Text size="xs" color="secondary">25 last week</Text>
      </Row>
    </Stack>
  </Card>
  <Card variant="outline" padding="md" style={{ flex: 1, minWidth: 180 }}>
    <Stack gap="3">
      <Text size="xs" color="secondary" weight="medium">Total Hours</Text>
      <Text size="2xl" weight="bold" family="display">38.2 hr</Text>
      <Row gap="2" align="center">
        <Chip variant="danger" size="sm" borderless>-8%</Chip>
        <Text size="xs" color="secondary">42.0 hr last week</Text>
      </Row>
    </Stack>
  </Card>
  <Card variant="outline" padding="md" style={{ flex: 1, minWidth: 180 }}>
    <Stack gap="3">
      <Text size="xs" color="secondary" weight="medium">Focus Time</Text>
      <Text size="2xl" weight="bold" family="display">16.8 hr</Text>
      <Row gap="2" align="center">
        <Chip variant="success" size="sm" borderless>+12%</Chip>
        <Text size="xs" color="secondary">14.4 hr last week</Text>
      </Row>
    </Stack>
  </Card>
</Row>`,

  variants: [
    {
      title: 'Revenue cards with avatar header',
      code: `<Row gap="3" wrap>
  <Card variant="filled" padding="md" style={{ flex: 1, minWidth: 180 }}>
    <Stack gap="3">
      <Row gap="2" align="center">
        <Avatar alt="Airbnb" size="sm" />
        <Stack gap="0">
          <Text size="sm" weight="semibold">Airbnb</Text>
          <Text size="xs" color="secondary">Travel and tourism</Text>
        </Stack>
      </Row>
      <Row justify="between" align="end">
        <Stack gap="1">
          <Row gap="2" align="baseline">
            <Text size="lg" weight="bold" family="display">$33.2k</Text>
            <Chip variant="success" size="sm" borderless>+37%</Chip>
          </Row>
          <Text size="xs" color="secondary">Recurring Revenue</Text>
        </Stack>
      </Row>
    </Stack>
  </Card>
  <Card variant="filled" padding="md" style={{ flex: 1, minWidth: 180 }}>
    <Stack gap="3">
      <Row gap="2" align="center">
        <Avatar alt="MailChimp" size="sm" />
        <Stack gap="0">
          <Text size="sm" weight="semibold">MailChimp</Text>
          <Text size="xs" color="secondary">Email Marketing</Text>
        </Stack>
      </Row>
      <Row justify="between" align="end">
        <Stack gap="1">
          <Row gap="2" align="baseline">
            <Text size="lg" weight="bold" family="display">$3.2k</Text>
            <Chip variant="danger" size="sm" borderless>-23%</Chip>
          </Row>
          <Text size="xs" color="secondary">Recurring Revenue</Text>
        </Stack>
      </Row>
    </Stack>
  </Card>
</Row>`,
    },
  ],

  designNotes:
    'Each stat lives in its own Card so it reads as a discrete metric. flex: 1 with ' +
    'minWidth ensures equal sizing that wraps gracefully. gap="3" in the Stack creates ' +
    'three clear visual tiers: label (top), value (middle), trend context (bottom). ' +
    'Display font on the value creates instant hierarchy. The trend row pairs a ' +
    'color-coded Chip (success/danger) with a secondary comparison value so the user ' +
    'gets both relative change and absolute context. The revenue variant adds an ' +
    'Avatar + name header for entity-scoped metrics — align="baseline" on the ' +
    'value + chip row keeps the trend visually anchored to the number.',
};

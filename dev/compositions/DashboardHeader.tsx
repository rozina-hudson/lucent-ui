import {
  Text, Button, Stack, Row, Breadcrumb, Divider, Card, Chip,
} from '../../src/index.js';

function PlusIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

export function DashboardHeader() {
  return (
    <Stack gap="5" style={{ maxWidth: 860 }}>
      {/* Action bar */}
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

      {/* Stats row */}
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
    </Stack>
  );
}

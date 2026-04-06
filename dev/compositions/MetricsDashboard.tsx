import {
  Card, CardBleed, Text, Stack, Row, Chip, Tabs,
  SparkLine, BarChart, AreaChart, DonutChart,
} from '../../src/index.js';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Metric {
  id: string;
  label: string;
  value: string;
  trend: string;
  trendVariant: 'success' | 'danger' | 'warning';
  sparkData: number[];
  sparkColor?: string;
}

// ─── Sample data ───────────────────────────────────────────────────────────────

const metrics: Metric[] = [
  { id: 'revenue', label: 'Revenue', value: '$48.2k', trend: '+12.5%', trendVariant: 'success', sparkData: [28, 32, 30, 38, 36, 42, 48] },
  { id: 'users', label: 'Active Users', value: '2,847', trend: '+8.1%', trendVariant: 'success', sparkData: [2100, 2300, 2200, 2500, 2600, 2700, 2847] },
  { id: 'churn', label: 'Churn Rate', value: '3.2%', trend: '+0.8%', trendVariant: 'danger', sparkData: [2.1, 2.4, 2.2, 2.8, 3.0, 2.9, 3.2], sparkColor: 'danger' },
  { id: 'response', label: 'Avg. Response', value: '1.4s', trend: '-18%', trendVariant: 'success', sparkData: [2.1, 1.9, 1.8, 1.7, 1.6, 1.5, 1.4], sparkColor: 'success' },
];

const revenueByMonth = [
  { label: 'Jan', value: 32 },
  { label: 'Feb', value: 28 },
  { label: 'Mar', value: 35 },
  { label: 'Apr', value: 42 },
  { label: 'May', value: 38 },
  { label: 'Jun', value: 48 },
];

const userGrowth = [
  { label: 'Jan', value: 1800 },
  { label: 'Feb', value: 2100 },
  { label: 'Mar', value: 2300 },
  { label: 'Apr', value: 2200 },
  { label: 'May', value: 2600 },
  { label: 'Jun', value: 2847 },
];

const trafficSources = [
  { label: 'Direct', value: 42 },
  { label: 'Search', value: 28 },
  { label: 'Social', value: 18 },
  { label: 'Referral', value: 12 },
];

// ─── Component ─────────────────────────────────────────────────────────────────

export function MetricsDashboard() {
  return (
    <div style={{ width: 960 }}>
      <Stack gap="5">
        {/* Header */}
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

        {/* KPI Cards with SparkLines */}
        <Row gap="4" wrap>
          {metrics.map((m) => (
            <Card key={m.id} variant="elevated" padding="lg" style={{ flex: 1, minWidth: 200, overflow: 'hidden' }}>
              <Stack gap="3">
                <Text size="xs" color="secondary" weight="medium">{m.label}</Text>
                <Row gap="2" align="baseline">
                  <Text size="2xl" weight="bold" family="display">{m.value}</Text>
                  <Chip variant={m.trendVariant} size="sm" borderless>{m.trend}</Chip>
                </Row>
                <CardBleed style={{ paddingLeft: 0, paddingRight: 0, marginBottom: 'calc(-1 * var(--lucent-space-6))' }}>
                  <SparkLine data={m.sparkData} height={40} filled color={m.sparkColor} />
                </CardBleed>
              </Stack>
            </Card>
          ))}
        </Row>

        {/* Charts row */}
        <Row gap="4" wrap>
          {/* Bar chart */}
          <Card variant="elevated" padding="lg" style={{ flex: 2, minWidth: 320 }}>
            <Stack gap="3">
              <Text size="sm" weight="semibold">Revenue by Month</Text>
              <BarChart
                data={revenueByMonth}
                height={180}
                color="accent"
                formatValue={(v) => `$${v}k`}
              />
            </Stack>
          </Card>

          {/* Donut chart */}
          <Card variant="elevated" padding="lg" style={{ flex: 1, minWidth: 220 }}>
            <Stack gap="3" align="center">
              <Text size="sm" weight="semibold" style={{ alignSelf: 'flex-start' }}>Traffic Sources</Text>
              <DonutChart
                data={trafficSources}
                size={140}
                centerLabel={
                  <Stack gap="0" align="center">
                    <Text size="lg" weight="bold">4.2k</Text>
                    <Text size="xs" color="secondary">visits</Text>
                  </Stack>
                }
              />
              <Row gap="3" wrap style={{ justifyContent: 'center' }}>
                {trafficSources.map((s, i) => (
                  <Row key={s.label} gap="1" align="center">
                    <span style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: [
                        'var(--lucent-accent-default)',
                        'var(--lucent-success-default)',
                        'var(--lucent-info-default)',
                        'var(--lucent-warning-default)',
                      ][i],
                    }} />
                    <Text size="xs" color="secondary">{s.label}</Text>
                  </Row>
                ))}
              </Row>
            </Stack>
          </Card>
        </Row>

        {/* Area chart */}
        <Card variant="elevated" padding="lg">
          <Stack gap="3">
            <Text size="sm" weight="semibold">User Growth</Text>
            <AreaChart
              data={userGrowth}
              height={180}
              color="success"
              showDots
              formatValue={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v))}
            />
          </Stack>
        </Card>
      </Stack>
    </div>
  );
}

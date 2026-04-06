import {
  Card, Avatar, Text, Stack,
} from '../../src/index.js';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ActivityEvent {
  id: number;
  user: string;
  action: string;
  target: string;
  time: string;
  preview?: string;
}

interface ActivityDay {
  label: string;
  events: ActivityEvent[];
}

// ─── Sample data ───────────────────────────────────────────────────────────────

const days: ActivityDay[] = [
  {
    label: 'May 18, 2022',
    events: [
      { id: 1, user: 'Christoph Hellmuth', action: 'sent message to thread in channel', target: '#f-insights', time: '14:47', preview: 'Excepteur velit voluptate excepteur occaecat sint occaecat ex ipsum officia eiusmod fugiat. Labore proident eiusmod ut fugiat.' },
      { id: 2, user: 'Jules Pricer', action: 'added reaction in channel', target: '#f-insights', time: '14:16' },
      { id: 3, user: 'Jules Pricer', action: 'added reaction in channel', target: '#random', time: '13:59' },
      { id: 4, user: 'Carlos Sine', action: 'sent message to thread in channel', target: '#f-insights', time: '14:47', preview: 'Duis nisi pariatur excepteur aliqua ipsum eu ut voluptate ullamco sit do cillum labore voluptate ea.' },
    ],
  },
  {
    label: 'May 17, 2022',
    events: [
      { id: 5, user: 'Krzysztof Nowak', action: 'pushed 1 commit to', target: 'main', time: '16:32' },
      { id: 6, user: 'Jules Pricer', action: 'opened pull request', target: '[INFRA-79] – Add bench job resource', time: '15:10' },
      { id: 7, user: 'Charlotte Dengler', action: 'added a comment to', target: 'Announcement', time: '11:24', preview: 'In non non quis laboris id reprehenderit nulla reprehenderit est cupidatat incididunt amet. Excepteur voluptate do aliqua irure incididunt nostrud tempor tempor ad ad.' },
    ],
  },
];

// ─── Activity item ─────────────────────────────────────────────────────────────

function ActivityItem({ event, isLast }: { event: ActivityEvent; isLast: boolean }) {
  return (
    <div style={{
      display: 'flex',
      gap: 'var(--lucent-space-3)',
      paddingBottom: isLast ? 0 : 'var(--lucent-space-5)',
    }}>
      {/* Timestamp */}
      <div style={{ width: 38, flexShrink: 0, paddingTop: 7 }}>
        <Text size="xs" color="secondary">{event.time}</Text>
      </div>

      {/* Avatar + content */}
      <div style={{ display: 'flex', gap: 'var(--lucent-space-3)', flex: 1, minWidth: 0, alignItems: 'start' }}>
        <Avatar alt={event.user} size="sm" style={{ flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0, paddingTop: 5 }}>
          <Text size="sm">
            <Text as="span" size="sm" weight="semibold">{event.user}</Text>
            {' '}{event.action}{' '}
            <Text as="span" size="sm" weight="semibold">{event.target}</Text>
          </Text>

          {/* Content preview */}
          {event.preview && (
            <Card variant='filled' padding='sm' style={{
              marginTop: 'var(--lucent-space-2)'
            }}>
              <Text size="sm" color="secondary">{event.preview}</Text>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function ActivityFeed() {
  return (
    <Card variant="elevated" padding="lg" style={{ width: 600 }}>
      <Stack gap="5">
        <Text size="lg" weight="semibold">Activity</Text>

        {days.map((day) => (
          <Stack key={day.label} gap="3">
            <Text size="xs" color="secondary" weight="medium" style={{
              letterSpacing: '0.05em',
              textTransform: 'uppercase' as const,
            }}>{day.label}</Text>

            <div>
              {day.events.map((event, i) => (
                <ActivityItem key={event.id} event={event} isLast={i === day.events.length - 1} />
              ))}
            </div>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}

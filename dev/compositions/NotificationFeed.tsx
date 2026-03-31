import {
  Card, Avatar, Text, Button, Chip, Stack, Row, Tooltip,
} from '../../src/index.js';

interface Notification {
  id: number;
  name: string;
  action: string;
  target: string;
  time: string;
  unread: boolean;
  type: 'mention' | 'comment' | 'review' | 'invite';
}

const notifications: Notification[] = [
  { id: 1, name: 'Alice Chen', action: 'mentioned you in', target: 'Design system roadmap', time: '2 min ago', unread: true, type: 'mention' },
  { id: 2, name: 'Bob Martinez', action: 'commented on', target: 'PR #142: Token refactor', time: '15 min ago', unread: true, type: 'comment' },
  { id: 3, name: 'Carol Park', action: 'requested your review on', target: 'PR #139: Add Slider atom', time: '1 hour ago', unread: false, type: 'review' },
  { id: 4, name: 'Dan Okafor', action: 'invited you to', target: 'Frontend Guild', time: '3 hours ago', unread: false, type: 'invite' },
  { id: 5, name: 'Eve Johansson', action: 'commented on', target: 'Issue #95: Golden compositions', time: 'Yesterday', unread: false, type: 'comment' },
];

const typeChip: Record<Notification['type'], { variant: 'accent' | 'info' | 'warning' | 'success'; label: string }> = {
  mention: { variant: 'accent', label: 'Mention' },
  comment: { variant: 'info', label: 'Comment' },
  review: { variant: 'warning', label: 'Review' },
  invite: { variant: 'success', label: 'Invite' },
};

function EyeIcon() {
  return (
    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

const iconBtnStyle: React.CSSProperties = { width: 24, height: 24, padding: 0, minWidth: 0 };

function NotificationItem({ n }: { n: Notification }) {
  const chip = typeChip[n.type];
  return (
    <div style={{
      padding: 'var(--lucent-space-3) var(--lucent-space-5)',
      margin: '0 calc(-1 * var(--lucent-space-5))',
      borderRadius: 'var(--lucent-radius-md)',
      ...(n.unread ? { background: 'color-mix(in srgb, var(--lucent-accent-default) 6%, var(--lucent-surface))' } : {}),
    }}>
      <Row gap="3" align="start" justify="between">
        <Row gap="3" align="start" style={{ flex: 1, minWidth: 0 }}>
          <Avatar alt={n.name} size="sm" />
          <Stack gap="1" style={{ flex: 1, minWidth: 0 }}>
            <Text size="sm" color="secondary">
              <Text as="span" size="sm" weight="semibold" color="primary">{n.name}</Text>
              {' '}{n.action}{' '}
              <Text as="span" size="sm" weight="medium" color="primary">{n.target}</Text>
            </Text>
            <Row gap="2" align="center">
              <Chip variant={chip.variant} size="sm" borderless>{chip.label}</Chip>
              <Text size="xs" color="secondary">{n.time}</Text>
            </Row>
          </Stack>
        </Row>
        <Row gap="1">
          {n.type === 'review' && (
            <Tooltip content="Review">
              <Button variant="ghost" size="2xs" style={iconBtnStyle} aria-label="Review"><EyeIcon /></Button>
            </Tooltip>
          )}
          {n.type === 'invite' && (
            <Tooltip content="Accept">
              <Button variant="ghost" size="2xs" style={iconBtnStyle} aria-label="Accept"><CheckIcon /></Button>
            </Tooltip>
          )}
          <Tooltip content="Dismiss">
            <Button variant="ghost" size="2xs" style={iconBtnStyle} aria-label="Dismiss"><XIcon /></Button>
          </Tooltip>
        </Row>
      </Row>
    </div>
  );
}

export function NotificationFeed() {
  return (
    <Card variant="elevated" padding="lg" style={{ width: 520 }}>
      <Stack gap="3">
        <Row justify="between" align="center">
          <Row gap="2" align="center">
            <Text size="lg" weight="semibold">Notifications</Text>
            <Chip variant="accent" size="sm">3 new</Chip>
          </Row>
          <Button variant="ghost" size="xs">Mark all read</Button>
        </Row>
        <Stack gap="1">
          {notifications.map((n) => (
            <NotificationItem key={n.id} n={n} />
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}

import type { CompositionPattern } from '../types.js';

export const PATTERN: CompositionPattern = {
  id: 'notification-feed',
  name: 'Notification Feed',
  description: 'Scrollable list of notification items with avatar, message, timestamp, type chip, and contextual action buttons. Unread items are visually distinct.',
  category: 'card',
  components: ['card', 'avatar', 'text', 'chip', 'button', 'stack', 'row'],

  structure: `
Card (elevated, padding via style)
└── Stack gap="3"
    ├── Row justify="between" align="center"  ← header
    │   ├── Row gap="2" align="center"
    │   │   ├── Text (lg, semibold)           ← title
    │   │   └── Chip (accent, sm)             ← unread count
    │   └── Button (ghost, xs)                ← mark all read
    └── Stack gap="2"                         ← notification list
        └── Card[] (filled for unread, ghost for read)
            └── Row gap="3" align="start" justify="between"
                ├── Row gap="3" align="start"
                │   ├── Avatar (sm)
                │   └── Stack gap="1"
                │       ├── Text (sm)         ← message with bold name + target
                │       └── Row gap="2"
                │           ├── Chip (type-colored, sm, borderless)
                │           └── Text (xs, secondary) ← timestamp
                └── Row gap="1"               ← actions
                    ├── Button? (primary/outline, xs) ← contextual
                    └── Button (ghost, xs)     ← dismiss
  `.trim(),

  code: `<Card variant="elevated" padding="none" style={{ width: 520, padding: 'var(--lucent-space-4)' }}>
  <Stack gap="3">
    <Row justify="between" align="center" style={{ padding: '0 var(--lucent-space-2)' }}>
      <Row gap="2" align="center">
        <Text size="lg" weight="semibold">Notifications</Text>
        <Chip variant="accent" size="sm">3 new</Chip>
      </Row>
      <Button variant="ghost" size="xs">Mark all read</Button>
    </Row>
    <Stack gap="2">
      <Card variant="filled" padding="md" style={{ borderLeft: '3px solid var(--lucent-accent-default)' }}>
        <Row gap="3" align="start" justify="between">
          <Row gap="3" align="start" style={{ flex: 1, minWidth: 0 }}>
            <Avatar alt="Alice Chen" size="sm" />
            <Stack gap="1" style={{ flex: 1, minWidth: 0 }}>
              <Text size="sm">
                <Text as="span" size="sm" weight="semibold">Alice Chen</Text>
                {' '}mentioned you in{' '}
                <Text as="span" size="sm" weight="medium">Design system roadmap</Text>
              </Text>
              <Row gap="2" align="center">
                <Chip variant="accent" size="sm" borderless>Mention</Chip>
                <Text size="xs" color="secondary">2 min ago</Text>
              </Row>
            </Stack>
          </Row>
          <Button variant="ghost" size="xs">Dismiss</Button>
        </Row>
      </Card>
      <Card variant="ghost" padding="md">
        <Row gap="3" align="start" justify="between">
          <Row gap="3" align="start" style={{ flex: 1, minWidth: 0 }}>
            <Avatar alt="Carol Park" size="sm" />
            <Stack gap="1" style={{ flex: 1, minWidth: 0 }}>
              <Text size="sm">
                <Text as="span" size="sm" weight="semibold">Carol Park</Text>
                {' '}requested your review on{' '}
                <Text as="span" size="sm" weight="medium">PR #139: Add Slider atom</Text>
              </Text>
              <Row gap="2" align="center">
                <Chip variant="warning" size="sm" borderless>Review</Chip>
                <Text size="xs" color="secondary">1 hour ago</Text>
              </Row>
            </Stack>
          </Row>
          <Row gap="1">
            <Button variant="primary" size="xs">Review</Button>
            <Button variant="ghost" size="xs">Dismiss</Button>
          </Row>
        </Row>
      </Card>
    </Stack>
  </Stack>
</Card>`,

  designNotes:
    'Unread notifications use Card variant="filled" with an accent left border to create ' +
    'a visual distinction from read items (variant="ghost"). The accent border is a ' +
    'familiar "unread indicator" pattern. Each notification item is a self-contained Row ' +
    'with the avatar and message on the left (flex: 1, minWidth: 0 for text truncation) ' +
    'and contextual actions on the right. Type chips (mention, comment, review, invite) ' +
    'use semantic variant colors (accent, info, warning, success) with borderless styling ' +
    'so they read as metadata, not interactive elements. Action buttons are contextual: ' +
    'review requests get a primary "Review" button, invites get "Accept", others just "Dismiss".',
};

import type { CompositionPattern } from '../types.js';

export const PATTERN: CompositionPattern = {
  id: 'activity-feed',
  name: 'Activity Feed',
  description: 'Timestamped event list with user attribution. Each entry shows a timestamp, avatar, action description, and optional content preview card.',
  category: 'dashboard',
  components: ['card', 'avatar', 'text', 'stack', 'row'],

  structure: `
Card (elevated, padding lg)
└── Stack gap="4"
    ├── Row justify="between" align="center"    ← header
    │   ├── Text (lg, semibold)                 ← title
    │   └── Text (xs, secondary, uppercase)     ← date label
    └── div
        └── ActivityItem[]
            └── div (flex row, gap space-3)
                ├── Text (xs, secondary, w 38px) ← timestamp
                └── div (flex row, gap space-3)  ← avatar + content
                    ├── Avatar (sm)              ← user avatar, 32px
                    └── div
                        ├── Text (sm)            ← name (bold) + action + target (bold)
                        └── div? (surface-raised, rounded, padding)  ← content preview
                            └── Text (sm, secondary) ← preview text
  `.trim(),

  code: `<Card variant="elevated" padding="lg" style={{ width: 600 }}>
  <Stack gap="4">
    <Row justify="between" align="center">
      <Text size="lg" weight="semibold">Activity</Text>
      <Text size="xs" color="secondary" weight="medium"
        style={{ letterSpacing: '0.05em', textTransform: 'uppercase' }}>May 18, 2022</Text>
    </Row>
    <div>
      {/* Event item */}
      <div style={{ display: 'flex', gap: 'var(--lucent-space-3)', paddingBottom: 'var(--lucent-space-5)' }}>
        <div style={{ width: 38, flexShrink: 0, paddingTop: 7 }}>
          <Text size="xs" color="secondary">14:47</Text>
        </div>
        <div style={{ display: 'flex', gap: 'var(--lucent-space-3)', flex: 1, minWidth: 0, alignItems: 'start' }}>
          <Avatar alt="Christoph Hellmuth" size="sm" />
          <div style={{ flex: 1, minWidth: 0, paddingTop: 5 }}>
            <Text size="sm">
              <Text as="span" size="sm" weight="semibold">Christoph Hellmuth</Text>
              {' '}sent message in{' '}
              <Text as="span" size="sm" weight="semibold">#f-insights</Text>
            </Text>
            <div style={{
              marginTop: 'var(--lucent-space-3)',
              padding: 'var(--lucent-space-3) var(--lucent-space-4)',
              background: 'var(--lucent-surface-raised)', borderRadius: 'var(--lucent-radius-md)',
            }}>
              <Text size="sm" color="secondary">Message preview text…</Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Stack>
</Card>`,

  variants: [
    {
      title: 'Compact (no header, no previews)',
      code: `<Card variant="outline" padding="md" style={{ width: 480 }}>
  <div>
    <div style={{ display: 'flex', gap: 'var(--lucent-space-2)', paddingBottom: 'var(--lucent-space-3)' }}>
      <Text size="xs" color="secondary" style={{ width: 32, flexShrink: 0 }}>14:47</Text>
      <Avatar alt="Alice" size="xs" style={{ flexShrink: 0 }} />
      <Text size="xs">
        <Text as="span" size="xs" weight="semibold">Alice</Text>
        {' '}pushed to main
      </Text>
    </div>
  </div>
</Card>`,
    },
  ],

  designNotes:
    'Clean multi-column layout gives each information layer its own lane: timestamp on the left ' +
    'for quick scanning, avatar for identity, then action text. Content previews (message ' +
    'excerpts, comment text) sit in surface-raised cards below the action line, indented under ' +
    'the text column so they read as subordinate detail. No timeline connector or source icons — ' +
    'the vertical rhythm of aligned timestamps provides enough chronological structure without ' +
    'visual clutter. The timestamp column (38px) is narrow enough to not dominate but wide enough ' +
    'for HH:MM format.',
};

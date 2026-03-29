import type { CompositionRecipe } from '../types.js';

export const RECIPE: CompositionRecipe = {
  id: 'profile-card',
  name: 'Profile Card',
  description: 'User profile card with avatar, name/role, bio, tag chips, stats row, and action buttons.',
  category: 'card',
  components: ['card', 'avatar', 'text', 'chip', 'button', 'stack', 'row', 'divider'],

  structure: `
Card (elevated, equal padding via style)
└── Stack gap="5"
    ├── Row gap="3" align="center"           ← avatar + name block
    │   ├── Avatar (lg)
    │   └── Stack gap="1"
    │       ├── Row gap="2" align="center"
    │       │   ├── Text (lg, semibold, display) ← full name
    │       │   └── Chip (success, sm)       ← status badge
    │       └── Text (sm, secondary)         ← role / subtitle
    ├── Text (sm)                            ← bio paragraph
    ├── Row gap="2" wrap                     ← skill/tag chips
    │   └── Chip[] (neutral, borderless, clickable)
    ├── Divider
    ├── Row gap="6" justify="around"         ← stats
    │   └── Stack[] gap="0" align="center"
    │       ├── Text (2xl, bold, display)     ← stat value
    │       └── Text (xs, secondary)         ← stat label
    └── Row gap="3"                          ← actions
        ├── Button (primary, full width)
        └── Button (outline, full width)
  `.trim(),

  code: `<Card variant="elevated" padding="none" style={{ width: 340, padding: 'var(--lucent-space-6)' }}>
  <Stack gap="5">
    <Row gap="3" align="center">
      <Avatar src="/avatars/jane.jpg" alt="Jane Doe" size="lg" />
      <Stack gap="1">
        <Row gap="2" align="center">
          <Text size="lg" weight="semibold" family="display">Jane Doe</Text>
          <Chip variant="success" size="sm" dot>Pro</Chip>
        </Row>
        <Text size="sm" color="secondary">Software Engineer</Text>
      </Stack>
    </Row>
    <Text size="sm">
      Building design systems and component libraries.
      Passionate about accessible, token-driven UI.
    </Text>
    <Row gap="2" wrap>
      <Chip variant="neutral" borderless onClick={() => {}}>React</Chip>
      <Chip variant="neutral" borderless onClick={() => {}}>TypeScript</Chip>
      <Chip variant="neutral" borderless onClick={() => {}}>Design Systems</Chip>
    </Row>
    <Divider />
    <Row gap="6" justify="around">
      <Stack gap="0" align="center">
        <Text size="2xl" weight="bold" family="display">128</Text>
        <Text size="xs" color="secondary">Posts</Text>
      </Stack>
      <Stack gap="0" align="center">
        <Text size="2xl" weight="bold" family="display">4.2k</Text>
        <Text size="xs" color="secondary">Followers</Text>
      </Stack>
      <Stack gap="0" align="center">
        <Text size="2xl" weight="bold" family="display">312</Text>
        <Text size="xs" color="secondary">Following</Text>
      </Stack>
    </Row>
    <Row gap="3">
      <Button variant="primary" style={{ flex: 1 }}>Follow</Button>
      <Button variant="outline" style={{ flex: 1 }}>Message</Button>
    </Row>
  </Stack>
</Card>`,

  variants: [
    {
      title: 'Compact collapsible profile',
      code: `<Card variant="filled" padding="none" hoverable style={{ width: 280 }}>
  <Collapsible
    trigger={
      <Row gap="3" align="center">
        <Avatar alt="Jane Doe" size="md" />
        <Stack gap="1">
          <Text as="span" size="sm" weight="semibold">Jane Doe</Text>
          <Text as="span" size="xs" color="secondary">Software Engineer</Text>
        </Stack>
      </Row>
    }
    defaultOpen
  >
    <Row gap="2" justify="end">
      <Button variant="outline" size="sm">Message</Button>
      <Button variant="primary" size="sm">Follow</Button>
    </Row>
  </Collapsible>
</Card>`,
    },
  ],

  designNotes:
    'Avatar and name are grouped in a Row with center alignment so the text block ' +
    'vertically centers against the avatar regardless of line count. The name row ' +
    'uses gap="2" for tight coupling between name and status chip. Stats use ' +
    'justify="around" to distribute evenly without fixed widths. Action buttons ' +
    'use flex: 1 to split the row equally. The Divider separates informational ' +
    'content (above) from interactive content (below).',
};

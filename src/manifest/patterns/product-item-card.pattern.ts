import type { CompositionPattern } from '../types.js';

export const PATTERN: CompositionPattern = {
  id: 'product-item-card',
  name: 'Product/Item Card',
  description: 'Versatile content card with media slot, title, tags, metadata, and CTA. Reusable for products, articles, team members, or any entity list.',
  category: 'card',
  components: ['card', 'avatar', 'icon', 'text', 'chip', 'button', 'stack', 'row'],

  structure: `
Card (elevated, padding="lg", media=<img>)
└── Stack gap="4"
    ├── Stack gap="1"
    │   ├── Text (md, semibold)        ← title
    │   └── Text (sm, secondary)       ← subtitle
    ├── Row gap="2" wrap
    │   └── Chip[] (neutral, sm)       ← tags / categories
    ├── Row gap="4" justify="between" align="baseline"
    │   ├── Text (lg, bold, display)   ← price / key metric
    │   └── Text (xs, secondary)       ← secondary info
    └── Button (primary, full width)   ← CTA
  `.trim(),

  code: `<Card
  variant="elevated"
  padding="lg"
  style={{ width: 320 }}
  media={<img src="/products/headphones.jpg" alt="Wireless Headphones" style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }} />}
>
  <Stack gap="4">
    <Stack gap="1">
      <Text size="md" weight="semibold">Wireless Headphones</Text>
      <Text size="sm" color="secondary">Active noise cancelling, 40hr battery</Text>
    </Stack>
    <Row gap="2" wrap>
      <Chip variant="neutral" size="sm">Audio</Chip>
      <Chip variant="neutral" size="sm">Bluetooth</Chip>
      <Chip variant="neutral" size="sm">ANC</Chip>
    </Row>
    <Row gap="4" justify="between" align="baseline">
      <Text size="lg" weight="bold" family="display">$249.00</Text>
      <Text size="xs" color="secondary">Free shipping</Text>
    </Row>
    <Button variant="primary" style={{ width: '100%' }}>Add to Cart</Button>
  </Stack>
</Card>`,

  variants: [
    {
      title: 'Article card',
      code: `<Card variant="outline" padding="lg" hoverable style={{ width: 340 }}>
  <Stack gap="4">
    <Row gap="3" align="start">
      <Icon size={20} color="var(--lucent-text-secondary)"><File /></Icon>
      <Stack gap="1" style={{ flex: 1 }}>
        <Text size="md" weight="semibold">Design Tokens at Scale</Text>
        <Text size="xs" color="secondary">Published Mar 15, 2026</Text>
      </Stack>
    </Row>
    <Text size="sm" color="secondary">
      How we unified spacing, color, and typography across 12 product surfaces using a single token system.
    </Text>
    <Row gap="2" wrap>
      <Chip variant="neutral" size="sm">Design Systems</Chip>
      <Chip variant="neutral" size="sm">Tokens</Chip>
    </Row>
    <Row gap="4" justify="between" align="center">
      <Text size="xs" color="secondary">8 min read</Text>
      <Button variant="ghost" size="sm">Read more</Button>
    </Row>
  </Stack>
</Card>`,
    },
    {
      title: 'Team member card',
      code: `<Card variant="filled" padding="lg" style={{ width: 280 }}>
  <Stack gap="4">
    <Stack gap="3" align="center">
      <Avatar src="/avatars/alex.jpg" alt="Alex Chen" size="lg" />
      <Stack gap="0" align="center">
        <Text size="md" weight="semibold">Alex Chen</Text>
        <Text size="sm" color="secondary">Engineering Lead</Text>
      </Stack>
    </Stack>
    <Row gap="2" wrap justify="center">
      <Chip variant="neutral" size="sm">React</Chip>
      <Chip variant="neutral" size="sm">Go</Chip>
      <Chip variant="neutral" size="sm">Platform</Chip>
    </Row>
    <Row gap="3">
      <Button variant="outline" style={{ flex: 1 }} size="sm">Profile</Button>
      <Button variant="primary" style={{ flex: 1 }} size="sm">Message</Button>
    </Row>
  </Stack>
</Card>`,
    },
  ],

  designNotes:
    'The default product card uses the Card media slot for a full-bleed hero image ' +
    'at the top, keeping the content area clean with just title, tags, price, and CTA. ' +
    'Tags use neutral Chips at sm size for low visual weight — they inform without ' +
    'competing with the title. The price/metric row uses justify="between" with ' +
    'align="baseline" to anchor the large display-font value and the secondary caption ' +
    'to the same text baseline. A full-width primary Button as the sole CTA creates a ' +
    'clear action target. The article variant swaps the media slot for an inline Icon + ' +
    'text header and replaces the price row with read-time + ghost button, keeping the ' +
    'same vertical rhythm. The team member variant centers the content for a profile-style ' +
    'layout and uses a dual-button footer with flex: 1 for equal width.',
};

import type { CompositionPattern } from '../types.js';

export const PATTERN: CompositionPattern = {
  id: 'announcement-card',
  name: 'Announcement Card',
  description: 'Rich announcement card with optional media slot, status icon, title, message, and action buttons. For in-page announcements, feature launches, promotions, or system notices.',
  category: 'card',
  components: ['card', 'icon', 'text', 'button', 'chip', 'stack', 'row'],

  structure: `
Card (elevated, padding="lg", media=<img>)
└── Stack gap="4"
    ├── Row gap="2" wrap                       ← optional badge row
    │   └── Chip (accent/success, sm)          ← category / "New"
    ├── Stack gap="1"
    │   ├── Text (md, semibold)                ← title
    │   └── Text (sm, secondary)               ← message body
    └── Row gap="2"
        ├── Button (primary, sm)               ← action
        └── Button (ghost, sm)                 ← dismiss
  `.trim(),

  code: `<Card
  variant="elevated"
  padding="lg"
  style={{ width: 380 }}
  media={<img src="/announcements/feature-launch.jpg" alt="New dashboard" style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }} />}
>
  <Stack gap="4">
    <Row gap="2">
      <Chip variant="accent" size="sm">New Feature</Chip>
    </Row>
    <Stack gap="1">
      <Text size="md" weight="semibold">Redesigned Analytics Dashboard</Text>
      <Text size="sm" color="secondary">Track key metrics at a glance with our new real-time dashboard. Includes custom date ranges, export to CSV, and team sharing.</Text>
    </Stack>
    <Row gap="2">
      <Button variant="primary" size="sm">Try it now</Button>
      <Button variant="ghost" size="sm">Learn more</Button>
    </Row>
  </Stack>
</Card>`,

  variants: [
    {
      title: 'System notice (no media, with status icon)',
      code: `<Card variant="outline" padding="md" style={{ width: 400 }}>
  <Row gap="3" align="start">
    <Icon size="lg" color="var(--lucent-warning-text)">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1={12} y1={9} x2={12} y2={13} />
        <line x1={12} y1={17} x2={12.01} y2={17} />
      </svg>
    </Icon>
    <Stack gap="2" style={{ flex: 1 }}>
      <Text size="sm" weight="semibold">Storage almost full</Text>
      <Text size="sm" color="secondary">You've used 92% of your storage. Upgrade your plan or delete unused files to free up space.</Text>
      <Row gap="2">
        <Button variant="primary" size="sm">Upgrade plan</Button>
        <Button variant="ghost" size="sm">Manage storage</Button>
      </Row>
    </Stack>
  </Row>
</Card>`,
    },
    {
      title: 'Promotional banner with media',
      code: `<Card variant="filled" padding="md" hoverable style={{ width: 380 }}>
  <Row gap="5" align="center">
    <div style={{ width: 80, height: 80, borderRadius: 'var(--lucent-radius-lg)', overflow: 'hidden', flexShrink: 0 }}>
      <img src="/promo/spring-sale.jpg" alt="Spring sale" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
    </div>
    <Stack gap="2" style={{ flex: 1 }}>
      <Row gap="2" align="center">
        <Text size="md" weight="semibold">Spring Sale</Text>
        <Chip variant="success" size="sm">-30%</Chip>
      </Row>
      <Text size="sm" color="secondary">All Pro plans are 30% off through April. Upgrade now and lock in the price for a year.</Text>
      <Button variant="primary" size="sm" style={{ alignSelf: 'flex-start' }}>Claim offer</Button>
    </Stack>
  </Row>
</Card>`,
    },
    {
      title: 'Success confirmation',
      code: `<Card variant="outline" padding="md" style={{ width: 400, borderColor: 'var(--lucent-success-default)' }}>
  <Row gap="3" align="start">
    <Icon size="lg" color="var(--lucent-success-text)">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    </Icon>
    <Stack gap="1" style={{ flex: 1 }}>
      <Text size="sm" weight="semibold">Payment received</Text>
      <Text size="sm" color="secondary">Your invoice #1042 for $2,400.00 has been paid successfully.</Text>
    </Stack>
    <Button variant="ghost" size="sm">Dismiss</Button>
  </Row>
</Card>`,
    },
  ],

  designNotes:
    'The default announcement card uses the Card media slot for a full-bleed hero ' +
    'image that grabs attention, followed by an optional Chip badge for categorization, ' +
    'then title + description + action buttons. This distinguishes it from the Alert ' +
    'molecule which is a lightweight status banner — the Announcement Card is richer, ' +
    'supports media, and drives the user toward an action. The system notice variant ' +
    'drops the media for a compact icon-led layout similar to Alert but with action ' +
    'buttons. The promotional variant uses an inline thumbnail (Row with rounded image) ' +
    'for a side-by-side layout that works well for offers and upsells. The success ' +
    'variant uses a tinted border to reinforce status at a glance.',
};

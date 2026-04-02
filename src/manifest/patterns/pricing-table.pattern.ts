import type { CompositionPattern } from '../types.js';

export const PATTERN: CompositionPattern = {
  id: 'pricing-table',
  name: 'Pricing Table',
  description: 'Side-by-side pricing tier cards with feature lists and CTA buttons. Middle tier highlighted with accent border and primary button.',
  category: 'card',
  components: ['card', 'text', 'button', 'chip', 'stack', 'row', 'divider'],

  structure: `
Row gap="4" wrap align="stretch"
├── Card (outline, flex=1)                  ← free tier
│   └── Stack gap="5" (full height)
│       ├── Stack gap="2"                   ← tier header
│       │   ├── Text (sm, secondary)        ← tier name
│       │   ├── Row align="baseline"
│       │   │   ├── Text (3xl, bold, display) ← price
│       │   │   └── Text (sm, secondary)    ← period
│       │   └── Text (xs, secondary)        ← tagline
│       ├── Divider
│       ├── Stack gap="3" (flex=1)          ← feature list
│       │   └── Row[] gap="2" align="center"
│       │       ├── ✓ icon (success color)
│       │       └── Text (sm)
│       └── Button (outline, full width)
├── Card (elevated, accent border, flex=1)  ← pro tier (highlighted)
│   └── (same structure + Chip "Popular")
│       └── Button (primary, full width)
└── Card (outline, flex=1)                  ← enterprise tier
    └── (same structure)
        └── Button (outline, full width)
  `.trim(),

  code: `<Row gap="4" wrap align="stretch">
  <Card variant="outline" padding="lg" style={{ flex: 1, minWidth: 240, maxWidth: 320 }}>
    <Stack gap="5" style={{ height: '100%' }}>
      <Stack gap="2">
        <Text size="sm" weight="medium" color="secondary">Free</Text>
        <Row gap="1" align="baseline">
          <Text size="3xl" weight="bold" family="display">$0</Text>
          <Text size="sm" color="secondary">/ month</Text>
        </Row>
        <Text size="xs" color="secondary">For individuals getting started.</Text>
      </Stack>
      <Divider />
      <Stack gap="3" style={{ flex: 1 }}>
        <Row gap="2" align="center"><CheckIcon /><Text size="sm">Up to 3 projects</Text></Row>
        <Row gap="2" align="center"><CheckIcon /><Text size="sm">1 GB storage</Text></Row>
        <Row gap="2" align="center"><CheckIcon /><Text size="sm">Community support</Text></Row>
        <Row gap="2" align="center"><CheckIcon /><Text size="sm">Basic analytics</Text></Row>
      </Stack>
      <Button variant="outline" style={{ width: '100%' }}>Get started</Button>
    </Stack>
  </Card>
  <Card variant="elevated" padding="lg" style={{ flex: 1, minWidth: 240, maxWidth: 320, border: '2px solid var(--lucent-accent-default)' }}>
    <Stack gap="5" style={{ height: '100%' }}>
      <Stack gap="2">
        <Row gap="2" align="center">
          <Text size="sm" weight="medium" color="secondary">Pro</Text>
          <Chip variant="accent" size="sm">Popular</Chip>
        </Row>
        <Row gap="1" align="baseline">
          <Text size="3xl" weight="bold" family="display">$29</Text>
          <Text size="sm" color="secondary">/ month</Text>
        </Row>
        <Text size="xs" color="secondary">For professionals and small teams.</Text>
      </Stack>
      <Divider />
      <Stack gap="3" style={{ flex: 1 }}>
        <Row gap="2" align="center"><CheckIcon /><Text size="sm">Unlimited projects</Text></Row>
        <Row gap="2" align="center"><CheckIcon /><Text size="sm">50 GB storage</Text></Row>
        <Row gap="2" align="center"><CheckIcon /><Text size="sm">Priority support</Text></Row>
        <Row gap="2" align="center"><CheckIcon /><Text size="sm">Advanced analytics</Text></Row>
        <Row gap="2" align="center"><CheckIcon /><Text size="sm">Custom domains</Text></Row>
        <Row gap="2" align="center"><CheckIcon /><Text size="sm">Team collaboration</Text></Row>
      </Stack>
      <Button variant="primary" style={{ width: '100%' }}>Upgrade to Pro</Button>
    </Stack>
  </Card>
  <Card variant="outline" padding="lg" style={{ flex: 1, minWidth: 240, maxWidth: 320 }}>
    <Stack gap="5" style={{ height: '100%' }}>
      <Stack gap="2">
        <Text size="sm" weight="medium" color="secondary">Enterprise</Text>
        <Row gap="1" align="baseline">
          <Text size="3xl" weight="bold" family="display">$99</Text>
          <Text size="sm" color="secondary">/ month</Text>
        </Row>
        <Text size="xs" color="secondary">For organizations at scale.</Text>
      </Stack>
      <Divider />
      <Stack gap="3" style={{ flex: 1 }}>
        <Row gap="2" align="center"><CheckIcon /><Text size="sm">Everything in Pro</Text></Row>
        <Row gap="2" align="center"><CheckIcon /><Text size="sm">Unlimited storage</Text></Row>
        <Row gap="2" align="center"><CheckIcon /><Text size="sm">24/7 dedicated support</Text></Row>
        <Row gap="2" align="center"><CheckIcon /><Text size="sm">SSO & SAML</Text></Row>
        <Row gap="2" align="center"><CheckIcon /><Text size="sm">Audit logs</Text></Row>
        <Row gap="2" align="center"><CheckIcon /><Text size="sm">SLA guarantee</Text></Row>
        <Row gap="2" align="center"><CheckIcon /><Text size="sm">Custom integrations</Text></Row>
      </Stack>
      <Button variant="outline" style={{ width: '100%' }}>Contact sales</Button>
    </Stack>
  </Card>
</Row>`,

  designNotes:
    'Three tiers in a Row with flex: 1 and minWidth/maxWidth constraints ensure equal ' +
    'sizing that wraps gracefully on narrow viewports. align="stretch" makes all cards ' +
    'equal height. The Pro tier is visually distinguished with an accent border and ' +
    'elevated variant so it draws the eye first. Each card uses Stack with height: 100% ' +
    'and the feature list has flex: 1 to push the CTA button to the bottom regardless ' +
    'of feature count. Price uses display font at 3xl for maximum impact; align="baseline" ' +
    'on the Row anchors the period text to the price baseline. The "Popular" Chip reinforces ' +
    'the recommended tier. CheckIcon uses success color for positive feature connotation.',
};

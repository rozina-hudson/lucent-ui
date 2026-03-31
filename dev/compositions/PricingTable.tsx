import {
  Card, Text, Button, Stack, Row, Chip, Divider,
} from '../../src/index.js';

function CheckIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--lucent-success-default)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <Row gap="2" align="center">
      <CheckIcon />
      <Text size="sm">{children}</Text>
    </Row>
  );
}

export function PricingTable() {
  return (
    <Row gap="4" wrap align="stretch">
      {/* Free tier */}
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
            <Feature>Up to 3 projects</Feature>
            <Feature>1 GB storage</Feature>
            <Feature>Community support</Feature>
            <Feature>Basic analytics</Feature>
          </Stack>
          <Button variant="outline" style={{ width: '100%' }}>Get started</Button>
        </Stack>
      </Card>

      {/* Pro tier — highlighted */}
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
            <Feature>Unlimited projects</Feature>
            <Feature>50 GB storage</Feature>
            <Feature>Priority support</Feature>
            <Feature>Advanced analytics</Feature>
            <Feature>Custom domains</Feature>
            <Feature>Team collaboration</Feature>
          </Stack>
          <Button variant="primary" style={{ width: '100%' }}>Upgrade to Pro</Button>
        </Stack>
      </Card>

      {/* Enterprise tier */}
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
            <Feature>Everything in Pro</Feature>
            <Feature>Unlimited storage</Feature>
            <Feature>24/7 dedicated support</Feature>
            <Feature>SSO &amp; SAML</Feature>
            <Feature>Audit logs</Feature>
            <Feature>SLA guarantee</Feature>
            <Feature>Custom integrations</Feature>
          </Stack>
          <Button variant="outline" style={{ width: '100%' }}>Contact sales</Button>
        </Stack>
      </Card>
    </Row>
  );
}

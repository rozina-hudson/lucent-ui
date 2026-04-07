import type { CompositionPattern } from '../types.js';

export const PATTERN: CompositionPattern = {
  id: 'tab-page',
  name: 'Tab Page',
  description:
    'Tabbed content sections with card bodies. Useful for detail views, settings pages, or any multi-section content.',
  category: 'nav',
  components: ['tabs', 'card', 'row', 'text', 'stack', 'button'],

  structure: `
Stack gap="4"
├── Row gap="3" align="center" justify="between"
│   ├── Text (xl, bold)              ← page title
│   └── Button (outline, sm)        ← optional action
├── Tabs
│   └── Tab[] — each tab's content is wrapped in a Card
│       └── Card
│           └── Stack gap="4"        ← tab body content
  `.trim(),

  code: `<Stack gap="4">
  <Row gap="3" align="center" justify="between">
    <Text as="h1" size="xl" weight="bold">Project settings</Text>
    <Button variant="outline" size="sm">Save all</Button>
  </Row>
  <Tabs
    defaultValue="general"
    tabs={[
      {
        value: 'general',
        label: 'General',
        content: (
          <Card>
            <Stack gap="4">
              <Text size="sm" weight="semibold">Project name</Text>
              <Text size="sm" color="secondary">
                Update your project name and description to help team members identify this project.
              </Text>
            </Stack>
          </Card>
        ),
      },
      {
        value: 'members',
        label: 'Members',
        content: (
          <Card>
            <Stack gap="4">
              <Row justify="between" align="center">
                <Text size="sm" weight="semibold">Team members</Text>
                <Button variant="outline" size="sm">Invite</Button>
              </Row>
              <Text size="sm" color="secondary">
                Manage who has access to this project and their permissions.
              </Text>
            </Stack>
          </Card>
        ),
      },
      {
        value: 'billing',
        label: 'Billing',
        content: (
          <Card>
            <Stack gap="4">
              <Text size="sm" weight="semibold">Plan & usage</Text>
              <Text size="sm" color="secondary">
                Review your current plan, usage limits, and payment history.
              </Text>
            </Stack>
          </Card>
        ),
      },
    ]}
  />
</Stack>`,

  variants: [
    {
      title: 'Detail view with description and no action button',
      code: `<Stack gap="4">
  <Stack gap="1">
    <Text as="h1" size="xl" weight="bold">Order #1042</Text>
    <Text size="sm" color="secondary">Placed on March 15, 2025</Text>
  </Stack>
  <Tabs
    defaultValue="items"
    tabs={[
      {
        value: 'items',
        label: 'Items',
        content: (
          <Card>
            <Stack gap="3">
              <Row justify="between">
                <Text size="sm">Widget Pro × 2</Text>
                <Text size="sm" weight="medium">$49.98</Text>
              </Row>
              <Row justify="between">
                <Text size="sm">Adapter Cable</Text>
                <Text size="sm" weight="medium">$12.00</Text>
              </Row>
            </Stack>
          </Card>
        ),
      },
      {
        value: 'shipping',
        label: 'Shipping',
        content: (
          <Card>
            <Stack gap="3">
              <Text size="sm" weight="semibold">Tracking</Text>
              <Text size="sm" color="secondary">
                UPS Ground — 1Z999AA10123456784
              </Text>
            </Stack>
          </Card>
        ),
      },
      {
        value: 'history',
        label: 'History',
        content: (
          <Card>
            <Stack gap="3">
              <Row gap="3" align="center">
                <Text size="xs" color="secondary" style={{ width: 80 }}>Mar 15</Text>
                <Text size="sm">Order placed</Text>
              </Row>
              <Row gap="3" align="center">
                <Text size="xs" color="secondary" style={{ width: 80 }}>Mar 16</Text>
                <Text size="sm">Payment confirmed</Text>
              </Row>
              <Row gap="3" align="center">
                <Text size="xs" color="secondary" style={{ width: 80 }}>Mar 18</Text>
                <Text size="sm">Shipped</Text>
              </Row>
            </Stack>
          </Card>
        ),
      },
    ]}
  />
</Stack>`,
    },
  ],

  designNotes:
    'The page title and action button sit in a Row with justify="between" to push the action ' +
    'to the far right, and align="center" to vertically center them regardless of text size. ' +
    'Each tab\u2019s content is wrapped in a Card to give it a contained, elevated appearance that ' +
    'visually separates the body from the tab strip. Stack gap="4" inside each Card provides ' +
    'consistent vertical rhythm for the tab content. The Tabs component handles its own sliding ' +
    'indicator and ARIA tablist semantics, so the pattern only needs to compose the surrounding ' +
    'layout. The detail-view variant drops the action button and adds a subtitle via a nested ' +
    'Stack gap="1" — a common pattern for entity detail pages where the header provides context ' +
    'rather than actions.',
};

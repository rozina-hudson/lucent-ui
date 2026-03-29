import type { CompositionRecipe } from '../types.js';

export const RECIPE: CompositionRecipe = {
  id: 'settings-panel',
  name: 'Settings Panel',
  description: 'Settings card with section header, toggle rows with descriptions, select dropdown, and action buttons.',
  category: 'settings',
  components: ['card', 'text', 'badge', 'toggle', 'select', 'button', 'stack', 'row', 'divider', 'nav-menu', 'form-field', 'input', 'textarea'],

  structure: `
Card (elevated, padding="lg")
└── Stack gap="5"
    ├── Row gap="2" align="center"           ← section header
    │   ├── Text (lg, semibold)              ← title
    │   └── Badge (accent)                   ← version/plan badge
    ├── Divider
    ├── Stack gap="4"                        ← toggle settings
    │   ├── Row justify="between"            ← setting row
    │   │   ├── Stack gap="1"
    │   │   │   ├── Text (sm, medium)        ← setting label
    │   │   │   └── Text (xs, secondary)     ← description
    │   │   └── Toggle
    │   ├── Row justify="between"
    │   │   ├── Stack gap="1"
    │   │   │   ├── Text (sm, medium)
    │   │   │   └── Text (xs, secondary)
    │   │   └── Toggle
    │   └── Row justify="between"
    │       ├── Stack gap="1"
    │       │   ├── Text (sm, medium)
    │       │   └── Text (xs, secondary)
    │       └── Select
    ├── Divider
    └── Row gap="2" justify="end"            ← actions
        ├── Button (ghost, sm)
        └── Button (primary, sm)
  `.trim(),

  code: `<Card variant="elevated" padding="lg" style={{ width: 400 }}>
  <Stack gap="5">
    <Row gap="2" align="center">
      <Text size="lg" weight="semibold">Notifications</Text>
      <Badge variant="accent">Pro</Badge>
    </Row>
    <Divider />
    <Stack gap="4">
      <Row justify="between">
        <Stack gap="1">
          <Text size="sm" weight="medium">Email alerts</Text>
          <Text size="xs" color="secondary">
            Get notified when someone mentions you.
          </Text>
        </Stack>
        <Toggle defaultChecked />
      </Row>
      <Row justify="between">
        <Stack gap="1">
          <Text size="sm" weight="medium">Push notifications</Text>
          <Text size="xs" color="secondary">
            Receive push notifications on your device.
          </Text>
        </Stack>
        <Toggle />
      </Row>
      <Row justify="between">
        <Stack gap="1">
          <Text size="sm" weight="medium">Digest frequency</Text>
          <Text size="xs" color="secondary">
            How often to send summary emails.
          </Text>
        </Stack>
        <Select
          defaultValue="weekly"
          options={[
            { value: 'daily', label: 'Daily' },
            { value: 'weekly', label: 'Weekly' },
            { value: 'monthly', label: 'Monthly' },
          ]}
          size="sm"
          style={{ width: 120 }}
        />
      </Row>
    </Stack>
    <Divider />
    <Row gap="2" justify="end">
      <Button variant="ghost" size="sm">Reset</Button>
      <Button variant="primary" size="sm">Save changes</Button>
    </Row>
  </Stack>
</Card>`,

  variants: [
    {
      title: 'Drill-down with NavMenu',
      code: `const [tab, setTab] = useState('profile');

<Card variant="elevated" padding="none" style={{ width: 560 }}>
  <Row gap="0" align="stretch">
    <div style={{ width: 160, borderRight: '1px solid var(--lucent-border-default)', padding: 'var(--lucent-space-3)', flexShrink: 0 }}>
      <NavMenu orientation="vertical" size="sm">
        <NavMenu.Item as="button" isActive={tab === 'profile'} onClick={() => setTab('profile')}>Profile</NavMenu.Item>
        <NavMenu.Item as="button" isActive={tab === 'notifications'} onClick={() => setTab('notifications')}>Notifications</NavMenu.Item>
        <NavMenu.Item as="button" isActive={tab === 'security'} onClick={() => setTab('security')}>Security</NavMenu.Item>
      </NavMenu>
    </div>
    <div style={{ flex: 1, padding: 'var(--lucent-space-5)' }}>
      {tab === 'profile' && (
        <Stack gap="4">
          <Text size="sm" weight="semibold">Profile</Text>
          <FormField label="Display name" htmlFor="s-name">
            <Input id="s-name" placeholder="Jane Doe" size="sm" />
          </FormField>
          <FormField label="Bio" htmlFor="s-bio">
            <Textarea id="s-bio" placeholder="Tell us about yourself..." rows={2} />
          </FormField>
          <Row gap="2" justify="end">
            <Button variant="primary" size="sm">Save</Button>
          </Row>
        </Stack>
      )}
      {tab === 'notifications' && (
        <Stack gap="4">
          <Text size="sm" weight="semibold">Notifications</Text>
          <Row justify="between">
            <Stack gap="1">
              <Text size="sm" weight="medium">Email alerts</Text>
              <Text size="xs" color="secondary">Get notified on mentions.</Text>
            </Stack>
            <Toggle defaultChecked />
          </Row>
          <Row justify="between">
            <Stack gap="1">
              <Text size="sm" weight="medium">Push notifications</Text>
              <Text size="xs" color="secondary">Receive push on your device.</Text>
            </Stack>
            <Toggle />
          </Row>
        </Stack>
      )}
      {tab === 'security' && (
        <Stack gap="4">
          <Text size="sm" weight="semibold">Security</Text>
          <Row justify="between">
            <Stack gap="1">
              <Text size="sm" weight="medium">Two-factor auth</Text>
              <Text size="xs" color="secondary">Add an extra layer of security.</Text>
            </Stack>
            <Toggle />
          </Row>
          <FormField label="Current password" htmlFor="s-pass">
            <Input id="s-pass" type="password" size="sm" />
          </FormField>
          <Row gap="2" justify="end">
            <Button variant="primary" size="sm">Update password</Button>
          </Row>
        </Stack>
      )}
    </div>
  </Row>
</Card>`,
    },
  ],

  designNotes:
    'Each setting row uses Row with justify="between" to push the control to the far ' +
    'right. The label + description pair is a Stack with gap="1" for tight coupling. ' +
    'Dividers separate the header, settings body, and action footer into visual ' +
    'sections. The Select is constrained to a fixed width (120px) to prevent the row ' +
    'from shifting when option labels vary in length. Actions are right-aligned with ' +
    'a ghost Reset so it visually recedes next to the primary Save. ' +
    'The drill-down variant uses NavMenu as a left sidebar with a border-right separator. ' +
    'Card uses padding="none" so the nav and content pane each control their own padding. ' +
    'Row with align="stretch" ensures the nav border extends full height.',
};

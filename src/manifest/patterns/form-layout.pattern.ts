import type { CompositionPattern } from '../types.js';

export const PATTERN: CompositionPattern = {
  id: 'form-layout',
  name: 'Form Layout',
  description: 'Stacked form with grouped sections, FormField labels, validation hints, and a submit/cancel footer.',
  category: 'form',
  components: ['card', 'text', 'input', 'select', 'textarea', 'checkbox', 'button', 'stack', 'row', 'divider', 'form-field'],

  structure: `
Card (elevated, padding="lg")
└── Stack as="form" gap="6"
    ├── Stack gap="1"                        ← section header
    │   ├── Text (lg, semibold)              ← form title
    │   └── Text (sm, secondary)             ← description
    ├── Stack gap="4"                        ← field group 1
    │   ├── Row gap="4"                      ← side-by-side fields
    │   │   ├── FormField (label, required)
    │   │   │   └── Input
    │   │   └── FormField (label, required)
    │   │       └── Input
    │   ├── FormField (label)
    │   │   └── Input
    │   └── FormField (label)
    │       └── Select
    ├── Divider
    ├── Stack gap="4"                        ← field group 2
    │   ├── FormField (label)
    │   │   └── Textarea
    │   └── Checkbox (contained)
    └── Row gap="2" justify="end"            ← actions
        ├── Button (ghost)
        └── Button (primary)
  `.trim(),

  code: `<Card variant="elevated" padding="lg" style={{ width: 480 }}>
  <Stack as="form" gap="6">
    <Stack gap="1">
      <Text as="h2" size="lg" weight="semibold">Create project</Text>
      <Text size="sm" color="secondary">
        Fill in the details to set up your new project.
      </Text>
    </Stack>
    <Stack gap="4">
      <Row gap="4">
        <FormField label="First name" htmlFor="fname" required style={{ flex: 1 }}>
          <Input id="fname" placeholder="Jane" />
        </FormField>
        <FormField label="Last name" htmlFor="lname" required style={{ flex: 1 }}>
          <Input id="lname" placeholder="Doe" />
        </FormField>
      </Row>
      <FormField label="Email" htmlFor="email" helperText="We'll never share your email.">
        <Input id="email" type="email" placeholder="jane@example.com" />
      </FormField>
      <FormField label="Role" htmlFor="role">
        <Select
          id="role"
          placeholder="Select a role..."
          options={[
            { value: 'admin', label: 'Admin' },
            { value: 'editor', label: 'Editor' },
            { value: 'viewer', label: 'Viewer' },
          ]}
        />
      </FormField>
    </Stack>
    <Divider />
    <Stack gap="4">
      <FormField label="Bio" htmlFor="bio">
        <Textarea id="bio" placeholder="Tell us about yourself..." rows={3} />
      </FormField>
      <Checkbox label="I agree to the terms" contained />
    </Stack>
    <Row gap="2" justify="end">
      <Button variant="ghost">Cancel</Button>
      <Button variant="primary">Create</Button>
    </Row>
  </Stack>
</Card>`,

  variants: [
    {
      title: 'Inline form (no card)',
      code: `<Stack as="form" gap="4" style={{ maxWidth: 400 }}>
  <FormField label="Username" htmlFor="user" required helperText="Letters and numbers only, 3–20 chars.">
    <Input id="user" placeholder="yourname" />
  </FormField>
  <FormField label="Password" htmlFor="pass" required>
    <Input id="pass" type="password" />
  </FormField>
  <Button variant="primary">Sign in</Button>
</Stack>`,
    },
  ],

  designNotes:
    'The form uses Stack as="form" to render a semantic <form> element while keeping ' +
    'token-based vertical spacing. gap="6" between sections provides clear visual ' +
    'grouping; gap="4" within a section keeps fields tightly related. Side-by-side ' +
    'fields use Row with flex: 1 on each FormField so they share width equally. ' +
    'The Divider separates logical sections (identity fields vs. profile fields). ' +
    'Actions are right-aligned (justify="end") following the convention that the ' +
    'primary action is the rightmost button.',
};

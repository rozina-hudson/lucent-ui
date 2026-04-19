import type { CompositionPattern } from '../types.js';

export const PATTERN: CompositionPattern = {
  id: 'confirmation-dialog',
  name: 'Confirmation Dialog',
  description: 'Centered modal-style card for destructive action confirmations with danger button pairing. For delete/remove/reset flows.',
  category: 'action',
  components: ['card', 'icon', 'text', 'button', 'input', 'stack', 'row'],

  structure: `
Card (elevated, padding="lg", maxWidth=400)
└── Stack gap="8" align="center"
    ├── Icon (lg, danger color)               ← warning icon
    ├── Stack gap="1" align="center"
    │   ├── Text (lg, semibold, center)       ← "Delete project?"
    │   └── Text (sm, secondary, center)      ← consequence description
    └── Row gap="3"
        ├── Button (outline, full width)      ← "Cancel"
        └── Button (danger, full width)       ← "Delete"
  `.trim(),

  code: `<Card variant="elevated" padding="lg" style={{ maxWidth: 400 }}>
  <Stack gap="8" align="center">
    <Icon size="xl" color="var(--lucent-danger-text)"><AlertTriangle /></Icon>
    <Stack gap="1" align="center">
      <Text size="lg" weight="semibold">Delete project?</Text>
      <Text size="sm" color="secondary" align="center">This will permanently delete "Acme Corp" and all of its data. This action cannot be undone.</Text>
    </Stack>
    <Row gap="3" style={{ width: '100%' }}>
      <Button variant="outline" style={{ flex: 1 }}>Cancel</Button>
      <Button variant="danger" style={{ flex: 1 }}>Delete</Button>
    </Row>
  </Stack>
</Card>`,

  variants: [
    {
      title: 'With typed confirmation',
      code: `<Card variant="elevated" padding="lg" style={{ maxWidth: 400 }}>
  <Stack gap="8" align="center">
    <Icon size="xl" color="var(--lucent-danger-text)"><AlertTriangle /></Icon>
    <Stack gap="1" align="center">
      <Text size="lg" weight="semibold">Delete your account?</Text>
      <Text size="sm" color="secondary" align="center">All projects, data, and billing history will be permanently removed. Type DELETE to confirm.</Text>
    </Stack>
    <Input placeholder="Type DELETE to confirm" size="md" style={{ width: '100%' }} />
    <Row gap="3" style={{ width: '100%' }}>
      <Button variant="outline" style={{ flex: 1 }}>Cancel</Button>
      <Button variant="danger" style={{ flex: 1 }} disabled>Delete account</Button>
    </Row>
  </Stack>
</Card>`,
    },
    {
      title: 'Non-destructive confirmation',
      code: `<Card variant="elevated" padding="lg" style={{ maxWidth: 400 }}>
  <Stack gap="8" align="center">
    <Icon size="xl" color="var(--lucent-info-text)"><CircleInfo /></Icon>
    <Stack gap="1" align="center">
      <Text size="lg" weight="semibold">Publish changes?</Text>
      <Text size="sm" color="secondary" align="center">This will make your draft visible to all team members. You can unpublish later from settings.</Text>
    </Stack>
    <Row gap="3" style={{ width: '100%' }}>
      <Button variant="outline" style={{ flex: 1 }}>Keep as draft</Button>
      <Button variant="primary" style={{ flex: 1 }}>Publish</Button>
    </Row>
  </Stack>
</Card>`,
    },
  ],

  designNotes:
    'The centered layout with align="center" creates a focused, modal-like feel ' +
    'even though this is a Card, not a true modal. The warning Icon at the top ' +
    'provides an immediate visual signal of severity. The text stack uses gap="1" ' +
    'to tightly couple the title and consequence description. Buttons use flex: 1 ' +
    'inside a full-width Row so they split evenly — Cancel (outline) on the left, ' +
    'destructive action (danger) on the right, following the convention of placing ' +
    'the primary action on the right. The typed confirmation variant adds an Input ' +
    'between the text and buttons with the danger Button disabled until the user ' +
    'types the confirmation text. The non-destructive variant swaps the danger ' +
    'Button for primary and the warning Icon for info, reusing the same centered ' +
    'layout for any "are you sure?" flow.',
};

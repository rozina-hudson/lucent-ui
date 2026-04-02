import type { CompositionPattern } from '../types.js';

export const PATTERN: CompositionPattern = {
  id: 'bulk-action-bar',
  name: 'Bulk Action Bar',
  description: 'Sticky bar that appears when table rows are selected. Shows selection count, bulk action buttons, and a clear selection control.',
  category: 'action',
  components: ['checkbox', 'text', 'button', 'button-group', 'divider', 'row'],

  structure: `
Row gap="3" align="center" (surface background, padding=md)
├── Checkbox (indeterminate when partial)
├── Text (sm, semibold)              ← "3 selected"
├── Divider (vertical)
├── ButtonGroup
│   ├── Button (outline, sm)         ← "Export"
│   ├── Button (outline, sm)         ← "Archive"
│   └── Button (danger-outline, sm)  ← "Delete"
└── Row flex=1 justify="end"
    └── Button (ghost, sm)           ← "Clear selection"
  `.trim(),

  code: `<Row gap="3" align="center" style={{ padding: 'var(--lucent-space-3) var(--lucent-space-4)', background: 'var(--lucent-surface)', borderRadius: 'var(--lucent-radius-lg)', border: '1px solid var(--lucent-border-default)' }}>
  <Checkbox indeterminate checked onChange={() => {}} />
  <Text size="sm" weight="semibold">3 selected</Text>
  <Divider orientation="vertical" />
  <ButtonGroup>
    <Button variant="outline" size="sm">Export</Button>
    <Button variant="outline" size="sm">Archive</Button>
    <Button variant="danger-outline" size="sm">Delete</Button>
  </ButtonGroup>
  <Row style={{ flex: 1, justifyContent: 'flex-end' }}>
    <Button variant="ghost" size="sm">Clear selection</Button>
  </Row>
</Row>`,

  variants: [
    {
      title: 'Minimal (single action)',
      code: `<Row gap="3" align="center" style={{ padding: 'var(--lucent-space-3) var(--lucent-space-4)', background: 'var(--lucent-surface)', borderRadius: 'var(--lucent-radius-lg)', border: '1px solid var(--lucent-border-default)' }}>
  <Checkbox checked onChange={() => {}} />
  <Text size="sm" weight="semibold">12 selected</Text>
  <Row style={{ flex: 1, justifyContent: 'flex-end' }}>
    <Button variant="danger" size="sm">Delete selected</Button>
  </Row>
</Row>`,
    },
    {
      title: 'With count badge and secondary actions',
      code: `<Row gap="3" align="center" style={{ padding: 'var(--lucent-space-3) var(--lucent-space-4)', background: 'var(--lucent-surface)', borderRadius: 'var(--lucent-radius-lg)', border: '1px solid var(--lucent-border-default)' }}>
  <Checkbox indeterminate checked onChange={() => {}} />
  <Row gap="2" align="center">
    <Text size="sm" weight="semibold">5 of 24 selected</Text>
    <Button variant="ghost" size="xs">Select all</Button>
  </Row>
  <Divider orientation="vertical" />
  <Button variant="outline" size="sm">Assign label</Button>
  <Button variant="outline" size="sm">Move to</Button>
  <Button variant="danger-outline" size="sm">Delete</Button>
  <Row style={{ flex: 1, justifyContent: 'flex-end' }}>
    <Button variant="ghost" size="sm">Clear</Button>
  </Row>
</Row>`,
    },
  ],

  designNotes:
    'The bar uses a Row with center alignment so all elements sit on the same ' +
    'horizontal baseline. The Checkbox reflects selection state — indeterminate ' +
    'when some rows are selected, checked when all are. A vertical Divider ' +
    'visually separates the selection count from the action buttons. ButtonGroup ' +
    'clusters related actions with shared border radius. The danger-outline ' +
    'variant on the Delete button signals destructive intent without the visual ' +
    'weight of a filled danger button. The clear selection Button is pushed to ' +
    'the far right via flex: 1 on its wrapper Row, keeping it accessible but ' +
    'visually subordinate. The minimal variant drops the ButtonGroup and Divider ' +
    'for a simpler single-action layout.',
};

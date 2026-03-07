import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'table',
  name: 'Table',
  tier: 'atom',
  domain: 'neutral',
  specVersion: '0.1',

  description:
    'A lightweight, token-styled HTML table primitive with compound sub-components. ' +
    'Distinct from DataTable — no sorting, filtering, or pagination.',

  designIntent:
    'Use Table for static or lightly dynamic tabular data where full DataTable features ' +
    'are not needed — props tables, changelog entries, comparison grids, reference docs. ' +
    'The compound API (Table.Head, Table.Body, Table.Row, Table.Cell) maps directly to ' +
    'semantic HTML so screen readers get the full table structure. ' +
    'Horizontal overflow is handled automatically by a scroll wrapper.',

  props: [
    {
      name: 'striped',
      type: 'boolean',
      required: false,
      default: 'false',
      description: 'Applies alternating bgMuted backgrounds to even tbody rows.',
    },
    {
      name: 'Table.Head',
      type: 'component',
      required: false,
      description: 'Renders <thead> with bgMuted background. Accepts Table.Row children.',
    },
    {
      name: 'Table.Body',
      type: 'component',
      required: false,
      description: 'Renders <tbody>. Accepts Table.Row children.',
    },
    {
      name: 'Table.Foot',
      type: 'component',
      required: false,
      description: 'Renders <tfoot> with bgMuted background.',
    },
    {
      name: 'Table.Row',
      type: 'component',
      required: false,
      description: 'Renders <tr> with a hover highlight. Accepts Table.Cell children.',
    },
    {
      name: 'Table.Cell',
      type: 'component',
      required: false,
      description:
        'Renders <td> by default or <th scope="col"> when as="th". ' +
        'Header cells are semibold + secondary colour; data cells are regular + primary.',
    },
  ],

  usageExamples: [
    {
      title: 'Basic',
      code: `<Table>
  <Table.Head>
    <Table.Row>
      <Table.Cell as="th">Name</Table.Cell>
      <Table.Cell as="th">Role</Table.Cell>
    </Table.Row>
  </Table.Head>
  <Table.Body>
    <Table.Row>
      <Table.Cell>Alice</Table.Cell>
      <Table.Cell>Engineer</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>`,
    },
    {
      title: 'Striped',
      code: `<Table striped>
  <Table.Head>…</Table.Head>
  <Table.Body>…</Table.Body>
</Table>`,
    },
    {
      title: 'Custom cell content',
      code: `<Table.Cell>
  <Badge variant="success">Active</Badge>
</Table.Cell>`,
    },
  ],

  compositionGraph: [
    { componentId: 'table-head', componentName: 'Table.Head', role: 'head', required: false },
    { componentId: 'table-body', componentName: 'Table.Body', role: 'body', required: false },
    { componentId: 'table-foot', componentName: 'Table.Foot', role: 'foot', required: false },
    { componentId: 'table-row',  componentName: 'Table.Row',  role: 'row',  required: false },
    { componentId: 'table-cell', componentName: 'Table.Cell', role: 'cell', required: false },
  ],

  accessibility: {
    role: 'table',
    ariaAttributes: ['scope="col" on th cells'],
    keyboardInteractions: ['Standard browser table navigation'],
  },
};

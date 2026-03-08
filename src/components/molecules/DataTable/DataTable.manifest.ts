import type { ComponentManifest } from '../../../manifest/types.js';

export const COMPONENT_MANIFEST: ComponentManifest = {
  id: 'data-table',
  name: 'DataTable',
  tier: 'molecule',
  domain: 'neutral',
  specVersion: '1.0',

  description: 'A sortable, filterable, paginated data table with configurable columns, custom cell renderers, and keyboard-accessible pagination controls.',

  designIntent:
    'DataTable is generic over row type T so TypeScript consumers get full type safety on column keys and renderers. ' +
    'Sorting is client-side and composable — each column opts in via sortable:true; clicking a sorted column cycles asc → desc → unsorted. ' +
    'Filtering is per-column — each column opts in via filterable:true, which adds a dropdown button above the table. ' +
    'Each dropdown is searchable and multi-select: a search input filters the option list, and each option is a checkbox that toggles membership in the active set. ' +
    'Filtering uses set-membership: a row passes if its column value is included in the selected values array. ' +
    'A "Clear selection" link inside each dropdown clears that column; a "Clear all" button in the bar appears when any filter is active. ' +
    'Filter → sort → paginate is the fixed pipeline order; any filter change resets the page to 0. ' +
    'Pagination is either controlled (page prop + onPageChange) or uncontrolled (internal state). ' +
    'A pageSize of 0 disables pagination entirely, useful when the parent manages windowing. ' +
    'Row hover uses bg-subtle, not a border change, so the visual weight stays low for dense data views.',

  props: [
    {
      name: 'columns',
      type: 'array',
      required: true,
      description: 'Column definitions. Each column has a key, header, optional render function, optional sortable flag, optional filterable flag (renders a text filter input below the header), optional width, and optional text align.',
    },
    {
      name: 'rows',
      type: 'array',
      required: true,
      description: 'Array of data objects to display. The generic type T is inferred from this prop.',
    },
    {
      name: 'pageSize',
      type: 'number',
      required: false,
      default: '10',
      description: 'Number of rows per page. Set to 0 to disable pagination.',
    },
    {
      name: 'page',
      type: 'number',
      required: false,
      description: 'Controlled current page (0-indexed). When provided, the component is fully controlled.',
    },
    {
      name: 'onPageChange',
      type: 'function',
      required: false,
      description: 'Called with the new page index whenever the page changes (from pagination controls or after a sort/filter reset).',
    },
    {
      name: 'onFilterChange',
      type: 'function',
      required: false,
      description: 'Called with the current filter map (Record<string, string[]>) whenever any column filter changes. Keys are column keys; columns with no selection are omitted from the map.',
    },
    {
      name: 'emptyState',
      type: 'ReactNode',
      required: false,
      description: 'Content to render when rows is empty. Defaults to a "No data" text.',
    },
    {
      name: 'style',
      type: 'object',
      required: false,
      description: 'Inline style overrides for the outer wrapper.',
    },
  ],

  usageExamples: [
    {
      title: 'Basic sortable table',
      code: `<DataTable
  columns={[
    { key: 'name', header: 'Name', sortable: true },
    { key: 'role', header: 'Role', sortable: true },
    { key: 'status', header: 'Status', render: (row) => <Badge>{row.status}</Badge> },
  ]}
  rows={users}
/>`,
    },
    {
      title: 'Sortable + filterable table',
      code: `<DataTable
  columns={[
    { key: 'name', header: 'Name', sortable: true, filterable: true },
    { key: 'role', header: 'Role', filterable: true },
    { key: 'status', header: 'Status', render: (row) => <Badge>{row.status}</Badge> },
  ]}
  rows={users}
  onFilterChange={(filters) => console.log(filters)}
/>`,
    },
    {
      title: 'Controlled pagination',
      code: `const [page, setPage] = useState(0);
<DataTable
  columns={columns}
  rows={rows}
  pageSize={20}
  page={page}
  onPageChange={setPage}
/>`,
    },
    {
      title: 'No pagination',
      code: `<DataTable columns={columns} rows={rows} pageSize={0} />`,
    },
  ],

  compositionGraph: [
    { componentId: 'text', componentName: 'Text', role: 'Row count and empty state labels', required: false },
    { componentId: 'badge', componentName: 'Badge', role: 'Typical cell content for status columns', required: false },
  ],

  accessibility: {
    role: 'table',
    ariaAttributes: ['aria-label', 'aria-sort', 'aria-current'],
    keyboardInteractions: ['Tab to pagination controls', 'Enter/Space to activate buttons'],
    notes: 'Column headers with sortable:true are interactive buttons with aria-sort reflecting the current sort direction. Pagination buttons include aria-label and aria-current="page" for the active page.',
  },
};

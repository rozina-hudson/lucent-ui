import type { CompositionPattern } from '../types.js';

export const PATTERN: CompositionPattern = {
  id: 'search-filter-bar',
  name: 'Search / Filter Bar',
  description: 'Compact toolbar of filter molecules — FilterSearch, FilterSelect, FilterMultiSelect, FilterDateRange — with sort control and view toggle. Designed to sit above a DataTable or list.',
  category: 'dashboard',
  components: ['filter-search', 'filter-select', 'filter-multi-select', 'filter-date-range', 'segmented-control', 'row', 'text', 'button'],

  structure: `
Row gap="2" align="center" wrap
├── FilterSearch                            ← icon button, expands to Input
├── FilterSelect (label="Availability")     ← single-select dropdown
├── FilterMultiSelect (label="Status")      ← multi-select, stays open, count badge
├── FilterMultiSelect (label="Tags")        ← multi-select with swatch chips
├── FilterDateRange (label="Date range")    ← button trigger → calendar popover
├── Text + Button (ghost, "Clear all")      ← conditional result count row
├── flex spacer
└── Row gap="2" align="center"
    ├── FilterSelect (icon=sort, "Newest")  ← sort control
    └── SegmentedControl (grid/list icons)  ← view toggle
  `.trim(),

  code: `const [search, setSearch] = useState('');
const [statuses, setStatuses] = useState<string[]>([]);
const [tags, setTags] = useState<string[]>([]);
const [dateRange, setDateRange] = useState<DateRange | undefined>();

const hasFilters = statuses.length > 0 || tags.length > 0 || dateRange !== undefined;
const clearAll = () => { setStatuses([]); setTags([]); setDateRange(undefined); setSearch(''); };

<Row gap="2" align="center" wrap>
  <FilterSearch placeholder="Search…" value={search} onChange={setSearch} />

  <FilterSelect label="Availability" options={[
    { value: 'available', label: 'Available' },
    { value: 'notice', label: 'On notice' },
    { value: 'unavailable', label: 'Unavailable' },
  ]} />

  <FilterMultiSelect label="Status" options={[
    { value: 'active', label: 'Active' },
    { value: 'archived', label: 'Archived' },
    { value: 'on-hold', label: 'On hold' },
  ]} value={statuses} onChange={setStatuses} />

  <FilterMultiSelect label="Tags" options={[
    { value: 'react', label: 'React', swatch: '#3b82f6' },
    { value: 'devops', label: 'DevOps', swatch: '#10b981' },
    { value: 'data', label: 'Data Science', swatch: '#6366f1' },
  ]} value={tags} onChange={setTags} />

  <FilterDateRange label="Date range" value={dateRange} onChange={setDateRange} />

  <div style={{ flex: 1 }} />

  <Row gap="2" align="center">
    <FilterSelect label="Newest first" icon={<SortIcon />} options={[
      { value: 'newest', label: 'Newest first' },
      { value: 'oldest', label: 'Oldest first' },
      { value: 'name', label: 'Name A–Z' },
    ]} />
    <SegmentedControl size="sm" defaultValue="grid" options={[
      { value: 'grid', label: <GridIcon /> },
      { value: 'list', label: <ListIcon /> },
    ]} />
  </Row>
</Row>

{/* Result count between filter bar and DataTable */}
{hasFilters && (
  <Row gap="2" align="center">
    <Text size="sm" color="secondary">
      Showing {filteredRows.length} of {allRows.length} candidates
    </Text>
    <Button variant="ghost" size="xs" onClick={clearAll}>Clear all</Button>
  </Row>
)}`,

  variants: [
    {
      title: 'Minimal — search + sort only',
      code: `<Row gap="2" align="center">
  <FilterSearch placeholder="Search…" />
  <div style={{ flex: 1 }} />
  <FilterSelect label="Newest first" icon={<SortIcon />} options={sortOptions} />
</Row>`,
    },
    {
      title: 'With DataTable',
      code: `const [search, setSearch] = useState('');
const [statuses, setStatuses] = useState<string[]>([]);

const filtered = candidates.filter(c => {
  if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
  if (statuses.length > 0 && !statuses.includes(c.status.toLowerCase())) return false;
  return true;
});

<Stack gap="3">
  <Row gap="2" align="center" wrap>
    <FilterSearch placeholder="Search…" value={search} onChange={setSearch} />
    <FilterMultiSelect label="Status" options={statusOptions}
      value={statuses} onChange={setStatuses} />
  </Row>
  {statuses.length > 0 && (
    <Row gap="2" align="center">
      <Text size="sm" color="secondary">
        Showing {filtered.length} of {candidates.length}
      </Text>
      <Button variant="ghost" size="xs" onClick={() => setStatuses([])}>Clear all</Button>
    </Row>
  )}
  <DataTable columns={columns} rows={filtered} pageSize={5} />
</Stack>`,
    },
  ],

  designNotes:
    'Four dedicated filter molecules replace the previous boilerplate of manually wiring Menu open state, ' +
    'keepOpen hacks, count badges, and clear footers. FilterSearch collapses to a square icon-only button ' +
    'and expands on click. FilterSelect wraps Menu for single-select with a "Clear" footer. ' +
    'FilterMultiSelect builds its own portal dropdown (not Menu) so items toggle without closing — ' +
    'it renders Checkbox + optional Chip (with swatch) per option and an always-visible "Clear all" footer. ' +
    'FilterDateRange wraps DateRangePicker with the trigger prop to render a secondary Button. ' +
    'A flex spacer pushes sort and view controls to the right edge. ' +
    'Between the filter bar and DataTable, a conditional result count row shows ' +
    '"Showing X of Y" with a ghost "Clear all" button when filters are active.',
};

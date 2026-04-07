import type { CompositionPattern } from '../types.js';

export const PATTERN: CompositionPattern = {
  id: 'search-filter-panel',
  name: 'Search & Filter Panel',
  description:
    'Advanced filter panel inside a Collapsible disclosure — expands to reveal search, multiple filter groups (select, multi-select, date range), active filter chips, and apply/clear actions. More full-featured than Search / Filter Bar.',
  category: 'form',
  components: [
    'card',
    'collapsible',
    'search-input',
    'select',
    'multi-select',
    'date-range-picker',
    'chip',
    'button',
    'row',
    'stack',
    'divider',
  ],

  structure: `
Card
└── Collapsible (trigger="Filters" + active count badge)
    └── Stack gap="4"
        ├── SearchInput (full width)
        ├── Row gap="3" wrap
        │   ├── Select              ← category filter
        │   ├── MultiSelect         ← tags filter
        │   ├── DateRangePicker     ← date range filter
        │   └── Select              ← sort by
        ├── Row gap="2" wrap                     ← active filter chips
        │   └── Chip[] (onDismiss)               ← closable chips
        ├── Divider
        └── Row gap="3" justify="end"
            ├── Button (ghost)      ← "Clear all"
            └── Button (primary)    ← "Apply filters"
  `.trim(),

  code: `const [search, setSearch] = useState('');
const [category, setCategory] = useState('');
const [tags, setTags] = useState<string[]>([]);
const [dateRange, setDateRange] = useState<DateRange | undefined>();
const [sortBy, setSortBy] = useState('newest');

type ActiveFilter = { key: string; label: string; clear: () => void };

const activeFilters: ActiveFilter[] = [
  ...(category ? [{ key: 'category', label: \`Category: \${category}\`, clear: () => setCategory('') }] : []),
  ...tags.map(t => ({ key: \`tag-\${t}\`, label: t, clear: () => setTags(prev => prev.filter(v => v !== t)) })),
  ...(dateRange ? [{ key: 'date', label: \`\${dateRange.start} – \${dateRange.end}\`, clear: () => setDateRange(undefined) }] : []),
];

const clearAll = () => {
  setSearch('');
  setCategory('');
  setTags([]);
  setDateRange(undefined);
  setSortBy('newest');
};

<Card>
  <Collapsible
    trigger={
      <Row gap="2" align="center">
        <Text as="span" weight="medium">Filters</Text>
        {activeFilters.length > 0 && (
          <Badge variant="accent">{activeFilters.length}</Badge>
        )}
      </Row>
    }
  >
    <Stack gap="4">
      <SearchInput
        placeholder="Search items…"
        value={search}
        onChange={setSearch}
      />

      <Row gap="3" wrap>
        <Select
          label="Category"
          value={category}
          onChange={setCategory}
          options={[
            { value: 'design', label: 'Design' },
            { value: 'engineering', label: 'Engineering' },
            { value: 'marketing', label: 'Marketing' },
          ]}
        />
        <MultiSelect
          label="Tags"
          value={tags}
          onChange={setTags}
          options={[
            { value: 'react', label: 'React' },
            { value: 'typescript', label: 'TypeScript' },
            { value: 'figma', label: 'Figma' },
            { value: 'node', label: 'Node.js' },
          ]}
        />
        <DateRangePicker
          label="Date range"
          value={dateRange}
          onChange={setDateRange}
        />
        <Select
          label="Sort by"
          value={sortBy}
          onChange={setSortBy}
          options={[
            { value: 'newest', label: 'Newest first' },
            { value: 'oldest', label: 'Oldest first' },
            { value: 'name', label: 'Name A–Z' },
          ]}
        />
      </Row>

      {activeFilters.length > 0 && (
        <Row gap="2" wrap>
          {activeFilters.map(f => (
            <Chip key={f.key} size="sm" onDismiss={f.clear}>
              {f.label}
            </Chip>
          ))}
        </Row>
      )}

      <Divider />

      <Row gap="3" justify="end">
        <Button variant="ghost" onClick={clearAll}>Clear all</Button>
        <Button variant="primary" onClick={() => onApply({ search, category, tags, dateRange, sortBy })}>
          Apply filters
        </Button>
      </Row>
    </Stack>
  </Collapsible>
</Card>`,

  variants: [
    {
      title: 'Vertical stacked — sidebar / drawer layout',
      code: `<Card padding="lg" style={{ width: 320 }}>
  <Stack gap="4">
    <Text size="lg" weight="semibold">Filters</Text>

    <SearchInput placeholder="Search…" value={search} onChange={setSearch} />

    <Stack gap="3">
      <Select label="Category" value={category} onChange={setCategory} options={categoryOptions} />
      <MultiSelect label="Tags" value={tags} onChange={setTags} options={tagOptions} />
      <DateRangePicker label="Date range" value={dateRange} onChange={setDateRange} />
      <Select label="Sort by" value={sortBy} onChange={setSortBy} options={sortOptions} />
    </Stack>

    {activeFilters.length > 0 && (
      <>
        <Divider />
        <Stack gap="2">
          <Row gap="2" align="center" justify="between">
            <Text size="sm" weight="semibold">Active filters</Text>
            <Button variant="ghost" size="xs" onClick={clearAll}>Clear all</Button>
          </Row>
          <Row gap="2" wrap>
            {activeFilters.map(f => (
              <Chip key={f.key} size="sm" onDismiss={f.clear}>{f.label}</Chip>
            ))}
          </Row>
        </Stack>
      </>
    )}

    <Divider />

    <Button variant="primary" onClick={() => onApply({ search, category, tags, dateRange, sortBy })}>
      Apply filters
    </Button>
  </Stack>
</Card>`,
    },
  ],

  designNotes:
    'The panel lives inside a Collapsible disclosure so it stays collapsed by default and ' +
    'doesn\'t dominate the page. The trigger shows a "Filters" label plus an active-count Badge ' +
    'so users know filters are applied even when the panel is closed. When expanded, SearchInput ' +
    'spans full width for prominence, filter controls sit in a wrapping Row, and active filter ' +
    'chips appear conditionally with onDismiss to remove individual filters. The Divider separates ' +
    'filter controls from the action row. "Clear all" uses ghost variant to de-emphasize it next ' +
    'to the primary "Apply filters" button, both right-aligned via justify="end". The vertical ' +
    'variant uses a Stack for all filters (ideal for sidebars/drawers at ~320px) with its own ' +
    '"Active filters" label and clear button — no Collapsible needed since the panel is already ' +
    'in a constrained space.',
};

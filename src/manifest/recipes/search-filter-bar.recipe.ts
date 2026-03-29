import type { CompositionRecipe } from '../types.js';

export const RECIPE: CompositionRecipe = {
  id: 'search-filter-bar',
  name: 'Search / Filter Bar',
  description: 'Compact toolbar of secondary filter buttons with Menu popovers, collapsible search, multi-select tags, date range picker, sort control, and view toggle. Designed to sit above a DataTable or list.',
  category: 'dashboard',
  components: ['button', 'menu', 'chip', 'checkbox', 'date-range-picker', 'segmented-control', 'input', 'row'],

  structure: `
Row gap="2" align="center" wrap
├── Button (secondary, icon-only, search)  ← expands to Input on click
├── Menu                                   ← single-select filter
│   ├── trigger: Button (secondary, chevron, "Availability")
│   └── MenuItem[] (selected marks active)
├── Menu                                   ← multi-select status filter
│   ├── trigger: Button (secondary, chevron, "Status" + Chip count)
│   └── MenuItem[] (controlled open, stays open on toggle)
├── Menu                                   ← multi-select tags with chips
│   ├── trigger: Button (secondary, chevron, "Tags" + Chip count)
│   └── MenuItem[] > Row > Checkbox + Chip (swatch)
├── DateRangePicker                        ← trigger prop renders Button
│   └── trigger: Button (secondary, chevron, "Date range")
├── Button (ghost, "Clear all")            ← conditional, shown when filters active
├── flex spacer                            ← pushes sort/view to right
└── Row gap="2" align="center"             ← sort + view toggle
    ├── Menu
    │   ├── trigger: Button (secondary, chevron, leftIcon=sort, "Newest first")
    │   └── MenuItem[] (selected marks active sort)
    └── SegmentedControl (sm, grid/list icons)
  `.trim(),

  code: `const [searchOpen, setSearchOpen] = useState(false);
const [statuses, setStatuses] = useState<Set<string>>(new Set());
const [statusOpen, setStatusOpen] = useState(false);
const [tags, setTags] = useState<Set<string>>(new Set());
const [tagsOpen, setTagsOpen] = useState(false);
const [dateRange, setDateRange] = useState<DateRange | undefined>();

const toggleStatus = (s: string) => setStatuses(prev => {
  if (s === 'all') return new Set();
  const next = new Set(prev);
  if (next.has(s)) next.delete(s); else next.add(s);
  return next;
});
const toggleTag = (t: string) => setTags(prev => {
  const next = new Set(prev);
  if (next.has(t)) next.delete(t); else next.add(t);
  return next;
});
const hasFilters = statuses.size > 0 || tags.size > 0 || dateRange !== undefined;
const clearAll = () => { setStatuses(new Set()); setTags(new Set()); setDateRange(undefined); };

<Row gap="2" align="center" wrap>
  {/* Collapsible search */}
  {searchOpen ? (
    <Input placeholder="Search…" size="sm" style={{ width: 260 }} autoFocus
      onBlur={(e) => { if (!e.target.value) setSearchOpen(false); }} />
  ) : (
    <Button variant="secondary" size="sm" aria-label="Search"
      leftIcon={<SearchIcon />} />
  )}

  {/* Single-select filter */}
  <Menu trigger={<Button variant="secondary" size="sm" chevron>Availability</Button>} size="sm">
    <MenuItem selected onSelect={() => {}}>All</MenuItem>
    <MenuItem onSelect={() => {}}>Available</MenuItem>
    <MenuItem onSelect={() => {}}>On notice</MenuItem>
    <MenuItem onSelect={() => {}}>Unavailable</MenuItem>
  </Menu>

  {/* Multi-select status */}
  <Menu trigger={
    <Button variant="secondary" size="sm" chevron>
      Status{statuses.size > 0 && <Chip variant="accent" size="sm">{statuses.size}</Chip>}
    </Button>
  } size="sm" open={statusOpen} onOpenChange={setStatusOpen}>
    <MenuItem selected={statuses.size === 0}
      onSelect={() => { toggleStatus('all'); setStatusOpen(true); }}>All</MenuItem>
    <MenuSeparator />
    <MenuItem selected={statuses.has('active')}
      onSelect={() => { toggleStatus('active'); setStatusOpen(true); }}>Active</MenuItem>
    <MenuItem selected={statuses.has('archived')}
      onSelect={() => { toggleStatus('archived'); setStatusOpen(true); }}>Archived</MenuItem>
    <MenuItem selected={statuses.has('on-hold')}
      onSelect={() => { toggleStatus('on-hold'); setStatusOpen(true); }}>On hold</MenuItem>
  </Menu>

  {/* Multi-select tags with checkbox + chip */}
  <Menu trigger={
    <Button variant="secondary" size="sm" chevron>
      Tags{tags.size > 0 && <Chip variant="accent" size="sm">{tags.size}</Chip>}
    </Button>
  } size="sm" open={tagsOpen} onOpenChange={setTagsOpen}>
    <MenuItem onSelect={() => { toggleTag('data-science'); setTagsOpen(true); }}>
      <Row gap="2" align="center">
        <Checkbox checked={tags.has('data-science')} onChange={() => {}} />
        <Chip size="sm" swatch="#6366f1">Data Science</Chip>
      </Row>
    </MenuItem>
    <MenuItem onSelect={() => { toggleTag('devops'); setTagsOpen(true); }}>
      <Row gap="2" align="center">
        <Checkbox checked={tags.has('devops')} onChange={() => {}} />
        <Chip size="sm" swatch="#10b981">DevOps</Chip>
      </Row>
    </MenuItem>
  </Menu>

  {/* Date range with button trigger */}
  <DateRangePicker placeholder="Date range" size="sm"
    value={dateRange} onChange={setDateRange}
    trigger={<Button variant="secondary" size="sm" chevron>
      {dateRange ? formatRange(dateRange) : 'Date range'}
    </Button>} />

  {/* Clear all (conditional) */}
  {hasFilters && <Button variant="ghost" size="sm" onClick={clearAll}>Clear all</Button>}

  {/* Spacer */}
  <div style={{ flex: 1 }} />

  {/* Sort + view toggle */}
  <Row gap="2" align="center">
    <Menu trigger={
      <Button variant="secondary" size="sm" chevron leftIcon={<SortIcon />}>
        Newest first
      </Button>
    } size="sm">
      <MenuItem selected onSelect={() => {}}>Newest first</MenuItem>
      <MenuItem onSelect={() => {}}>Oldest first</MenuItem>
      <MenuItem onSelect={() => {}}>Name A–Z</MenuItem>
    </Menu>
    <SegmentedControl size="sm" defaultValue="grid" options={[
      { value: 'grid', label: <GridIcon /> },
      { value: 'list', label: <ListIcon /> },
    ]} />
  </Row>
</Row>`,

  variants: [
    {
      title: 'Minimal — search + sort only',
      code: `<Row gap="2" align="center">
  <Button variant="secondary" size="sm" aria-label="Search" leftIcon={<SearchIcon />} />
  <div style={{ flex: 1 }} />
  <Menu trigger={
    <Button variant="secondary" size="sm" chevron leftIcon={<SortIcon />}>
      Newest first
    </Button>
  } size="sm">
    <MenuItem selected onSelect={() => {}}>Newest first</MenuItem>
    <MenuItem onSelect={() => {}}>Oldest first</MenuItem>
    <MenuItem onSelect={() => {}}>Name A–Z</MenuItem>
  </Menu>
</Row>`,
    },
    {
      title: 'Pipeline — multi-select filters only',
      code: `<Row gap="2" align="center" wrap>
  <Menu trigger={
    <Button variant="secondary" size="sm" chevron>
      Opportunity{selectedOpp.size > 0 && <Chip variant="accent" size="sm">{selectedOpp.size}</Chip>}
    </Button>
  } size="sm" open={oppOpen} onOpenChange={setOppOpen}>
    <MenuItem selected={selectedOpp.size === 0}
      onSelect={() => { clearOpp(); setOppOpen(true); }}>All</MenuItem>
    <MenuSeparator />
    {opportunities.map(o => (
      <MenuItem key={o} selected={selectedOpp.has(o)}
        onSelect={() => { toggleOpp(o); setOppOpen(true); }}>{o}</MenuItem>
    ))}
  </Menu>
  <Menu trigger={
    <Button variant="secondary" size="sm" chevron>
      Stage{selectedStage.size > 0 && <Chip variant="accent" size="sm">{selectedStage.size}</Chip>}
    </Button>
  } size="sm" open={stageOpen} onOpenChange={setStageOpen}>
    <MenuItem selected={selectedStage.size === 0}
      onSelect={() => { clearStage(); setStageOpen(true); }}>All</MenuItem>
    <MenuSeparator />
    {stages.map(s => (
      <MenuItem key={s} selected={selectedStage.has(s)}
        onSelect={() => { toggleStage(s); setStageOpen(true); }}>{s}</MenuItem>
    ))}
  </Menu>
  {hasFilters && <Button variant="ghost" size="sm" onClick={clearAll}>Clear all</Button>}
</Row>`,
    },
  ],

  designNotes:
    'All filters use secondary buttons with chevron to create a uniform, compact toolbar. ' +
    'No visible input fields or select dropdowns — everything opens as a popover from the button trigger. ' +
    'Search starts as a square icon-only button (leftIcon with no children) and expands to an Input on click, ' +
    'collapsing back when blurred empty. Multi-select menus use controlled open state (open + onOpenChange) ' +
    'and re-set open=true in onSelect handlers so the menu stays open while toggling items. ' +
    'Active filter count is shown as an accent Chip inside the button label, not parenthesized text. ' +
    'Tags menu items combine Checkbox + Chip (with swatch colors) in a Row for rich multi-select visuals. ' +
    'DateRangePicker uses the trigger prop to render a Button instead of its default input-style trigger. ' +
    'A ghost "Clear all" button appears conditionally when any filter is active. ' +
    'A flex spacer pushes sort and view controls to the right edge. ' +
    'Sort button uses leftIcon for the sort icon. ' +
    'SegmentedControl with icon-only options (grid/list SVGs via label: ReactNode) provides view toggling.',
};

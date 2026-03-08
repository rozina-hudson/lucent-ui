import { useState, useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { Text } from '../../atoms/Text/index.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DataTableColumn<T> {
  key: string;
  header: ReactNode;
  /** Custom cell renderer — defaults to `String(row[key])` */
  render?: (row: T, index: number) => ReactNode;
  sortable?: boolean;
  /** Adds a searchable, multi-select dropdown filter above the table for this column */
  filterable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T extends object> {
  columns: DataTableColumn<T>[];
  rows: T[];
  /** Rows per page. Set to 0 to disable pagination. Default: 10 */
  pageSize?: number;
  /** Controlled current page (0-indexed) */
  page?: number;
  onPageChange?: (page: number) => void;
  /**
   * Called with the current filter map whenever any filter changes.
   * Keys are column keys; values are arrays of selected filter strings (empty arrays are omitted).
   */
  onFilterChange?: (filters: Record<string, string[]>) => void;
  /** Empty state slot */
  emptyState?: ReactNode;
  style?: CSSProperties;
}

type SortState = { key: string; dir: 'asc' | 'desc' };

// ─── Icons ────────────────────────────────────────────────────────────────────

function SortIcon({ state }: { state: 'asc' | 'desc' | 'none' }) {
  return (
    <svg
      width="12" height="12" viewBox="0 0 12 12" fill="none"
      aria-hidden
      style={{ flexShrink: 0, opacity: state === 'none' ? 0.35 : 1 }}
    >
      <path
        d="M6 2L9 5H3L6 2Z"
        fill="currentColor"
        opacity={state === 'desc' ? 0.35 : 1}
      />
      <path
        d="M6 10L3 7H9L6 10Z"
        fill="currentColor"
        opacity={state === 'asc' ? 0.35 : 1}
      />
    </svg>
  );
}

function ChevronIcon({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d={dir === 'left' ? 'M10 12L6 8l4-4' : 'M6 4l4 4-4 4'}
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DataTable<T extends object>({
  columns,
  rows,
  pageSize = 10,
  page: controlledPage,
  onPageChange,
  onFilterChange,
  emptyState,
  style,
}: DataTableProps<T>) {
  const [sort, setSort] = useState<SortState | null>(null);
  const [internalPage, setInternalPage] = useState(0);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [filters, setFilters] = useState<Record<string, string[]>>({});

  const isPageControlled = controlledPage !== undefined;
  const currentPage = isPageControlled ? controlledPage! : internalPage;

  const hasFilterableColumns = columns.some(c => c.filterable);

  // Filter (before sort)
  const filteredRows = hasFilterableColumns
    ? rows.filter(row => {
        return columns.every(col => {
          if (!col.filterable) return true;
          const term = filters[col.key];
          if (!term || term.length === 0) return true;
          const value = String((row as Record<string, unknown>)[col.key] ?? '');
          return term.includes(value);
        });
      })
    : rows;

  // Sort
  const sortedRows = sort
    ? [...filteredRows].sort((a, b) => {
        const av = (a as Record<string, unknown>)[sort.key];
        const bv = (b as Record<string, unknown>)[sort.key];
        const cmp = String(av ?? '').localeCompare(String(bv ?? ''), undefined, { numeric: true });
        return sort.dir === 'asc' ? cmp : -cmp;
      })
    : filteredRows;

  // Paginate
  const paginated = pageSize > 0
    ? sortedRows.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
    : sortedRows;
  const totalPages = pageSize > 0 ? Math.max(1, Math.ceil(sortedRows.length / pageSize)) : 1;

  const goToPage = (p: number) => {
    if (!isPageControlled) setInternalPage(p);
    onPageChange?.(p);
  };

  const handleSort = (key: string) => {
    setSort(prev => {
      if (!prev || prev.key !== key) return { key, dir: 'asc' };
      if (prev.dir === 'asc') return { key, dir: 'desc' };
      return null;
    });
    if (!isPageControlled) setInternalPage(0);
    onPageChange?.(0);
  };

  const handleFilter = (key: string, values: string[]) => {
    const next = { ...filters, [key]: values };
    if (values.length === 0) delete next[key];
    setFilters(next);
    if (!isPageControlled) setInternalPage(0);
    onPageChange?.(0);
    onFilterChange?.(next);
  };

  const handleClearAll = () => {
    setFilters({});
    if (!isPageControlled) setInternalPage(0);
    onPageChange?.(0);
    onFilterChange?.({});
  };

  // Page number range
  const pageButtons: (number | '…')[] = [];
  if (totalPages <= 7) {
    for (let i = 0; i < totalPages; i++) pageButtons.push(i);
  } else {
    pageButtons.push(0);
    if (currentPage > 2) pageButtons.push('…');
    for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages - 2, currentPage + 1); i++) {
      pageButtons.push(i);
    }
    if (currentPage < totalPages - 3) pageButtons.push('…');
    pageButtons.push(totalPages - 1);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lucent-space-3)', ...style }}>
      {/* Filter bar — position:relative + zIndex beats the table wrapper's overflow:auto stacking context */}
      {hasFilterableColumns && (
        <div style={{ position: 'relative', zIndex: 1 }}>
          <FilterBar
            columns={columns}
            rows={rows}
            filters={filters}
            onFilter={handleFilter}
            onClearAll={handleClearAll}
          />
        </div>
      )}

      {/* Table wrapper */}
      <div style={{
        overflowX: 'auto',
        borderRadius: 'var(--lucent-radius-lg)',
        border: '1px solid var(--lucent-border-default)',
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontFamily: 'var(--lucent-font-family-base)',
          fontSize: 'var(--lucent-font-size-sm)',
        }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--lucent-border-default)' }}>
              {columns.map(col => {
                const sortState: 'asc' | 'desc' | 'none' =
                  sort?.key === col.key ? sort.dir : 'none';
                return (
                  <th
                    key={col.key}
                    onClick={col.sortable ? () => handleSort(col.key) : undefined}
                    style={{
                      padding: 'var(--lucent-space-3) var(--lucent-space-4)',
                      textAlign: col.align ?? 'left',
                      fontWeight: 'var(--lucent-font-weight-medium)',
                      color: 'var(--lucent-text-secondary)',
                      background: 'var(--lucent-surface-secondary)',
                      borderBottom: '1px solid var(--lucent-border-default)',
                      cursor: col.sortable ? 'pointer' : 'default',
                      userSelect: 'none',
                      whiteSpace: 'nowrap',
                      ...(col.width ? { width: col.width } : {}),
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--lucent-space-1)' }}>
                      {col.header}
                      {col.sortable && <SortIcon state={sortState} />}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{ padding: 'var(--lucent-space-12)', textAlign: 'center' }}
                >
                  {emptyState ?? (
                    <Text color="secondary">No data</Text>
                  )}
                </td>
              </tr>
            ) : (
              paginated.map((row, i) => (
                <tr
                  key={i}
                  onMouseEnter={() => setHoveredRow(i)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    borderBottom: i < paginated.length - 1
                      ? '1px solid var(--lucent-border-subtle)'
                      : 'none',
                    background: hoveredRow === i
                      ? 'var(--lucent-surface-secondary)'
                      : 'var(--lucent-surface)',
                    transition: 'background var(--lucent-duration-fast) var(--lucent-easing-default)',
                  }}
                >
                  {columns.map(col => (
                    <td
                      key={col.key}
                      style={{
                        padding: 'var(--lucent-space-3) var(--lucent-space-4)',
                        color: 'var(--lucent-text-primary)',
                        textAlign: col.align ?? 'left',
                        verticalAlign: 'middle',
                      }}
                    >
                      {col.render
                        ? col.render(row, i)
                        : String((row as Record<string, unknown>)[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pageSize > 0 && sortedRows.length > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--lucent-space-3)',
          flexWrap: 'wrap',
        }}>
          <Text color="secondary" size="sm">
            {sortedRows.length === 0
              ? `0 rows${rows.length > 0 ? ` (filtered from ${rows.length})` : ''}`
              : sortedRows.length === 1
              ? `1 row${sortedRows.length < rows.length ? ` (filtered from ${rows.length})` : ''}`
              : `${currentPage * pageSize + 1}–${Math.min((currentPage + 1) * pageSize, sortedRows.length)} of ${sortedRows.length} rows${sortedRows.length < rows.length ? ` (filtered from ${rows.length})` : ''}`}
          </Text>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--lucent-space-1)' }}>
            <PaginationButton
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 0}
              aria-label="Previous page"
            >
              <ChevronIcon dir="left" />
            </PaginationButton>

            {pageButtons.map((p, i) =>
              p === '…' ? (
                <span key={`ellipsis-${i}`} style={{
                  padding: '0 var(--lucent-space-1)',
                  color: 'var(--lucent-text-disabled)',
                  fontSize: 'var(--lucent-font-size-sm)',
                }}>…</span>
              ) : (
                <PaginationButton
                  key={p}
                  onClick={() => goToPage(p)}
                  active={p === currentPage}
                  aria-label={`Page ${p + 1}`}
                  aria-current={p === currentPage ? 'page' : undefined}
                >
                  {p + 1}
                </PaginationButton>
              )
            )}

            <PaginationButton
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              aria-label="Next page"
            >
              <ChevronIcon dir="right" />
            </PaginationButton>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Filter bar ───────────────────────────────────────────────────────────────

function FilterBar<T extends object>({
  columns,
  rows,
  filters,
  onFilter,
  onClearAll,
}: {
  columns: DataTableColumn<T>[];
  rows: T[];
  filters: Record<string, string[]>;
  onFilter: (key: string, values: string[]) => void;
  onClearAll: () => void;
}) {
  const filterableColumns = columns.filter(c => c.filterable);
  const activeCount = Object.keys(filters).length;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--lucent-space-2)', flexWrap: 'wrap' }}>
      {filterableColumns.map(col => {
        const uniqueValues = Array.from(
          new Set(rows.map(row => String((row as Record<string, unknown>)[col.key] ?? '')))
        ).sort();
        return (
          <FilterDropdown
            key={col.key}
            label={col.header}
            values={uniqueValues}
            value={filters[col.key] ?? []}
            onChange={vals => onFilter(col.key, vals)}
          />
        );
      })}
      {activeCount > 0 && (
        <button
          onClick={onClearAll}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            height: 30,
            padding: '0 var(--lucent-space-2)',
            border: 'none',
            borderRadius: 'var(--lucent-radius-md)',
            background: 'transparent',
            color: 'var(--lucent-text-secondary)',
            fontFamily: 'var(--lucent-font-family-base)',
            fontSize: 'var(--lucent-font-size-xs)',
            cursor: 'pointer',
          }}
        >
          Clear all
        </button>
      )}
    </div>
  );
}

// ─── Filter dropdown ──────────────────────────────────────────────────────────

function FilterDropdown({
  label,
  values,
  value,
  onChange,
}: {
  label: ReactNode;
  values: string[];
  value: string[];
  onChange: (values: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const isActive = value.length > 0;

  useEffect(() => {
    if (!open) { setSearch(''); return; }
    setTimeout(() => searchRef.current?.focus(), 0);
    const onMouse = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onMouse);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onMouse);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const filtered = search
    ? values.filter(v => v.toLowerCase().includes(search.toLowerCase()))
    : values;

  const toggle = (v: string) =>
    onChange(value.includes(v) ? value.filter(x => x !== v) : [...value, v]);

  const suffix = value.length === 0 ? null
    : value.length === 1
      ? <span style={{ color: 'var(--lucent-text-secondary)', fontWeight: 'var(--lucent-font-weight-regular)' }}>: {value[0]}</span>
      : <span style={{ color: 'var(--lucent-accent-default)' }}>({value.length})</span>;

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--lucent-space-1)',
          height: 30,
          padding: '0 var(--lucent-space-3)',
          borderRadius: 'var(--lucent-radius-md)',
          border: `1px solid ${isActive ? 'var(--lucent-accent-default)' : hovered ? 'var(--lucent-border-strong)' : 'var(--lucent-border-default)'}`,
          background: isActive ? 'var(--lucent-accent-subtle)' : 'var(--lucent-surface)',
          color: isActive ? 'var(--lucent-accent-default)' : 'var(--lucent-text-primary)',
          fontFamily: 'var(--lucent-font-family-base)',
          fontSize: 'var(--lucent-font-size-xs)',
          fontWeight: isActive ? 'var(--lucent-font-weight-medium)' : 'var(--lucent-font-weight-regular)',
          cursor: 'pointer',
          outline: 'none',
          whiteSpace: 'nowrap',
          transition: 'border-color var(--lucent-duration-fast) var(--lucent-easing-default), background var(--lucent-duration-fast) var(--lucent-easing-default)',
        }}
      >
        {label}
        {suffix}
        <svg
          width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: `transform var(--lucent-duration-fast) var(--lucent-easing-default)` }}
        >
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 4px)',
          left: 0,
          minWidth: 180,
          maxHeight: 280,
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--lucent-surface)',
          border: '1px solid var(--lucent-border-default)',
          borderRadius: 'var(--lucent-radius-lg)',
          boxShadow: '0 4px 16px color-mix(in srgb, var(--lucent-text-primary) 8%, transparent)',
          zIndex: 50,
        }}>
          {/* Search */}
          <div style={{ padding: 'var(--lucent-space-2)', paddingBottom: 0 }}>
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search…"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                height: 26,
                padding: '0 var(--lucent-space-2)',
                borderRadius: 'var(--lucent-radius-md)',
                border: '1px solid var(--lucent-border-default)',
                background: 'var(--lucent-surface-secondary)',
                color: 'var(--lucent-text-primary)',
                fontFamily: 'var(--lucent-font-family-base)',
                fontSize: 'var(--lucent-font-size-xs)',
                outline: 'none',
              }}
            />
          </div>

          {/* Clear selection */}
          {value.length > 0 && (
            <div style={{ padding: 'var(--lucent-space-1) var(--lucent-space-2) 0' }}>
              <button
                onClick={() => onChange([])}
                style={{
                  display: 'inline-flex',
                  padding: '2px var(--lucent-space-2)',
                  border: 'none',
                  borderRadius: 'var(--lucent-radius-sm)',
                  background: 'transparent',
                  color: 'var(--lucent-text-secondary)',
                  fontFamily: 'var(--lucent-font-family-base)',
                  fontSize: 'var(--lucent-font-size-xs)',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Clear selection
              </button>
            </div>
          )}

          {/* Options */}
          <div style={{ overflowY: 'auto', padding: 'var(--lucent-space-1)', borderTop: '1px solid var(--lucent-border-subtle)', marginTop: 'var(--lucent-space-2)' }}>
            {filtered.length === 0 ? (
              <div style={{
                padding: 'var(--lucent-space-3)',
                color: 'var(--lucent-text-disabled)',
                fontFamily: 'var(--lucent-font-family-base)',
                fontSize: 'var(--lucent-font-size-xs)',
                textAlign: 'center',
              }}>
                No results
              </div>
            ) : (
              filtered.map(v => (
                <DropdownOption
                  key={v}
                  label={v}
                  isSelected={value.includes(v)}
                  onClick={() => toggle(v)}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function DropdownOption({ label, isSelected, onClick }: { label: string; isSelected: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--lucent-space-2)',
        width: '100%',
        textAlign: 'left',
        padding: 'var(--lucent-space-2) var(--lucent-space-3)',
        borderRadius: 'var(--lucent-radius-md)',
        border: 'none',
        background: hovered ? 'var(--lucent-surface-secondary)' : 'transparent',
        color: 'var(--lucent-text-primary)',
        fontFamily: 'var(--lucent-font-family-base)',
        fontSize: 'var(--lucent-font-size-xs)',
        fontWeight: isSelected ? 'var(--lucent-font-weight-medium)' : 'var(--lucent-font-weight-regular)',
        cursor: 'pointer',
        outline: 'none',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{
        flexShrink: 0,
        width: 14,
        height: 14,
        borderRadius: 'var(--lucent-radius-sm)',
        border: `1.5px solid ${isSelected ? 'var(--lucent-accent-default)' : 'var(--lucent-border-strong)'}`,
        background: isSelected ? 'var(--lucent-accent-default)' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'border-color var(--lucent-duration-fast), background var(--lucent-duration-fast)',
      }}>
        {isSelected && (
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden>
            <path d="M1 4L3 6L7 2" stroke="var(--lucent-text-on-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      {label}
    </button>
  );
}

// ─── Pagination button ────────────────────────────────────────────────────────

function PaginationButton({
  children,
  onClick,
  disabled,
  active,
  ...rest
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  'aria-label'?: string;
  'aria-current'?: 'page' | undefined;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      {...rest}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 32,
        height: 32,
        padding: '0 var(--lucent-space-2)',
        borderRadius: 'var(--lucent-radius-md)',
        border: active ? '1px solid var(--lucent-accent-default)' : '1px solid transparent',
        background: active
          ? 'var(--lucent-accent-default)'
          : hovered && !disabled
          ? 'var(--lucent-surface-secondary)'
          : 'transparent',
        color: active
          ? 'var(--lucent-text-on-accent)'
          : disabled
          ? 'var(--lucent-text-disabled)'
          : 'var(--lucent-text-primary)',
        fontSize: 'var(--lucent-font-size-sm)',
        fontFamily: 'var(--lucent-font-family-base)',
        fontWeight: 'var(--lucent-font-weight-regular)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background var(--lucent-duration-fast) var(--lucent-easing-default)',
      }}
    >
      {children}
    </button>
  );
}

import { useState, type CSSProperties, type ReactNode } from 'react';
import { Text } from '../../atoms/Text/index.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DataTableColumn<T> {
  key: string;
  header: ReactNode;
  /** Custom cell renderer — defaults to `String(row[key])` */
  render?: (row: T, index: number) => ReactNode;
  sortable?: boolean;
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
  emptyState,
  style,
}: DataTableProps<T>) {
  const [sort, setSort] = useState<SortState | null>(null);
  const [internalPage, setInternalPage] = useState(0);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const isPageControlled = controlledPage !== undefined;
  const currentPage = isPageControlled ? controlledPage! : internalPage;

  // Sort
  const sortedRows = sort
    ? [...rows].sort((a, b) => {
        const av = (a as Record<string, unknown>)[sort.key];
        const bv = (b as Record<string, unknown>)[sort.key];
        const cmp = String(av ?? '').localeCompare(String(bv ?? ''), undefined, { numeric: true });
        return sort.dir === 'asc' ? cmp : -cmp;
      })
    : rows;

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
                      background: 'var(--lucent-bg-subtle)',
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
                      ? 'var(--lucent-bg-subtle)'
                      : 'var(--lucent-surface-default)',
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
            {sortedRows.length === 1
              ? '1 row'
              : `${currentPage * pageSize + 1}–${Math.min((currentPage + 1) * pageSize, sortedRows.length)} of ${sortedRows.length} rows`}
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
          ? 'var(--lucent-bg-muted)'
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

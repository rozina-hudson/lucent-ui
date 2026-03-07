import { type HTMLAttributes, type TdHTMLAttributes, type ThHTMLAttributes } from 'react';

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  /** Applies alternating row backgrounds to tbody rows */
  striped?: boolean;
}

export type TableCellProps =
  | ({ as?: 'td' } & TdHTMLAttributes<HTMLTableCellElement>)
  | ({ as: 'th' } & ThHTMLAttributes<HTMLTableCellElement>);

const STYLES = `
.lucent-table-row:hover > td,
.lucent-table-row:hover > th {
  background: var(--lucent-bg-hover) !important;
}
.lucent-table-striped tbody .lucent-table-row:nth-child(even) > td,
.lucent-table-striped tbody .lucent-table-row:nth-child(even) > th {
  background: var(--lucent-bg-muted);
}
`;

function Head({ children, style, ...rest }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      style={{
        background: 'var(--lucent-bg-muted)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </thead>
  );
}

function Body({ children, ...rest }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...rest}>{children}</tbody>;
}

function Foot({ children, style, ...rest }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tfoot
      style={{
        background: 'var(--lucent-bg-muted)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </tfoot>
  );
}

function Row({ children, className, ...rest }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={['lucent-table-row', className].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </tr>
  );
}

function Cell({ as, children, style, ...rest }: TableCellProps) {
  const isHeader = as === 'th';
  const Tag = isHeader ? 'th' : 'td';

  const cellStyle: React.CSSProperties = {
    padding: 'var(--lucent-space-3) var(--lucent-space-4)',
    fontFamily: 'var(--lucent-font-family-base)',
    fontSize: 'var(--lucent-font-size-sm)',
    borderBottom: '1px solid var(--lucent-border-default)',
    textAlign: 'left',
    verticalAlign: 'middle',
    color: isHeader ? 'var(--lucent-text-secondary)' : 'var(--lucent-text-primary)',
    fontWeight: isHeader
      ? 'var(--lucent-font-weight-semibold)'
      : 'var(--lucent-font-weight-regular)',
    whiteSpace: isHeader ? 'nowrap' : undefined,
    ...style,
  };

  if (isHeader) {
    return (
      <th scope="col" style={cellStyle} {...(rest as ThHTMLAttributes<HTMLTableCellElement>)}>
        {children}
      </th>
    );
  }

  return (
    <td style={cellStyle} {...(rest as TdHTMLAttributes<HTMLTableCellElement>)}>
      {children}
    </td>
  );
}

function Table({ striped = false, children, className, style, ...rest }: TableProps) {
  const classes = [
    'lucent-table',
    striped && 'lucent-table-striped',
    className,
  ].filter(Boolean).join(' ');

  return (
    <>
      <style>{STYLES}</style>
      <div style={{ overflowX: 'auto', width: '100%' }}>
        <table
          className={classes}
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: 'var(--lucent-font-family-base)',
            fontSize: 'var(--lucent-font-size-sm)',
            ...style,
          }}
          {...rest}
        >
          {children}
        </table>
      </div>
    </>
  );
}

Table.Head = Head;
Table.Body = Body;
Table.Foot = Foot;
Table.Row = Row;
Table.Cell = Cell;

export { Table };

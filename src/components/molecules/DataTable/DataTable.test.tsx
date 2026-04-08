import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataTable, type DataTableColumn } from './DataTable';

interface TestRow {
  name: string;
  role: string;
  status: string;
}

const columns: DataTableColumn<TestRow>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'role', header: 'Role' },
  { key: 'status', header: 'Status', sortable: true, filterable: true },
];

const rows: TestRow[] = [
  { name: 'Alice', role: 'Engineer', status: 'Active' },
  { name: 'Bob', role: 'Designer', status: 'Active' },
  { name: 'Charlie', role: 'Manager', status: 'Inactive' },
  { name: 'Diana', role: 'Engineer', status: 'Active' },
  { name: 'Eve', role: 'Designer', status: 'Inactive' },
];

describe('DataTable', () => {
  it('renders a table with headers and rows', () => {
    render(<DataTable columns={columns} rows={rows} pageSize={0} />);
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
    expect(within(table).getByText('Name')).toBeInTheDocument();
    expect(within(table).getByText('Role')).toBeInTheDocument();
    expect(within(table).getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Eve')).toBeInTheDocument();
  });

  it('renders all rows when pageSize is 0 (no pagination)', () => {
    render(<DataTable columns={columns} rows={rows} pageSize={0} />);
    const tableRows = screen.getAllByRole('row');
    // 1 header + 5 data rows
    expect(tableRows).toHaveLength(6);
  });

  it('paginates rows by default (pageSize=10)', () => {
    render(<DataTable columns={columns} rows={rows} />);
    // All 5 fit on one page
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Eve')).toBeInTheDocument();
  });

  it('paginates when rows exceed pageSize', () => {
    render(<DataTable columns={columns} rows={rows} pageSize={2} />);
    // Page 1: Alice, Bob
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.queryByText('Charlie')).not.toBeInTheDocument();
  });

  it('navigates to next page', async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} rows={rows} pageSize={2} />);

    const nextButton = screen.getByLabelText('Next page');
    await user.click(nextButton);

    expect(screen.getByText('Charlie')).toBeInTheDocument();
    expect(screen.getByText('Diana')).toBeInTheDocument();
    expect(screen.queryByText('Alice')).not.toBeInTheDocument();
  });

  it('navigates to previous page', async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} rows={rows} pageSize={2} />);

    // Go to page 2
    await user.click(screen.getByLabelText('Next page'));
    expect(screen.getByText('Charlie')).toBeInTheDocument();

    // Go back to page 1
    await user.click(screen.getByLabelText('Previous page'));
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  it('disables previous button on first page', () => {
    render(<DataTable columns={columns} rows={rows} pageSize={2} />);
    expect(screen.getByLabelText('Previous page')).toBeDisabled();
  });

  it('disables next button on last page', async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} rows={rows} pageSize={2} />);

    // Go to last page (page 3)
    await user.click(screen.getByLabelText('Next page'));
    await user.click(screen.getByLabelText('Next page'));
    expect(screen.getByLabelText('Next page')).toBeDisabled();
  });

  it('sorts ascending then descending on header click', async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} rows={rows} pageSize={0} />);

    // Click the Name column header (th element, not the text span inside)
    const nameHeader = screen.getByText('Name').closest('th')!;
    await user.click(nameHeader);
    const cellsAsc = screen.getAllByRole('row').slice(1).map(row => within(row).getAllByRole('cell')[0]!.textContent);
    expect(cellsAsc).toEqual(['Alice', 'Bob', 'Charlie', 'Diana', 'Eve']);

    // Click again to sort descending
    await user.click(nameHeader);
    const cellsDesc = screen.getAllByRole('row').slice(1).map(row => within(row).getAllByRole('cell')[0]!.textContent);
    expect(cellsDesc).toEqual(['Eve', 'Diana', 'Charlie', 'Bob', 'Alice']);
  });

  it('clears sort on third click', async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} rows={rows} pageSize={0} />);

    const nameHeader = screen.getByText('Name').closest('th')!;
    await user.click(nameHeader); // asc
    await user.click(nameHeader); // desc
    await user.click(nameHeader); // clear

    const cells = screen.getAllByRole('row').slice(1).map(row => within(row).getAllByRole('cell')[0]!.textContent);
    expect(cells).toEqual(['Alice', 'Bob', 'Charlie', 'Diana', 'Eve']);
  });

  it('shows empty state when no rows', () => {
    render(<DataTable columns={columns} rows={[]} />);
    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  it('shows custom empty state', () => {
    render(<DataTable columns={columns} rows={[]} emptyState={<span>Nothing here</span>} />);
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  it('renders custom cell renderers', () => {
    const cols: DataTableColumn<TestRow>[] = [
      {
        key: 'name',
        header: 'Name',
        render: (row) => <strong data-testid="custom">{row.name}</strong>,
      },
    ];
    render(<DataTable columns={cols} rows={rows} pageSize={0} />);
    const customCells = screen.getAllByTestId('custom');
    expect(customCells).toHaveLength(5);
    expect(customCells[0]).toHaveTextContent('Alice');
  });

  it('calls onPageChange callback', async () => {
    const onPageChange = vi.fn();
    const user = userEvent.setup();
    render(<DataTable columns={columns} rows={rows} pageSize={2} onPageChange={onPageChange} />);

    await user.click(screen.getByLabelText('Next page'));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('supports controlled page', () => {
    const { rerender } = render(
      <DataTable columns={columns} rows={rows} pageSize={2} page={0} />
    );
    expect(screen.getByText('Alice')).toBeInTheDocument();

    rerender(<DataTable columns={columns} rows={rows} pageSize={2} page={1} />);
    expect(screen.getByText('Charlie')).toBeInTheDocument();
  });

  it('shows row count text', () => {
    render(<DataTable columns={columns} rows={rows} pageSize={2} />);
    expect(screen.getByText(/1–2 of 5 rows/)).toBeInTheDocument();
  });

  it('applies column width', () => {
    const cols: DataTableColumn<TestRow>[] = [
      { key: 'name', header: 'Name', width: '200px' },
    ];
    render(<DataTable columns={cols} rows={rows} pageSize={0} />);
    const th = screen.getByText('Name').closest('th');
    expect(th?.style.width).toBe('200px');
  });
});

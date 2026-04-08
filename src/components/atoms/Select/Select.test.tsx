import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './Select';

const options = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Gamma' },
];

describe('Select', () => {
  it('renders a select element with options', () => {
    render(<Select options={options} />);
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.getByText('Gamma')).toBeInTheDocument();
  });

  it('renders with a label linked by htmlFor', () => {
    render(<Select options={options} label="Country" id="country" />);
    expect(screen.getByLabelText('Country')).toBeInTheDocument();
  });

  it('auto-generates an id when none is provided', () => {
    render(<Select options={options} label="Pick" />);
    const select = screen.getByRole('combobox');
    expect(select.id).toMatch(/^lucent-select-/);
  });

  it('renders a placeholder as a disabled option', () => {
    render(<Select options={options} placeholder="Choose one" />);
    const placeholder = screen.getByText('Choose one');
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toBeDisabled();
  });

  it('fires onChange when value changes', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Select options={options} onChange={onChange} />);
    await user.selectOptions(screen.getByRole('combobox'), 'b');
    expect(onChange).toHaveBeenCalled();
  });

  it('displays the selected value', async () => {
    const user = userEvent.setup();
    render(<Select options={options} />);
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'b');
    expect(select).toHaveValue('b');
  });

  it('renders error text with role="alert" and sets aria-invalid', () => {
    render(<Select options={options} errorText="Required" id="sel" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Required');
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders helper text when there is no error', () => {
    render(<Select options={options} helperText="Pick one" />);
    expect(screen.getByText('Pick one')).toBeInTheDocument();
  });

  it('shows error instead of helper when both provided', () => {
    render(<Select options={options} helperText="Help" errorText="Error" />);
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.queryByText('Help')).not.toBeInTheDocument();
  });

  it('disables the select', () => {
    render(<Select options={options} disabled />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('supports disabled individual options', () => {
    const opts = [
      { value: 'x', label: 'Enabled' },
      { value: 'y', label: 'Disabled', disabled: true },
    ];
    render(<Select options={opts} />);
    expect(screen.getByText('Disabled')).toBeDisabled();
  });

  it('forwards ref to the select element', () => {
    const ref = { current: null as HTMLSelectElement | null };
    render(<Select ref={ref} options={options} />);
    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
  });

  it('sets aria-describedby for error', () => {
    render(<Select options={options} errorText="Bad" id="s" />);
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-describedby', 's-error');
  });

  it('sets aria-describedby for helper', () => {
    render(<Select options={options} helperText="Hint" id="s" />);
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-describedby', 's-helper');
  });
});

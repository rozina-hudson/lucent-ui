import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders with a label linked by htmlFor', () => {
    render(<Input label="Email" id="email" />);
    const input = screen.getByLabelText('Email');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'email');
  });

  it('auto-generates an id when none is provided', () => {
    render(<Input label="Name" />);
    const input = screen.getByRole('textbox');
    expect(input.id).toMatch(/^lucent-input-/);
  });

  it('accepts and displays a value', async () => {
    const user = userEvent.setup();
    render(<Input />);
    const input = screen.getByRole('textbox');
    await user.type(input, 'hello');
    expect(input).toHaveValue('hello');
  });

  it('calls onChange when typed into', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Input onChange={onChange} />);
    await user.type(screen.getByRole('textbox'), 'a');
    expect(onChange).toHaveBeenCalled();
  });

  it('renders helper text', () => {
    render(<Input helperText="Enter your email" id="test" />);
    expect(screen.getByText('Enter your email')).toBeInTheDocument();
  });

  it('renders error text with role="alert" and sets aria-invalid', () => {
    render(<Input errorText="Required" id="test" />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Required');
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('shows error text instead of helper text when both are provided', () => {
    render(<Input helperText="Help" errorText="Error" />);
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.queryByText('Help')).not.toBeInTheDocument();
  });

  it('sets aria-describedby to the error span', () => {
    render(<Input errorText="Bad" id="field" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby', 'field-error');
  });

  it('sets aria-describedby to the helper span when no error', () => {
    render(<Input helperText="Hint" id="field" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby', 'field-helper');
  });

  it('disables the input', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('renders prefix and suffix elements', () => {
    render(<Input prefix="$" suffix=".00" />);
    expect(screen.getByText('$')).toBeInTheDocument();
    expect(screen.getByText('.00')).toBeInTheDocument();
  });

  it('renders leftElement and rightElement', () => {
    render(
      <Input
        leftElement={<span data-testid="left">L</span>}
        rightElement={<span data-testid="right">R</span>}
      />
    );
    expect(screen.getByTestId('left')).toBeInTheDocument();
    expect(screen.getByTestId('right')).toBeInTheDocument();
  });

  it('forwards ref to the input element', () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('supports different input types', () => {
    render(<Input type="password" />);
    expect(document.querySelector('input[type="password"]')).toBeInTheDocument();
  });

  it('passes through native HTML attributes', () => {
    render(<Input placeholder="Type here" maxLength={50} />);
    const input = screen.getByPlaceholderText('Type here');
    expect(input).toHaveAttribute('maxLength', '50');
  });

  it('calls onFocus and onBlur', async () => {
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    const user = userEvent.setup();
    render(<Input onFocus={onFocus} onBlur={onBlur} />);
    const input = screen.getByRole('textbox');
    await user.click(input);
    expect(onFocus).toHaveBeenCalled();
    await user.tab();
    expect(onBlur).toHaveBeenCalled();
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('renders a textarea element', () => {
    render(<Textarea />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders with a label linked by htmlFor', () => {
    render(<Textarea label="Description" id="desc" />);
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
  });

  it('auto-generates an id', () => {
    render(<Textarea label="Notes" />);
    expect(screen.getByRole('textbox').id).toMatch(/^lucent-textarea-/);
  });

  it('accepts and displays a typed value', async () => {
    const user = userEvent.setup();
    render(<Textarea />);
    const textarea = screen.getByRole('textbox');
    await user.type(textarea, 'hello');
    expect(textarea).toHaveValue('hello');
  });

  it('calls onChange when typed into', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Textarea onChange={onChange} />);
    await user.type(screen.getByRole('textbox'), 'a');
    expect(onChange).toHaveBeenCalled();
  });

  it('renders error text with role="alert" and sets aria-invalid', () => {
    render(<Textarea errorText="Required" id="ta" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Required');
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders helper text', () => {
    render(<Textarea helperText="Max 500 chars" />);
    expect(screen.getByText('Max 500 chars')).toBeInTheDocument();
  });

  it('shows error instead of helper when both provided', () => {
    render(<Textarea helperText="Help" errorText="Error" />);
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.queryByText('Help')).not.toBeInTheDocument();
  });

  it('disables the textarea', () => {
    render(<Textarea disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('shows character count when showCount is true', () => {
    render(<Textarea value="hello" showCount onChange={() => {}} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('shows character count with maxLength', () => {
    render(<Textarea value="hi" maxLength={100} onChange={() => {}} />);
    expect(screen.getByText('2/100')).toBeInTheDocument();
  });

  it('sets aria-describedby for error', () => {
    render(<Textarea errorText="Bad" id="ta" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby', 'ta-error');
  });

  it('sets aria-describedby for helper', () => {
    render(<Textarea helperText="Hint" id="ta" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby', 'ta-helper');
  });

  it('forwards ref to the textarea element', () => {
    const ref = { current: null as HTMLTextAreaElement | null };
    render(<Textarea ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it('enforces maxLength attribute', () => {
    render(<Textarea maxLength={10} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('maxLength', '10');
  });
});

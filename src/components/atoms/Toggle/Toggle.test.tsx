import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toggle } from './Toggle';

// Hidden native inputs use pointer-events: none; clicks go through the label
const user = userEvent.setup({ pointerEventsCheck: 0 });

describe('Toggle', () => {
  it('renders a switch', () => {
    render(<Toggle />);
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('renders with a label', () => {
    render(<Toggle label="Dark mode" />);
    expect(screen.getByText('Dark mode')).toBeInTheDocument();
  });

  it('is unchecked by default', () => {
    render(<Toggle />);
    expect(screen.getByRole('switch')).not.toBeChecked();
  });

  it('toggles when clicked (uncontrolled)', async () => {

    render(<Toggle label="Toggle me" />);
    const toggle = screen.getByRole('switch');
    expect(toggle).not.toBeChecked();
    await user.click(toggle);
    expect(toggle).toBeChecked();
    await user.click(toggle);
    expect(toggle).not.toBeChecked();
  });

  it('supports controlled checked state', () => {
    const { rerender } = render(<Toggle checked={false} onChange={() => {}} />);
    expect(screen.getByRole('switch')).not.toBeChecked();
    rerender(<Toggle checked={true} onChange={() => {}} />);
    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('calls onChange when toggled', async () => {
    const onChange = vi.fn();

    render(<Toggle onChange={onChange} />);
    await user.click(screen.getByRole('switch'));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('supports defaultChecked', () => {
    render(<Toggle defaultChecked />);
    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('disables the toggle', () => {
    render(<Toggle disabled />);
    expect(screen.getByRole('switch')).toBeDisabled();
  });

  it('does not toggle when disabled', async () => {
    const onChange = vi.fn();

    render(<Toggle disabled onChange={onChange} />);
    await user.click(screen.getByRole('switch'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('sets aria-checked attribute', () => {
    const { rerender } = render(<Toggle checked={false} onChange={() => {}} />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
    rerender(<Toggle checked={true} onChange={() => {}} />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('renders helper text', () => {
    render(<Toggle label="Notifications" helperText="Get email alerts" />);
    expect(screen.getByText('Get email alerts')).toBeInTheDocument();
  });

  it('auto-generates an id', () => {
    render(<Toggle />);
    expect(screen.getByRole('switch').id).toMatch(/^lucent-toggle-/);
  });
});

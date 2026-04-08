import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Radio, RadioGroup, RadioGroupUncontrolled } from './Radio';

// Hidden native inputs use pointer-events: none; clicks go through the label
const user = userEvent.setup({ pointerEventsCheck: 0 });

describe('Radio', () => {
  it('renders a radio input', () => {
    render(<Radio value="a" name="test" />);
    expect(screen.getByRole('radio')).toBeInTheDocument();
  });

  it('renders with a label', () => {
    render(<Radio value="a" name="test" label="Option A" />);
    expect(screen.getByText('Option A')).toBeInTheDocument();
  });

  it('renders helper text', () => {
    render(<Radio value="a" name="test" label="A" helperText="Description" />);
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('can be checked standalone', () => {
    render(<Radio value="a" name="test" checked onChange={() => {}} />);
    expect(screen.getByRole('radio')).toBeChecked();
  });

  it('disables the radio', () => {
    render(<Radio value="a" name="test" disabled />);
    expect(screen.getByRole('radio')).toBeDisabled();
  });

  it('calls onChange when clicked', async () => {
    const onChange = vi.fn();

    render(<Radio value="a" name="test" onChange={onChange} />);
    await user.click(screen.getByRole('radio'));
    expect(onChange).toHaveBeenCalled();
  });

  it('auto-generates an id', () => {
    render(<Radio value="a" name="test" />);
    expect(screen.getByRole('radio').id).toMatch(/^lucent-radio-/);
  });
});

describe('RadioGroup', () => {
  it('renders a radiogroup with radios', () => {
    render(
      <RadioGroup name="color" value="red" onChange={() => {}}>
        <Radio value="red" label="Red" />
        <Radio value="blue" label="Blue" />
      </RadioGroup>
    );
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(2);
  });

  it('checks the radio matching the group value', () => {
    render(
      <RadioGroup name="color" value="blue" onChange={() => {}}>
        <Radio value="red" label="Red" />
        <Radio value="blue" label="Blue" />
      </RadioGroup>
    );
    expect(screen.getByLabelText('Red')).not.toBeChecked();
    expect(screen.getByLabelText('Blue')).toBeChecked();
  });

  it('calls onChange with the selected value', async () => {
    const onChange = vi.fn();

    render(
      <RadioGroup name="color" value="red" onChange={onChange}>
        <Radio value="red" label="Red" />
        <Radio value="blue" label="Blue" />
      </RadioGroup>
    );
    await user.click(screen.getByLabelText('Blue'));
    expect(onChange).toHaveBeenCalledWith('blue');
  });

  it('disables all radios when group is disabled', () => {
    render(
      <RadioGroup name="color" value="red" onChange={() => {}} disabled>
        <Radio value="red" label="Red" />
        <Radio value="blue" label="Blue" />
      </RadioGroup>
    );
    screen.getAllByRole('radio').forEach(radio => {
      expect(radio).toBeDisabled();
    });
  });

  it('sets aria-label on the radiogroup', () => {
    render(
      <RadioGroup name="color" value="red" onChange={() => {}} label="Pick a color">
        <Radio value="red" label="Red" />
      </RadioGroup>
    );
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-label', 'Pick a color');
  });

  it('renders horizontally', () => {
    render(
      <RadioGroup name="color" value="red" onChange={() => {}} orientation="horizontal">
        <Radio value="red" label="Red" />
        <Radio value="blue" label="Blue" />
      </RadioGroup>
    );
    const group = screen.getByRole('radiogroup');
    expect(group.style.flexDirection).toBe('row');
  });
});

describe('RadioGroupUncontrolled', () => {
  it('manages its own value state', async () => {

    render(
      <RadioGroupUncontrolled name="fruit" defaultValue="apple">
        <Radio value="apple" label="Apple" />
        <Radio value="banana" label="Banana" />
      </RadioGroupUncontrolled>
    );
    expect(screen.getByLabelText('Apple')).toBeChecked();
    await user.click(screen.getByLabelText('Banana'));
    expect(screen.getByLabelText('Banana')).toBeChecked();
    expect(screen.getByLabelText('Apple')).not.toBeChecked();
  });

  it('calls onChange callback when value changes', async () => {
    const onChange = vi.fn();

    render(
      <RadioGroupUncontrolled name="fruit" onChange={onChange}>
        <Radio value="apple" label="Apple" />
        <Radio value="banana" label="Banana" />
      </RadioGroupUncontrolled>
    );
    await user.click(screen.getByLabelText('Banana'));
    expect(onChange).toHaveBeenCalledWith('banana');
  });
});

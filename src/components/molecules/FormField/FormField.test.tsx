import { render, screen } from '@testing-library/react';
import { FormField } from './FormField';

describe('FormField', () => {
  it('renders children', () => {
    render(
      <FormField>
        <input data-testid="child" />
      </FormField>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders a label', () => {
    render(
      <FormField label="Email">
        <input />
      </FormField>
    );
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('connects label to input via htmlFor', () => {
    render(
      <FormField label="Email" htmlFor="email-input">
        <input id="email-input" />
      </FormField>
    );
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('shows required asterisk', () => {
    render(
      <FormField label="Name" required>
        <input />
      </FormField>
    );
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('hides asterisk from screen readers', () => {
    render(
      <FormField label="Name" required>
        <input />
      </FormField>
    );
    expect(screen.getByText('*').closest('[aria-hidden="true"]')).toBeInTheDocument();
  });

  it('renders helper text', () => {
    render(
      <FormField helperText="Enter your email address">
        <input />
      </FormField>
    );
    expect(screen.getByText('Enter your email address')).toBeInTheDocument();
  });

  it('renders error message', () => {
    render(
      <FormField errorMessage="This field is required">
        <input />
      </FormField>
    );
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('shows error message instead of helper text when both provided', () => {
    render(
      <FormField helperText="Help" errorMessage="Error">
        <input />
      </FormField>
    );
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.queryByText('Help')).not.toBeInTheDocument();
  });

  it('does not render label section when no label provided', () => {
    const { container } = render(
      <FormField>
        <input />
      </FormField>
    );
    expect(container.querySelector('label')).not.toBeInTheDocument();
  });

  it('does not render sub-text when neither helper nor error provided', () => {
    const { container } = render(
      <FormField label="Name">
        <input />
      </FormField>
    );
    // Only label and input, no extra text spans
    const divs = container.querySelectorAll('div');
    // Outer wrapper + label row = 2 divs
    expect(divs.length).toBe(2);
  });
});

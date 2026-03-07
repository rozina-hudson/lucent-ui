import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

export type InputType =
  | 'text'
  | 'number'
  | 'password'
  | 'email'
  | 'tel'
  | 'url'
  | 'search'
  | 'color';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  type?: InputType;
  label?: string;
  helperText?: string;
  errorText?: string;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, errorText, leftElement, rightElement, id, style, ...rest }, ref) => {
    const inputId = id ?? `lucent-input-${Math.random().toString(36).slice(2, 7)}`;
    const hasError = Boolean(errorText);
    const isDisabled = Boolean(rest.disabled);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lucent-space-1)', width: '100%' }}>
        {label && (
          <label
            htmlFor={inputId}
            style={{
              fontSize: 'var(--lucent-font-size-sm)',
              fontWeight: 'var(--lucent-font-weight-medium)',
              color: 'var(--lucent-text-primary)',
              fontFamily: 'var(--lucent-font-family-base)',
            }}
          >
            {label}
          </label>
        )}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          {leftElement && (
            <span style={{
              position: 'absolute', left: 'var(--lucent-space-3)',
              color: isDisabled ? 'var(--lucent-text-disabled)' : 'var(--lucent-text-secondary)',
              display: 'flex', alignItems: 'center',
              pointerEvents: 'none',
            }}>
              {leftElement}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            style={{
              width: '100%',
              height: '40px',
              padding: `0 ${rightElement ? 'var(--lucent-space-10)' : 'var(--lucent-space-3)'} 0 ${leftElement ? 'var(--lucent-space-10)' : 'var(--lucent-space-3)'}`,
              fontSize: 'var(--lucent-font-size-md)',
              fontFamily: 'var(--lucent-font-family-base)',
              color: isDisabled ? 'var(--lucent-text-disabled)' : 'var(--lucent-text-primary)',
              background: isDisabled ? 'var(--lucent-bg-muted)' : 'var(--lucent-surface-default)',
              border: `1px solid ${isDisabled ? 'transparent' : hasError ? 'var(--lucent-danger-default)' : 'var(--lucent-border-default)'}`,
              cursor: isDisabled ? 'not-allowed' : undefined,
              borderRadius: 'var(--lucent-radius-lg)',
              outline: 'none',
              boxSizing: 'border-box',
              transition: `border-color var(--lucent-duration-fast) var(--lucent-easing-default)`,
              ...style,
            }}
            onMouseEnter={(e) => {
              if (!rest.disabled && e.currentTarget !== document.activeElement) {
                e.currentTarget.style.borderColor = hasError
                  ? 'var(--lucent-danger-default)'
                  : 'var(--lucent-border-strong)';
              }
              rest.onMouseEnter?.(e);
            }}
            onMouseLeave={(e) => {
              if (!rest.disabled && e.currentTarget !== document.activeElement) {
                e.currentTarget.style.borderColor = hasError
                  ? 'var(--lucent-danger-default)'
                  : 'var(--lucent-border-default)';
              }
              rest.onMouseLeave?.(e);
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = hasError
                ? 'var(--lucent-danger-default)'
                : 'var(--lucent-focus-ring)';
              e.currentTarget.style.boxShadow = `0 0 0 3px ${hasError ? 'var(--lucent-danger-subtle)' : 'var(--lucent-accent-subtle)'}`;
              rest.onFocus?.(e);
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = hasError
                ? 'var(--lucent-danger-default)'
                : 'var(--lucent-border-default)';
              e.currentTarget.style.boxShadow = 'none';
              rest.onBlur?.(e);
            }}
            {...rest}
          />
          {rightElement && (
            <span style={{
              position: 'absolute', right: 'var(--lucent-space-3)',
              color: isDisabled ? 'var(--lucent-text-disabled)' : 'var(--lucent-text-secondary)',
              display: 'flex', alignItems: 'center',
            }}>
              {rightElement}
            </span>
          )}
        </div>
        {hasError && (
          <span
            id={`${inputId}-error`}
            role="alert"
            style={{
              fontSize: 'var(--lucent-font-size-sm)',
              color: 'var(--lucent-danger-text)',
              fontFamily: 'var(--lucent-font-family-base)',
            }}
          >
            {errorText}
          </span>
        )}
        {!hasError && helperText && (
          <span
            id={`${inputId}-helper`}
            style={{
              fontSize: 'var(--lucent-font-size-sm)',
              color: 'var(--lucent-text-secondary)',
              fontFamily: 'var(--lucent-font-family-base)',
            }}
          >
            {helperText}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

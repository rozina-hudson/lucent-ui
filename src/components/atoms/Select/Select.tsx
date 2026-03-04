import { forwardRef, type SelectHTMLAttributes } from 'react';

export type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options: SelectOption[];
  size?: SelectSize;
  label?: string;
  helperText?: string;
  errorText?: string;
  placeholder?: string;
}

const sizeHeights: Record<SelectSize, string> = {
  sm: '32px',
  md: '40px',
  lg: '46px',
};

const sizeFonts: Record<SelectSize, string> = {
  sm: 'var(--lucent-font-size-sm)',
  md: 'var(--lucent-font-size-md)',
  lg: 'var(--lucent-font-size-lg)',
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, size = 'md', label, helperText, errorText, placeholder, disabled, id, style, ...rest }, ref) => {
    const selectId = id ?? `lucent-select-${Math.random().toString(36).slice(2, 7)}`;
    const hasError = Boolean(errorText);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lucent-space-1)', width: '100%' }}>
        {label && (
          <label
            htmlFor={selectId}
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
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined
            }
            style={{
              width: '100%',
              height: sizeHeights[size],
              padding: `0 var(--lucent-space-8) 0 var(--lucent-space-3)`,
              fontSize: sizeFonts[size],
              fontFamily: 'var(--lucent-font-family-base)',
              color: 'var(--lucent-text-primary)',
              background: 'var(--lucent-surface-default)',
              border: `1px solid ${hasError ? 'var(--lucent-danger-default)' : 'var(--lucent-border-default)'}`,
              borderRadius: 'var(--lucent-radius-lg)',
              outline: 'none',
              boxSizing: 'border-box',
              appearance: 'none',
              cursor: disabled ? 'not-allowed' : 'pointer',
              transition: `border-color var(--lucent-duration-fast) var(--lucent-easing-default)`,
              ...style,
            }}
            onMouseEnter={(e) => {
              if (!disabled && e.currentTarget !== document.activeElement) {
                e.currentTarget.style.borderColor = hasError
                  ? 'var(--lucent-danger-default)'
                  : 'var(--lucent-border-strong)';
              }
              rest.onMouseEnter?.(e);
            }}
            onMouseLeave={(e) => {
              if (!disabled && e.currentTarget !== document.activeElement) {
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
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
          {/* Chevron */}
          <span
            aria-hidden
            style={{
              position: 'absolute',
              right: 'var(--lucent-space-3)',
              pointerEvents: 'none',
              color: 'var(--lucent-text-secondary)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </div>
        {hasError && (
          <span
            id={`${selectId}-error`}
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
            id={`${selectId}-helper`}
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

Select.displayName = 'Select';

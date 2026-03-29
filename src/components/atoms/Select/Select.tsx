import { forwardRef, useState, type SelectHTMLAttributes } from 'react';

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

const sizeH: Record<SelectSize, string> = {
  sm: 'calc(var(--lucent-space-8) * 0.5 + 16px)',
  md: 'calc(var(--lucent-space-10) * 0.5 + 20px)',
  lg: 'calc(var(--lucent-space-12) * 0.5 + 24px)',
};

const sizeFont: Record<SelectSize, string> = {
  sm: 'var(--lucent-font-size-sm)',
  md: 'var(--lucent-font-size-md)',
  lg: 'var(--lucent-font-size-md)',
};

const sizeLabelFont: Record<SelectSize, string> = {
  sm: 'var(--lucent-font-size-sm)',
  md: 'var(--lucent-font-size-sm)',
  lg: 'var(--lucent-font-size-md)',
};

const sizePx: Record<SelectSize, string> = {
  sm: 'var(--lucent-space-2)',
  md: 'var(--lucent-space-3)',
  lg: 'var(--lucent-space-3)',
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, size = 'md', label, helperText, errorText, placeholder, disabled, id, style, ...rest }, ref) => {
    const selectId = id ?? `lucent-select-${Math.random().toString(36).slice(2, 7)}`;
    const hasError = Boolean(errorText);
    const isDisabled = Boolean(disabled);

    const [isFocused, setIsFocused] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const borderColor = isDisabled
      ? 'transparent'
      : hasError
        ? 'var(--lucent-danger-default)'
        : isFocused
          ? 'var(--lucent-accent-border)'
          : isHovered
            ? 'var(--lucent-border-strong)'
            : 'var(--lucent-border-default)';

    const boxShadow = isFocused
      ? `0 0 0 3px ${hasError ? 'var(--lucent-danger-subtle)' : 'var(--lucent-accent-subtle)'}`
      : 'none';

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lucent-space-1)', width: '100%', ...style }}>
        {label && (
          <label
            htmlFor={selectId}
            style={{
              fontSize: sizeLabelFont[size],
              fontWeight: 'var(--lucent-font-weight-medium)',
              color: isDisabled ? 'var(--lucent-text-disabled)' : 'var(--lucent-text-primary)',
              fontFamily: 'var(--lucent-font-family-base)',
            }}
          >
            {label}
          </label>
        )}

        {/* Field wrapper — owns the border, focus ring, and height (matches Input) */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            height: sizeH[size],
            border: `1px solid ${borderColor}`,
            borderRadius: 'var(--lucent-radius-lg)',
            boxShadow,
            background: isDisabled ? 'color-mix(in srgb, var(--lucent-text-primary) 6%, transparent)' : 'var(--lucent-surface)',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            transition: [
              `border-color var(--lucent-duration-fast) var(--lucent-easing-default)`,
              `box-shadow var(--lucent-duration-fast) var(--lucent-easing-default)`,
            ].join(', '),
          }}
          onMouseEnter={() => { if (!isDisabled) setIsHovered(true); }}
          onMouseLeave={() => setIsHovered(false)}
        >
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
              height: '100%',
              padding: `0 var(--lucent-space-8) 0 ${sizePx[size]}`,
              fontSize: sizeFont[size],
              fontFamily: 'var(--lucent-font-family-base)',
              color: isDisabled ? 'var(--lucent-text-disabled)' : 'var(--lucent-text-primary)',
              background: 'transparent',
              border: 'none',
              borderRadius: 'var(--lucent-radius-lg)',
              outline: 'none',
              appearance: 'none',
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => {
              if (!isDisabled) setIsFocused(true);
              rest.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              rest.onBlur?.(e);
            }}
            onMouseDown={() => { if (!isDisabled) setIsFocused(true); }}
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
              right: sizePx[size],
              pointerEvents: 'none',
              color: isDisabled ? 'var(--lucent-text-disabled)' : 'var(--lucent-text-secondary)',
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
              fontSize: sizeLabelFont[size],
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
              fontSize: sizeLabelFont[size],
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

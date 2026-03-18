import { forwardRef, useState, type InputHTMLAttributes, type ReactNode } from 'react';

export type InputType =
  | 'text'
  | 'number'
  | 'password'
  | 'email'
  | 'tel'
  | 'url'
  | 'search'
  | 'color';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  type?: InputType;
  size?: InputSize;
  label?: string;
  helperText?: string;
  errorText?: string;
  /** Icon/element floated inside the left edge — does not resize the field */
  leftElement?: ReactNode;
  /** Icon/element floated inside the right edge — does not resize the field */
  rightElement?: ReactNode;
  /** Inset label attached to the left of the field (e.g. "$", "https://") */
  prefix?: ReactNode;
  /** Inset label attached to the right of the field (e.g. "kg", ".com") */
  suffix?: ReactNode;
}

// Heights use calc to dampen vertical scaling (50% spacing token + 50% fixed)
const sizeH:    Record<InputSize, string> = {
  sm: 'calc(var(--lucent-space-8) * 0.5 + 16px)',
  md: 'calc(var(--lucent-space-10) * 0.5 + 20px)',
  lg: 'calc(var(--lucent-space-12) * 0.5 + 24px)',
};
const sizeFont: Record<InputSize, string> = {
  sm: 'var(--lucent-font-size-sm)',
  md: 'var(--lucent-font-size-md)',
  lg: 'var(--lucent-font-size-md)',
};
const sizeLabelFont: Record<InputSize, string> = {
  sm: 'var(--lucent-font-size-sm)',
  md: 'var(--lucent-font-size-sm)',
  lg: 'var(--lucent-font-size-md)',
};
const sizePx:   Record<InputSize, string> = {
  sm: 'var(--lucent-space-3)',
  md: 'var(--lucent-space-4)',
  lg: 'var(--lucent-space-4)',
};
// Left padding when an icon is present (icon position + icon width + gap)
const sizeIconPad: Record<InputSize, string> = {
  sm: 'calc(var(--lucent-space-3) + 14px + var(--lucent-space-2))',
  md: 'calc(var(--lucent-space-4) + 18px + var(--lucent-space-2))',
  lg: 'calc(var(--lucent-space-4) + 20px + var(--lucent-space-3))',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = 'md',
      label,
      helperText,
      errorText,
      leftElement,
      rightElement,
      prefix,
      suffix,
      id,
      style,
      ...rest
    },
    ref,
  ) => {
    const inputId = id ?? `lucent-input-${Math.random().toString(36).slice(2, 7)}`;
    const hasError  = Boolean(errorText);
    const isDisabled = Boolean(rest.disabled);

    const [isFocused, setIsFocused] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const borderColor = isDisabled
      ? 'transparent'
      : hasError
        ? 'var(--lucent-danger-default)'
        : isFocused
          ? 'var(--lucent-focus-ring)'
          : isHovered
            ? 'var(--lucent-border-strong)'
            : 'var(--lucent-border-default)';

    const boxShadow = isFocused
      ? `0 0 0 3px ${hasError ? 'var(--lucent-danger-subtle)' : 'var(--lucent-accent-subtle)'}`
      : 'none';

    const addonBase = {
      display: 'flex',
      alignItems: 'center',
      color: isDisabled ? 'var(--lucent-text-disabled)' : 'var(--lucent-text-secondary)',
      fontSize: sizeFont[size],
      fontFamily: 'var(--lucent-font-family-base)',
      whiteSpace: 'nowrap' as const,
      userSelect: 'none' as const,
      flexShrink: 0,
    };
    const prefixStyle = { ...addonBase, paddingLeft: sizePx[size], paddingRight: '2px' };
    const suffixStyle = { ...addonBase, paddingLeft: '2px', paddingRight: sizePx[size] };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lucent-space-1)', width: '100%', ...style }}>
        {label && (
          <label
            htmlFor={inputId}
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

        {/* Field wrapper — owns the border, focus ring, and overflow clip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'stretch',
            height: sizeH[size],
            border: `1px solid ${borderColor}`,
            borderRadius: 'var(--lucent-radius-lg)',
            boxShadow,
            background: isDisabled ? 'var(--lucent-surface-secondary)' : 'var(--lucent-surface)',
            overflow: 'hidden',
            cursor: isDisabled ? 'not-allowed' : undefined,
            transition: [
              `border-color var(--lucent-duration-fast) var(--lucent-easing-default)`,
              `box-shadow var(--lucent-duration-fast) var(--lucent-easing-default)`,
            ].join(', '),
          }}
          onMouseEnter={() => { if (!isDisabled) setIsHovered(true); }}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Prefix addon */}
          {prefix && (
            <span style={prefixStyle}>
              {prefix}
            </span>
          )}

          {/* Icon + input layer */}
          <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', minWidth: 0 }}>
            {leftElement && (
              <span style={{
                position: 'absolute',
                left: sizePx[size],
                color: isDisabled ? 'var(--lucent-text-disabled)' : 'var(--lucent-text-secondary)',
                display: 'flex',
                alignItems: 'center',
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
                height: '100%',
                paddingLeft:  leftElement  ? sizeIconPad[size] : sizePx[size],
                paddingRight: rightElement ? sizeIconPad[size] : sizePx[size],
                fontSize: sizeFont[size],
                fontFamily: 'var(--lucent-font-family-base)',
                color: isDisabled ? 'var(--lucent-text-disabled)' : 'var(--lucent-text-primary)',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                cursor: isDisabled ? 'not-allowed' : undefined,
                boxSizing: 'border-box',
              }}
              {...rest}
              onFocus={(e) => {
                setIsFocused(true);
                rest.onFocus?.(e);
              }}
              onBlur={(e) => {
                setIsFocused(false);
                rest.onBlur?.(e);
              }}
            />

            {rightElement && (
              <span style={{
                position: 'absolute',
                right: sizePx[size],
                color: isDisabled ? 'var(--lucent-text-disabled)' : 'var(--lucent-text-secondary)',
                display: 'flex',
                alignItems: 'center',
              }}>
                {rightElement}
              </span>
            )}
          </div>

          {/* Suffix addon */}
          {suffix && (
            <span style={suffixStyle}>
              {suffix}
            </span>
          )}
        </div>

        {hasError && (
          <span
            id={`${inputId}-error`}
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
            id={`${inputId}-helper`}
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

Input.displayName = 'Input';

import { forwardRef, useEffect, useRef, type TextareaHTMLAttributes } from 'react';

export type TextareaSize = 'sm' | 'md' | 'lg';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  errorText?: string;
  autoResize?: boolean;
  maxLength?: number;
  showCount?: boolean;
  size?: TextareaSize;
}

const sizeFontSizes: Record<TextareaSize, string> = {
  sm: 'var(--lucent-font-size-sm)',
  md: 'var(--lucent-font-size-md)',
  lg: 'var(--lucent-font-size-md)',
};
const sizeLabelFont: Record<TextareaSize, string> = {
  sm: 'var(--lucent-font-size-sm)',
  md: 'var(--lucent-font-size-sm)',
  lg: 'var(--lucent-font-size-md)',
};
const sizePaddings: Record<TextareaSize, string> = {
  sm: 'var(--lucent-space-3)',
  md: 'var(--lucent-space-4)',
  lg: 'var(--lucent-space-4)',
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helperText, errorText, autoResize = false, maxLength, showCount = false, size = 'md', id, value, onChange, disabled, style, ...rest }, ref) => {
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const resolvedRef = (ref as React.RefObject<HTMLTextAreaElement>) ?? internalRef;
    const inputId = id ?? `lucent-textarea-${Math.random().toString(36).slice(2, 7)}`;
    const hasError = Boolean(errorText);
    const isDisabled = Boolean(disabled);
    const charCount = typeof value === 'string' ? value.length : 0;

    useEffect(() => {
      if (!autoResize) return;
      const el = resolvedRef.current;
      if (!el) return;
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }, [value, autoResize, resolvedRef]);

    const borderColor = isDisabled
      ? 'transparent'
      : hasError
        ? 'var(--lucent-danger-default)'
        : 'var(--lucent-border-default)';

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lucent-space-1)', width: '100%' }}>
        {label && (
          <label htmlFor={inputId} style={{
            fontSize: sizeLabelFont[size],
            fontWeight: 'var(--lucent-font-weight-medium)',
            color: isDisabled ? 'var(--lucent-text-disabled)' : 'var(--lucent-text-primary)',
            fontFamily: 'var(--lucent-font-family-base)',
          }}>
            {label}
          </label>
        )}
        <textarea
          ref={resolvedRef}
          id={inputId}
          maxLength={maxLength}
          value={value}
          onChange={onChange}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          style={{
            width: '100%',
            minHeight: '100px',
            padding: sizePaddings[size],
            fontSize: sizeFontSizes[size],
            fontFamily: 'var(--lucent-font-family-base)',
            color: isDisabled ? 'var(--lucent-text-disabled)' : 'var(--lucent-text-primary)',
            background: isDisabled ? 'color-mix(in srgb, var(--lucent-text-primary) 6%, transparent)' : 'var(--lucent-surface)',
            border: `1px solid ${borderColor}`,
            borderRadius: 'var(--lucent-radius-lg)',
            outline: 'none',
            resize: autoResize ? 'none' : 'vertical',
            boxSizing: 'border-box',
            lineHeight: 'var(--lucent-line-height-base)',
            cursor: isDisabled ? 'not-allowed' : undefined,
            transition: [
              `border-color var(--lucent-duration-fast) var(--lucent-easing-default)`,
              `box-shadow var(--lucent-duration-fast) var(--lucent-easing-default)`,
            ].join(', '),
            ...style,
          }}
          onMouseEnter={(e) => {
            if (!isDisabled && e.currentTarget !== document.activeElement) {
              e.currentTarget.style.borderColor = hasError
                ? 'var(--lucent-danger-default)'
                : 'var(--lucent-border-strong)';
            }
            rest.onMouseEnter?.(e);
          }}
          onMouseLeave={(e) => {
            if (!isDisabled && e.currentTarget !== document.activeElement) {
              e.currentTarget.style.borderColor = hasError
                ? 'var(--lucent-danger-default)'
                : 'var(--lucent-border-default)';
            }
            rest.onMouseLeave?.(e);
          }}
          onFocus={(e) => {
            if (isDisabled) return;
            e.currentTarget.style.borderColor = hasError ? 'var(--lucent-danger-default)' : 'var(--lucent-accent-border)';
            e.currentTarget.style.boxShadow = `0 0 0 3px ${hasError ? 'var(--lucent-danger-subtle)' : 'var(--lucent-accent-subtle)'}`;
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            if (isDisabled) return;
            e.currentTarget.style.borderColor = hasError ? 'var(--lucent-danger-default)' : 'var(--lucent-border-default)';
            e.currentTarget.style.boxShadow = 'none';
            rest.onBlur?.(e);
          }}
          {...rest}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            {hasError && (
              <span id={`${inputId}-error`} role="alert" style={{ fontSize: 'var(--lucent-font-size-sm)', color: 'var(--lucent-danger-text)', fontFamily: 'var(--lucent-font-family-base)' }}>
                {errorText}
              </span>
            )}
            {!hasError && helperText && (
              <span id={`${inputId}-helper`} style={{ fontSize: 'var(--lucent-font-size-sm)', color: 'var(--lucent-text-secondary)', fontFamily: 'var(--lucent-font-family-base)' }}>
                {helperText}
              </span>
            )}
          </div>
          {(showCount || maxLength) && (
            <span style={{
              fontSize: 'var(--lucent-font-size-xs)',
              color: maxLength && charCount >= maxLength ? 'var(--lucent-danger-text)' : 'var(--lucent-text-secondary)',
              fontFamily: 'var(--lucent-font-family-mono)',
              flexShrink: 0,
              marginLeft: 'var(--lucent-space-2)',
            }}>
              {charCount}{maxLength ? `/${maxLength}` : ''}
            </span>
          )}
        </div>
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

// Need React import for RefObject
import type React from 'react';

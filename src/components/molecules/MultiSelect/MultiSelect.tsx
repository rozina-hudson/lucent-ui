import {
  useState, useRef, useEffect, useId,
  type CSSProperties, type KeyboardEvent,
} from 'react';
import { Text } from '../../atoms/Text/index.js';
import { Checkbox } from '../../atoms/Checkbox/index.js';
import { Tag } from '../../atoms/Tag/index.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export type MultiSelectSize = 'sm' | 'md' | 'lg';

export interface MultiSelectProps {
  options: MultiSelectOption[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Max number of items that can be selected. No limit by default. */
  max?: number;
  size?: MultiSelectSize;
  label?: string;
  helperText?: string;
  errorText?: string;
  style?: CSSProperties;
}

const sizeHeights: Record<MultiSelectSize, number> = { sm: 28, md: 36, lg: 42 };
const sizeFontSizes: Record<MultiSelectSize, string> = {
  sm: 'var(--lucent-font-size-sm)',
  md: 'var(--lucent-font-size-md)',
  lg: 'var(--lucent-font-size-md)',
};
const sizePaddings: Record<MultiSelectSize, string> = {
  sm: '2px var(--lucent-space-2)',
  md: '2px var(--lucent-space-2)',
  lg: '2px var(--lucent-space-3)',
};

const dropdownPadding: Record<MultiSelectSize, string> = {
  sm: 'var(--lucent-space-2)',
  md: 'var(--lucent-space-2)',
  lg: 'var(--lucent-space-3)',
};

// Map MultiSelect size → Tag size that fits inside the trigger
const tagSizeMap: Record<MultiSelectSize, 'sm' | 'md' | 'lg'> = { sm: 'sm', md: 'md', lg: 'lg' };

// ─── Component ────────────────────────────────────────────────────────────────

export function MultiSelect({
  options,
  value: controlledValue,
  defaultValue = [],
  onChange,
  placeholder = 'Select…',
  disabled = false,
  max,
  size = 'md',
  label,
  helperText,
  errorText,
  style,
}: MultiSelectProps) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<string[]>(defaultValue);
  const selected = isControlled ? controlledValue! : internalValue;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [focused, setFocused] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const toggle = (val: string) => {
    const next = selected.includes(val)
      ? selected.filter(v => v !== val)
      : max !== undefined && selected.length >= max
      ? selected
      : [...selected, val];
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  };

  const remove = (val: string) => {
    const next = selected.filter(v => v !== val);
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  };

  const filtered = options.filter(o =>
    o.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') { setOpen(false); setQuery(''); return; }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActiveIndex(i => Math.min(i + 1, filtered.length - 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      const item = filtered[activeIndex];
      if (item && !item.disabled) toggle(item.value);
    }
    if (e.key === 'Backspace' && query === '' && selected.length > 0) {
      remove(selected[selected.length - 1]!);
    }
  };

  const atMax = max !== undefined && selected.length >= max;

  const hasError = Boolean(errorText);
  const borderColor = disabled
    ? 'var(--lucent-border-default)'
    : hasError
    ? 'var(--lucent-danger-default)'
    : focused
    ? 'var(--lucent-focus-ring)'
    : 'var(--lucent-border-default)';

  const boxShadow = focused
    ? `0 0 0 3px ${hasError ? 'var(--lucent-danger-subtle)' : 'var(--lucent-accent-subtle)'}`
    : 'none';

  const inputId = `lucent-multiselect-${useId()}`;

  return (
    <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lucent-space-1)', ...style }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontSize: 'var(--lucent-font-size-sm)',
            fontWeight: 'var(--lucent-font-weight-medium)',
            color: disabled ? 'var(--lucent-text-disabled)' : 'var(--lucent-text-primary)',
            fontFamily: 'var(--lucent-font-family-base)',
          }}
        >
          {label}
        </label>
      )}
      {/* Trigger + dropdown wrapper (position anchor) */}
      <div style={{ position: 'relative' }}>
      {/* Trigger / tag area */}
      <div
        onClick={() => { if (!disabled) { setOpen(true); inputRef.current?.focus(); } }}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: dropdownPadding[size],
          minHeight: sizeHeights[size],
          padding: sizePaddings[size],
          borderRadius: 'var(--lucent-radius-lg)',
          border: `1px solid ${borderColor}`,
          background: disabled ? 'var(--lucent-surface-secondary)' : 'var(--lucent-surface)',
          cursor: disabled ? 'not-allowed' : 'text',
          transition: 'border-color var(--lucent-duration-fast) var(--lucent-easing-default), box-shadow var(--lucent-duration-fast) var(--lucent-easing-default)',
          boxShadow,
        }}
      >
        {selected.map(val => {
          const opt = options.find(o => o.value === val);
          return opt ? (
            <Tag key={val} size={tagSizeMap[size]} onDismiss={() => remove(val)} disabled={disabled}>{opt.label}</Tag>
          ) : null;
        })}

        <input
          id={inputId}
          ref={inputRef}
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); setActiveIndex(0); }}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          placeholder={selected.length === 0 ? placeholder : ''}
          aria-autocomplete="list"
          aria-controls={listId}
          aria-expanded={open}
          aria-describedby={hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          role="combobox"
          style={{
            flex: '1 1 80px',
            minWidth: 80,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontFamily: 'var(--lucent-font-family-base)',
            fontSize: sizeFontSizes[size],
            color: disabled ? 'var(--lucent-text-disabled)' : 'var(--lucent-text-primary)',
            cursor: disabled ? 'not-allowed' : 'text',
            padding: selected.length === 0 ? '2px 0 2px var(--lucent-space-1)' : '2px 0',
          }}
        />
      </div>

      {/* Dropdown */}
      {open && !disabled && (
        <div
          id={listId}
          role="listbox"
          aria-multiselectable="true"
          style={{
            position: 'absolute',
            top: 'calc(100% + var(--lucent-space-1))',
            left: 0,
            right: 0,
            zIndex: 1000,
            background: 'var(--lucent-surface-overlay)',
            border: '1px solid var(--lucent-border-default)',
            borderRadius: 'var(--lucent-radius-lg)',
            boxShadow: 'var(--lucent-shadow-md)',
            maxHeight: 240,
            overflowY: 'auto',
            padding: dropdownPadding[size],
          }}
        >
          {filtered.length === 0 ? (
            <div style={{ padding: 'var(--lucent-space-2)' }}>
              <Text color="secondary" size="sm">No options</Text>
            </div>
          ) : (
            filtered.map((opt, i) => {
              const isSelected = selected.includes(opt.value);
              const isActive = i === activeIndex;
              const isDisabled = opt.disabled ?? false;
              const wouldExceedMax = atMax && !isSelected;
              return (
                <div
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={isDisabled || wouldExceedMax}
                  onClick={() => { if (!isDisabled && !wouldExceedMax) toggle(opt.value); }}
                  onMouseEnter={() => setActiveIndex(i)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: dropdownPadding[size],
                    padding: dropdownPadding[size],
                    borderRadius: 'var(--lucent-radius-md)',
                    cursor: isDisabled || wouldExceedMax ? 'not-allowed' : 'pointer',
                    background: isActive ? 'var(--lucent-surface-secondary)' : 'transparent',
                    opacity: isDisabled || wouldExceedMax ? 0.5 : 1,
                  }}
                >
                  <Checkbox
                    checked={isSelected}
                    disabled={isDisabled || wouldExceedMax}
                    size={size}
                    style={{ margin: 0, pointerEvents: 'none' }}
                    aria-hidden
                    readOnly
                  />
                  <Text size="sm">{opt.label}</Text>
                </div>
              );
            })
          )}

          {atMax && (
            <div style={{
              padding: 'var(--lucent-space-2)',
              borderTop: '1px solid var(--lucent-border-subtle)',
            }}>
              <Text size="xs" color="secondary">Max {max} selected</Text>
            </div>
          )}
        </div>
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
}

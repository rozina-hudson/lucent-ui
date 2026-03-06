import {
  useState, useRef, useEffect, useId,
  type CSSProperties, type KeyboardEvent,
} from 'react';
import { Text } from '../../atoms/Text/index.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Max number of items that can be selected. No limit by default. */
  max?: number;
  style?: CSSProperties;
}

// ─── Tag ──────────────────────────────────────────────────────────────────────

function Tag({ label, onRemove, disabled }: { label: string; onRemove: () => void; disabled?: boolean }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: '2px 6px 2px 8px',
      borderRadius: 'var(--lucent-radius-full)',
      background: 'var(--lucent-bg-muted)',
      border: '1px solid var(--lucent-border-default)',
      fontSize: 'var(--lucent-font-size-sm)',
      fontFamily: 'var(--lucent-font-family-base)',
      color: 'var(--lucent-text-primary)',
      lineHeight: 1.4,
      flexShrink: 0,
    }}>
      {label}
      {!disabled && (
        <button
          type="button"
          onClick={e => { e.stopPropagation(); onRemove(); }}
          aria-label={`Remove ${label}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 14,
            height: 14,
            padding: 0,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            color: 'var(--lucent-text-secondary)',
            borderRadius: 'var(--lucent-radius-full)',
          }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
            <path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </span>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MultiSelect({
  options,
  value: controlledValue,
  defaultValue = [],
  onChange,
  placeholder = 'Select…',
  disabled = false,
  max,
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

  const borderColor = disabled
    ? 'var(--lucent-border-default)'
    : focused
    ? 'var(--lucent-accent-default)'
    : 'var(--lucent-border-default)';

  return (
    <div ref={containerRef} style={{ position: 'relative', ...style }}>
      {/* Trigger / tag area */}
      <div
        onClick={() => { if (!disabled) { setOpen(true); inputRef.current?.focus(); } }}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 'var(--lucent-space-1)',
          minHeight: 38,
          padding: 'var(--lucent-space-1) var(--lucent-space-3)',
          borderRadius: 'var(--lucent-radius-md)',
          border: `1px solid ${borderColor}`,
          background: disabled ? 'var(--lucent-bg-muted)' : 'var(--lucent-surface-default)',
          cursor: disabled ? 'not-allowed' : 'text',
          transition: 'border-color var(--lucent-duration-fast) var(--lucent-easing-default)',
          outline: focused ? `2px solid var(--lucent-focus-ring)` : 'none',
          outlineOffset: 2,
        }}
      >
        {selected.map(val => {
          const opt = options.find(o => o.value === val);
          return opt ? (
            <Tag key={val} label={opt.label} onRemove={() => remove(val)} disabled={disabled} />
          ) : null;
        })}

        <input
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
          role="combobox"
          style={{
            flex: '1 1 80px',
            minWidth: 80,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontFamily: 'var(--lucent-font-family-base)',
            fontSize: 'var(--lucent-font-size-sm)',
            color: disabled ? 'var(--lucent-text-disabled)' : 'var(--lucent-text-primary)',
            cursor: disabled ? 'not-allowed' : 'text',
            padding: '2px 0',
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
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            zIndex: 1000,
            background: 'var(--lucent-surface-overlay)',
            border: '1px solid var(--lucent-border-default)',
            borderRadius: 'var(--lucent-radius-md)',
            boxShadow: 'var(--lucent-shadow-md)',
            maxHeight: 240,
            overflowY: 'auto',
            padding: 'var(--lucent-space-1) 0',
          }}
        >
          {filtered.length === 0 ? (
            <div style={{ padding: 'var(--lucent-space-3) var(--lucent-space-4)' }}>
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
                    gap: 'var(--lucent-space-2)',
                    padding: 'var(--lucent-space-2) var(--lucent-space-3)',
                    cursor: isDisabled || wouldExceedMax ? 'not-allowed' : 'pointer',
                    background: isActive ? 'var(--lucent-bg-subtle)' : 'transparent',
                    opacity: isDisabled || wouldExceedMax ? 0.5 : 1,
                  }}
                >
                  {/* Checkbox indicator */}
                  <span style={{
                    flexShrink: 0,
                    width: 16,
                    height: 16,
                    borderRadius: 'var(--lucent-radius-sm)',
                    border: `1.5px solid ${isSelected ? 'var(--lucent-accent-default)' : 'var(--lucent-border-strong)'}`,
                    background: isSelected ? 'var(--lucent-accent-default)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background var(--lucent-duration-fast), border-color var(--lucent-duration-fast)',
                  }}>
                    {isSelected && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
                        <path d="M2 5l2.5 2.5L8 3" stroke="var(--lucent-text-on-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <Text size="sm">{opt.label}</Text>
                </div>
              );
            })
          )}

          {atMax && (
            <div style={{
              padding: 'var(--lucent-space-2) var(--lucent-space-3)',
              borderTop: '1px solid var(--lucent-border-subtle)',
            }}>
              <Text size="xs" color="secondary">Max {max} selected</Text>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

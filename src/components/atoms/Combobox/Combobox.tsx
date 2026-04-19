import {
  useState, useRef, useEffect, useLayoutEffect, useId,
  type CSSProperties, type KeyboardEvent, type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from '../../../icons/ChevronDown.js';

export interface ComboboxOption {
  value: string;
  label: string;
  /** Secondary text shown on the right of the option (e.g. "UTC-05:00") */
  hint?: string;
  /** Optional group heading — consecutive options sharing a group render under one header */
  group?: string;
  disabled?: boolean;
}

export type ComboboxSize = 'sm' | 'md' | 'lg';

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  size?: ComboboxSize;
  label?: string;
  helperText?: string;
  errorText?: string;
  /** Message shown when no options match the query. Default: "No matches" */
  emptyMessage?: ReactNode;
  /** When true, committing a value not in `options` is allowed and the raw query is passed to onChange. */
  allowCustomValue?: boolean;
  id?: string;
  name?: string;
  autoFocus?: boolean;
  style?: CSSProperties;
  'aria-label'?: string;
}

const sizeH: Record<ComboboxSize, string> = {
  sm: 'calc(var(--lucent-space-8) * 0.5 + 16px)',
  md: 'calc(var(--lucent-space-10) * 0.5 + 20px)',
  lg: 'calc(var(--lucent-space-12) * 0.5 + 24px)',
};
const sizeFont: Record<ComboboxSize, string> = {
  sm: 'var(--lucent-font-size-sm)',
  md: 'var(--lucent-font-size-md)',
  lg: 'var(--lucent-font-size-md)',
};
const sizeLabelFont: Record<ComboboxSize, string> = {
  sm: 'var(--lucent-font-size-sm)',
  md: 'var(--lucent-font-size-sm)',
  lg: 'var(--lucent-font-size-md)',
};
const sizePx: Record<ComboboxSize, string> = {
  sm: 'var(--lucent-space-3)',
  md: 'var(--lucent-space-4)',
  lg: 'var(--lucent-space-4)',
};
const dropdownPadding: Record<ComboboxSize, string> = {
  sm: 'var(--lucent-space-2)',
  md: 'var(--lucent-space-2)',
  lg: 'var(--lucent-space-3)',
};
const hintFont: Record<ComboboxSize, string> = {
  sm: 'var(--lucent-font-size-xs)',
  md: 'var(--lucent-font-size-sm)',
  lg: 'var(--lucent-font-size-sm)',
};

export function Combobox({
  options,
  value: controlledValue,
  defaultValue = '',
  onChange,
  placeholder,
  disabled = false,
  size = 'md',
  label,
  helperText,
  errorText,
  emptyMessage = 'No matches',
  allowCustomValue = false,
  id,
  name,
  autoFocus,
  style,
  'aria-label': ariaLabel,
}: ComboboxProps) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<string>(defaultValue);
  const selected = isControlled ? controlledValue! : internalValue;

  const selectedOption = options.find(o => o.value === selected);
  const selectedLabel = selectedOption?.label ?? (allowCustomValue ? selected : '');

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });

  const reactId = useId();
  const inputId = id ?? `lucent-combobox-${reactId}`;
  const listboxId = `${inputId}-listbox`;

  const hasError = Boolean(errorText);

  // Filter options by query (case-insensitive, matches label or hint)
  const filtered = open
    ? options.filter(o => {
        if (!query) return true;
        const q = query.toLowerCase();
        return (
          o.label.toLowerCase().includes(q) ||
          (o.hint?.toLowerCase().includes(q) ?? false)
        );
      })
    : options;

  // Keep activeIndex within filtered bounds
  useEffect(() => {
    if (activeIndex >= filtered.length) setActiveIndex(Math.max(0, filtered.length - 1));
  }, [filtered.length, activeIndex]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        !containerRef.current?.contains(e.target as Node) &&
        !dropdownRef.current?.contains(e.target as Node)
      ) {
        closeAndRevert();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, query, selected]);

  // Position dropdown off the field wrapper (not the outer container — it includes helper/error text)
  useLayoutEffect(() => {
    if (!open || !fieldRef.current) return;
    const rect = fieldRef.current.getBoundingClientRect();
    setDropdownPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
  }, [open, query]);

  function commit(val: string) {
    if (!isControlled) setInternalValue(val);
    onChange?.(val);
    setOpen(false);
    setQuery('');
  }

  function closeAndRevert() {
    if (allowCustomValue && query && query !== selectedLabel) {
      commit(query);
      return;
    }
    setOpen(false);
    setQuery('');
  }

  function openAndSeedActive() {
    if (disabled) return;
    setOpen(true);
    // Seed activeIndex to the currently-selected option if visible
    const idx = options.findIndex(o => o.value === selected);
    setActiveIndex(idx >= 0 ? idx : 0);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (disabled) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      closeAndRevert();
      return;
    }

    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter') {
        e.preventDefault();
        openAndSeedActive();
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const enabled = filtered.map((o, i) => (o.disabled ? -1 : i)).filter(i => i >= 0);
      if (enabled.length === 0) return;
      const next = enabled.find(i => i > activeIndex) ?? enabled[0]!;
      setActiveIndex(next);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const enabled = filtered.map((o, i) => (o.disabled ? -1 : i)).filter(i => i >= 0);
      if (enabled.length === 0) return;
      const prev = [...enabled].reverse().find(i => i < activeIndex) ?? enabled[enabled.length - 1]!;
      setActiveIndex(prev);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveIndex(filtered.length - 1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = filtered[activeIndex];
      if (item && !item.disabled) {
        commit(item.value);
      } else if (allowCustomValue && query) {
        commit(query);
      }
    } else if (e.key === 'Tab') {
      // Tab commits the highlighted match (if any) and lets focus move on
      const item = filtered[activeIndex];
      if (item && !item.disabled && query) {
        commit(item.value);
      } else {
        setOpen(false);
        setQuery('');
      }
    }
  }

  const borderColor = disabled
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

  // Display value: when open, show query; when closed, show selected label
  const displayValue = open ? query : selectedLabel;

  return (
    <div
      ref={containerRef}
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lucent-space-1)', width: '100%', ...style }}
    >
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontSize: sizeLabelFont[size],
            fontWeight: 'var(--lucent-font-weight-medium)',
            color: disabled ? 'var(--lucent-text-disabled)' : 'var(--lucent-text-primary)',
            fontFamily: 'var(--lucent-font-family-base)',
          }}
        >
          {label}
        </label>
      )}

      {/* Field wrapper — mirrors Input chrome */}
      <div
        ref={fieldRef}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          height: sizeH[size],
          border: `1px solid ${borderColor}`,
          borderRadius: 'var(--lucent-radius-lg)',
          boxShadow,
          background: disabled ? 'color-mix(in srgb, var(--lucent-text-primary) 6%, transparent)' : 'var(--lucent-surface)',
          overflow: 'hidden',
          cursor: disabled ? 'not-allowed' : 'text',
          transition: [
            `border-color var(--lucent-duration-fast) var(--lucent-easing-default)`,
            `box-shadow var(--lucent-duration-fast) var(--lucent-easing-default)`,
          ].join(', '),
        }}
        onMouseEnter={() => { if (!disabled) setIsHovered(true); }}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => {
          if (disabled) return;
          if (!open) openAndSeedActive();
          inputRef.current?.focus();
        }}
      >
        <input
          ref={inputRef}
          id={inputId}
          name={name}
          type="text"
          role="combobox"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          autoFocus={autoFocus}
          disabled={disabled}
          placeholder={placeholder}
          value={displayValue}
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={open ? listboxId : undefined}
          aria-activedescendant={
            open && filtered[activeIndex]
              ? `${inputId}-option-${filtered[activeIndex]!.value}`
              : undefined
          }
          aria-label={ariaLabel}
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          onChange={e => {
            setQuery(e.target.value);
            setOpen(true);
            setActiveIndex(0);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setIsFocused(true);
            if (!open) openAndSeedActive();
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
          style={{
            width: '100%',
            height: '100%',
            paddingLeft: sizePx[size],
            paddingRight: `calc(${sizePx[size]} + 14px + var(--lucent-space-1))`,
            fontSize: sizeFont[size],
            fontFamily: 'var(--lucent-font-family-base)',
            color: disabled ? 'var(--lucent-text-disabled)' : 'var(--lucent-text-primary)',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            cursor: disabled ? 'not-allowed' : 'text',
            boxSizing: 'border-box',
          }}
        />

        {/* Chevron */}
        <span
          aria-hidden
          style={{
            position: 'absolute',
            right: sizePx[size],
            pointerEvents: 'none',
            color: disabled ? 'var(--lucent-text-disabled)' : 'var(--lucent-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform var(--lucent-duration-fast) var(--lucent-easing-default)',
          }}
        >
          <span style={{ display: 'inline-flex', width: 14, height: 14 }}><ChevronDown /></span>
        </span>
      </div>

      {/* Dropdown — portaled to escape overflow:hidden ancestors */}
      {open && !disabled && createPortal(
        <div
          ref={dropdownRef}
          id={listboxId}
          role="listbox"
          style={{
            position: 'fixed',
            top: dropdownPos.top,
            left: dropdownPos.left,
            width: dropdownPos.width,
            boxSizing: 'border-box',
            zIndex: 1000,
            background: 'color-mix(in srgb, var(--lucent-surface-overlay) 85%, transparent)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            border: '1px solid color-mix(in srgb, var(--lucent-accent-default) 15%, var(--lucent-border-default))',
            borderRadius: 'var(--lucent-radius-lg)',
            boxShadow: '0 0 24px -4px color-mix(in srgb, var(--lucent-accent-default) 12%, transparent), var(--lucent-shadow-md)',
            maxHeight: 260,
            overflowY: 'auto',
            padding: dropdownPadding[size],
            fontFamily: 'var(--lucent-font-family-base)',
          }}
        >
          {filtered.length === 0 ? (
            <div
              style={{
                padding: dropdownPadding[size],
                fontSize: sizeFont[size],
                color: 'var(--lucent-text-secondary)',
              }}
            >
              {emptyMessage}
            </div>
          ) : (
            filtered.map((opt, i) => {
              const isActive = i === activeIndex;
              const isSelected = opt.value === selected;
              const isDisabled = opt.disabled ?? false;
              const prevGroup = i > 0 ? filtered[i - 1]!.group : undefined;
              const showGroupHeader = opt.group && opt.group !== prevGroup;

              return (
                <div key={opt.value}>
                  {showGroupHeader && (
                    <div
                      role="presentation"
                      style={{
                        padding: `var(--lucent-space-2) ${dropdownPadding[size]} var(--lucent-space-1)`,
                        fontSize: 'var(--lucent-font-size-xs)',
                        fontWeight: 'var(--lucent-font-weight-semibold)',
                        color: 'var(--lucent-text-secondary)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {opt.group}
                    </div>
                  )}
                  <div
                    id={`${inputId}-option-${opt.value}`}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={isDisabled}
                    onMouseDown={e => {
                      // Prevent input blur before we commit
                      e.preventDefault();
                    }}
                    onClick={() => {
                      if (!isDisabled) commit(opt.value);
                    }}
                    onMouseEnter={() => setActiveIndex(i)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 'var(--lucent-space-2)',
                      padding: dropdownPadding[size],
                      borderRadius: 'var(--lucent-radius-md)',
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                      background: isActive && !isDisabled
                        ? 'color-mix(in srgb, var(--lucent-text-primary) 5%, transparent)'
                        : 'transparent',
                      opacity: isDisabled ? 0.5 : 1,
                      fontSize: sizeFont[size],
                      color: isSelected ? 'var(--lucent-accent-default)' : 'var(--lucent-text-primary)',
                      fontWeight: isSelected
                        ? 'var(--lucent-font-weight-medium)'
                        : 'var(--lucent-font-weight-regular)',
                    }}
                  >
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {opt.label}
                    </span>
                    {opt.hint && (
                      <span
                        style={{
                          fontSize: hintFont[size],
                          color: 'var(--lucent-text-secondary)',
                          flexShrink: 0,
                        }}
                      >
                        {opt.hint}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>,
        document.body,
      )}

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
}

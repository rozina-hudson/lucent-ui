import { useState, useRef, useEffect, useLayoutEffect, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Text } from '../../atoms/Text/index.js';
import {
  Calendar, NavButton as _NavButton,
  formatDate, isSameDay, isBeforeDay, isAfterDay,
  calPadding, calMinWidth,
} from '../DatePicker/DatePicker.js';

export interface DateRange {
  start: Date;
  end: Date;
}

export type DateRangePickerSize = 'sm' | 'md' | 'lg';

export interface DateRangePickerProps {
  value?: DateRange;
  defaultValue?: DateRange;
  onChange?: (range: DateRange) => void;
  placeholder?: string;
  disabled?: boolean;
  min?: Date;
  max?: Date;
  size?: DateRangePickerSize;
  label?: string;
  helperText?: string;
  errorText?: string;
  /** Custom trigger element. When provided, replaces the default input-style button. */
  trigger?: ReactNode;
  style?: CSSProperties;
}

const sizeHeights: Record<DateRangePickerSize, string> = { sm: 'calc(var(--lucent-space-8) * 0.5 + 18px)', md: 'calc(var(--lucent-space-10) * 0.5 + 22px)', lg: 'calc(var(--lucent-space-12) * 0.5 + 26px)' };
const sizeFontSizes: Record<DateRangePickerSize, string> = {
  sm: 'var(--lucent-font-size-sm)',
  md: 'var(--lucent-font-size-md)',
  lg: 'var(--lucent-font-size-md)',
};
const sizePx: Record<DateRangePickerSize, string> = {
  sm: 'var(--lucent-space-3)',
  md: 'var(--lucent-space-4)',
  lg: 'var(--lucent-space-4)',
};
const sizeGap: Record<DateRangePickerSize, string> = {
  sm: 'var(--lucent-space-2)',
  md: 'calc((var(--lucent-space-2) + var(--lucent-space-3)) / 2)',
  lg: 'var(--lucent-space-3)',
};
const sizeLabelFont: Record<DateRangePickerSize, string> = {
  sm: 'var(--lucent-font-size-sm)',
  md: 'var(--lucent-font-size-sm)',
  lg: 'var(--lucent-font-size-md)',
};

function formatRange(range: DateRange | undefined, placeholder: string): string {
  if (!range) return placeholder;
  if (isSameDay(range.start, range.end)) return formatDate(range.start);
  return `${formatDate(range.start)} → ${formatDate(range.end)}`;
}

export function DateRangePicker({
  value: controlledValue,
  defaultValue,
  onChange,
  placeholder = 'Pick a date range',
  disabled = false,
  min,
  max,
  size = 'md',
  label,
  helperText,
  errorText,
  trigger,
  style,
}: DateRangePickerProps) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<DateRange | undefined>(defaultValue);
  const selected = isControlled ? controlledValue : internalValue;
  const hasError = Boolean(errorText);
  const isDisabled = disabled;
  const inputId = `lucent-daterangepicker-${Math.random().toString(36).slice(2, 7)}`;

  // Selecting state: first click sets start, second sets end
  const [selecting, setSelecting] = useState<Date | null>(null);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const today = new Date();
  const [leftYear, setLeftYear] = useState((selected?.start ?? today).getFullYear());
  const [leftMonth, setLeftMonth] = useState((selected?.start ?? today).getMonth());

  // Right calendar is always one month ahead of left
  const rightMonth = leftMonth === 11 ? 0 : leftMonth + 1;
  const rightYear = leftMonth === 11 ? leftYear + 1 : leftYear;

  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node) && !dropdownRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setSelecting(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  useLayoutEffect(() => {
    if (!open || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setDropdownPos({ top: rect.bottom + 4, left: rect.left });
  }, [open]);

  const handleSelect = (date: Date) => {
    if (!selecting) {
      // First click — set start, wait for end
      setSelecting(date);
    } else {
      // Second click — determine start/end order
      const [start, end] = isBeforeDay(date, selecting) || isSameDay(date, selecting)
        ? [date, selecting]
        : [selecting, date];
      const range: DateRange = { start, end };
      if (!isControlled) setInternalValue(range);
      onChange?.(range);
      setSelecting(null);
      setOpen(false);
    }
  };

  const prevLeft = () => {
    if (leftMonth === 0) { setLeftMonth(11); setLeftYear(y => y - 1); }
    else setLeftMonth(m => m - 1);
  };
  const nextLeft = () => {
    if (leftMonth === 11) { setLeftMonth(0); setLeftYear(y => y + 1); }
    else setLeftMonth(m => m + 1);
  };

  // Highlight range: if mid-selection, highlight from first click to hovered day
  let highlightRange: { start: Date; end: Date } | undefined;
  if (selecting && hoveredDate) {
    const [s, e] = isBeforeDay(hoveredDate, selecting)
      ? [hoveredDate, selecting]
      : [selecting, hoveredDate];
    highlightRange = { start: s, end: e };
  } else if (selecting) {
    highlightRange = { start: selecting, end: selecting };
  } else if (selected) {
    highlightRange = { start: selected.start, end: selected.end };
  }

  const borderColor = isDisabled
    ? 'transparent'
    : hasError
      ? 'var(--lucent-danger-default)'
      : focused
        ? 'var(--lucent-accent-border)'
        : 'var(--lucent-border-default)';

  const boxShadow = focused
    ? `0 0 0 3px ${hasError ? 'var(--lucent-danger-subtle)' : 'var(--lucent-accent-subtle)'}`
    : 'none';

  return (
    <div ref={containerRef} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lucent-space-1)', ...style }}>
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

      {trigger ? (
        <span
          onClick={() => !disabled && setOpen(o => !o)}
          aria-haspopup="dialog"
          aria-expanded={open}
          style={{ display: 'inline-flex', cursor: disabled ? 'not-allowed' : 'pointer' }}
        >
          {trigger}
        </span>
      ) : (
        <button
          type="button"
          id={inputId}
          disabled={disabled}
          onClick={() => !disabled && setOpen(o => !o)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-invalid={hasError}
          style={{
            display: 'flex', alignItems: 'center', gap: sizeGap[size],
            width: '100%',
            height: sizeHeights[size],
            boxSizing: 'border-box',
            padding: `0 ${sizePx[size]}`,
            borderRadius: 'var(--lucent-radius-lg)',
            border: `1px solid ${borderColor}`,
            boxShadow,
            background: isDisabled ? 'color-mix(in srgb, var(--lucent-text-primary) 6%, transparent)' : 'var(--lucent-surface)',
            color: selected ? 'var(--lucent-text-primary)' : 'var(--lucent-text-secondary)',
            fontFamily: 'var(--lucent-font-family-base)',
            fontSize: sizeFontSizes[size],
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            outline: 'none',
            transition: [
              'border-color var(--lucent-duration-fast) var(--lucent-easing-default)',
              'box-shadow var(--lucent-duration-fast) var(--lucent-easing-default)',
            ].join(', '),
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden style={{ flexShrink: 0 }}>
            <rect x="1" y="2" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.3" />
            <path d="M1 6h12" stroke="currentColor" strokeWidth="1.3" />
            <path d="M4 1v2M10 1v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <span style={{ flex: 1, textAlign: 'left' }}>
            {formatRange(selected, placeholder)}
          </span>
        </button>
      )}

      {hasError && (
        <span
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
          style={{
            fontSize: sizeLabelFont[size],
            color: 'var(--lucent-text-secondary)',
            fontFamily: 'var(--lucent-font-family-base)',
          }}
        >
          {helperText}
        </span>
      )}

      {open && createPortal(
        <div
          ref={dropdownRef}
          role="dialog"
          aria-label="Date range picker"
          style={{
            position: 'fixed',
            top: dropdownPos.top,
            left: dropdownPos.left,
            zIndex: 1000,
            background: 'color-mix(in srgb, var(--lucent-surface-overlay) 85%, transparent)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            border: '1px solid color-mix(in srgb, var(--lucent-accent-default) 15%, var(--lucent-border-default))',
            borderRadius: 'var(--lucent-radius-lg)',
            boxShadow: '0 0 24px -4px color-mix(in srgb, var(--lucent-accent-default) 12%, transparent), var(--lucent-shadow-md)',
            padding: calPadding[size],
            display: 'flex',
            gap: 'var(--lucent-space-6)',
          }}
        >
          {/* Left calendar */}
          <div style={{ minWidth: calMinWidth[size] }}>
            <Calendar
              year={leftYear}
              month={leftMonth}
              {...(selected?.start !== undefined && { selected: selected.start })}
              today={today}
              {...(min !== undefined && { min })}
              {...(max !== undefined && { max })}
              onSelect={handleSelect}
              onPrevMonth={prevLeft}
              onNextMonth={nextLeft}
              {...(highlightRange !== undefined && { highlightRange })}
              {...(selecting && { onDayHover: setHoveredDate })}
              size={size}
            />
          </div>

          {/* Divider */}
          <div style={{ width: 1, background: 'var(--lucent-border-subtle)', flexShrink: 0 }} />

          {/* Right calendar (next month, nav locked to left) */}
          <div style={{ minWidth: calMinWidth[size] }}>
            <Calendar
              year={rightYear}
              month={rightMonth}
              {...(selected?.end !== undefined && { selected: selected.end })}
              today={today}
              {...(min !== undefined && { min })}
              {...(max !== undefined && { max })}
              onSelect={handleSelect}
              onPrevMonth={prevLeft}
              onNextMonth={nextLeft}
              {...(highlightRange !== undefined && { highlightRange })}
              {...(selecting && { onDayHover: setHoveredDate })}
              size={size}
            />
          </div>
        </div>
      , document.body)}

      {selecting && open && (
        <div style={{ position: 'absolute', top: 'calc(100% + var(--lucent-space-1))', left: 0, zIndex: 1001, pointerEvents: 'none' }}>
          {/* invisible — selecting hint is conveyed via the range highlight */}
        </div>
      )}

      {/* Hint when mid-selection */}
      {selecting && open && (
        <div style={{
          position: 'absolute',
          bottom: -24,
          left: 0,
        }}>
          <Text size="xs" color="secondary">Now pick the end date</Text>
        </div>
      )}
    </div>
  );
}

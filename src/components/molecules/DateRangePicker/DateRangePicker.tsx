import { useState, useRef, useEffect, type CSSProperties } from 'react';
import { Text } from '../../atoms/Text/index.js';
import {
  Calendar, NavButton as _NavButton,
  formatDate, isSameDay, isBeforeDay, isAfterDay,
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
  style?: CSSProperties;
}

const sizeHeights: Record<DateRangePickerSize, number> = { sm: 32, md: 40, lg: 46 };
const sizeFontSizes: Record<DateRangePickerSize, string> = {
  sm: 'var(--lucent-font-size-sm)',
  md: 'var(--lucent-font-size-md)',
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
  style,
}: DateRangePickerProps) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<DateRange | undefined>(defaultValue);
  const selected = isControlled ? controlledValue : internalValue;

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

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setSelecting(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
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

  return (
    <div ref={containerRef} style={{ position: 'relative', ...style }}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(o => !o)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-haspopup="dialog"
        aria-expanded={open}
        style={{
          display: 'flex', alignItems: 'center', gap: 'var(--lucent-space-2)',
          width: '100%',
          height: sizeHeights[size],
          boxSizing: 'content-box',
          padding: '0 var(--lucent-space-3)',
          borderRadius: 'var(--lucent-radius-lg)',
          border: `1px solid ${focused ? 'var(--lucent-accent-default)' : 'var(--lucent-border-default)'}`,
          background: disabled ? 'var(--lucent-surface-secondary)' : 'var(--lucent-surface)',
          color: selected ? 'var(--lucent-text-primary)' : 'var(--lucent-text-secondary)',
          fontFamily: 'var(--lucent-font-family-base)',
          fontSize: sizeFontSizes[size],
          cursor: disabled ? 'not-allowed' : 'pointer',
          outline: focused ? `2px solid var(--lucent-focus-ring)` : 'none',
          outlineOffset: 2,
          transition: 'border-color var(--lucent-duration-fast)',
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

      {open && (
        <div
          role="dialog"
          aria-label="Date range picker"
          style={{
            position: 'absolute',
            top: 'calc(100% + var(--lucent-space-1))',
            left: 0,
            zIndex: 1000,
            background: 'var(--lucent-surface-overlay)',
            border: '1px solid var(--lucent-border-default)',
            borderRadius: 'var(--lucent-radius-lg)',
            boxShadow: 'var(--lucent-shadow-md)',
            padding: 'var(--lucent-space-4)',
            display: 'flex',
            gap: 'var(--lucent-space-6)',
          }}
        >
          {/* Left calendar */}
          <div style={{ minWidth: 220 }}>
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
            />
          </div>

          {/* Divider */}
          <div style={{ width: 1, background: 'var(--lucent-border-subtle)', flexShrink: 0 }} />

          {/* Right calendar (next month, nav locked to left) */}
          <div style={{ minWidth: 220 }}>
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
            />
          </div>
        </div>
      )}

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

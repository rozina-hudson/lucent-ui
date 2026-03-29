import { useState, useRef, useEffect, useLayoutEffect, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { Text } from '../../atoms/Text/index.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function startDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay(); // 0=Sun
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function isBeforeDay(a: Date, b: Date) {
  return new Date(a.getFullYear(), a.getMonth(), a.getDate()) <
    new Date(b.getFullYear(), b.getMonth(), b.getDate());
}

function isAfterDay(a: Date, b: Date) {
  return new Date(a.getFullYear(), a.getMonth(), a.getDate()) >
    new Date(b.getFullYear(), b.getMonth(), b.getDate());
}

const MONTHS = ['January','February','March','April','May','June',
  'July','August','September','October','November','December'];
const WEEKDAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

function formatDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type DatePickerSize = 'sm' | 'md' | 'lg';

export interface DatePickerProps {
  value?: Date;
  defaultValue?: Date;
  onChange?: (date: Date) => void;
  placeholder?: string;
  disabled?: boolean;
  min?: Date;
  max?: Date;
  size?: DatePickerSize;
  label?: string;
  helperText?: string;
  errorText?: string;
  style?: CSSProperties;
}

const sizeHeights: Record<DatePickerSize, string> = { sm: 'calc(var(--lucent-space-8) * 0.5 + 18px)', md: 'calc(var(--lucent-space-10) * 0.5 + 22px)', lg: 'calc(var(--lucent-space-12) * 0.5 + 26px)' };
const sizeFontSizes: Record<DatePickerSize, string> = {
  sm: 'var(--lucent-font-size-sm)',
  md: 'var(--lucent-font-size-md)',
  lg: 'var(--lucent-font-size-md)',
};
const sizeLabelFont: Record<DatePickerSize, string> = {
  sm: 'var(--lucent-font-size-sm)',
  md: 'var(--lucent-font-size-sm)',
  lg: 'var(--lucent-font-size-md)',
};
const sizePx: Record<DatePickerSize, string> = {
  sm: 'var(--lucent-space-3)',
  md: 'var(--lucent-space-4)',
  lg: 'var(--lucent-space-4)',
};
const sizeGap: Record<DatePickerSize, string> = {
  sm: 'var(--lucent-space-2)',
  md: 'calc((var(--lucent-space-2) + var(--lucent-space-3)) / 2)',
  lg: 'var(--lucent-space-3)',
};

// ─── Calendar size maps ───────────────────────────────────────────────────────

const calCellSize: Record<DatePickerSize, number> = { sm: 28, md: 32, lg: 38 };
const calFontSize: Record<DatePickerSize, string> = { sm: 'var(--lucent-font-size-xs)', md: 'var(--lucent-font-size-sm)', lg: 'var(--lucent-font-size-md)' };
const calHeaderSize: Record<DatePickerSize, 'xs' | 'sm' | 'md'> = { sm: 'xs', md: 'sm', lg: 'md' };
const calWeekdaySize: Record<DatePickerSize, 'xs' | 'sm'> = { sm: 'xs', md: 'xs', lg: 'sm' };
const calNavSize: Record<DatePickerSize, number> = { sm: 24, md: 28, lg: 32 };
const calNavIcon: Record<DatePickerSize, number> = { sm: 14, md: 16, lg: 18 };
const calPadding: Record<DatePickerSize, string> = { sm: 'var(--lucent-space-3)', md: 'var(--lucent-space-4)', lg: 'var(--lucent-space-5)' };
const calMinWidth: Record<DatePickerSize, number> = { sm: 220, md: 260, lg: 300 };

// ─── Nav button ───────────────────────────────────────────────────────────────

function NavButton({ dir, onClick, disabled, size = 'md' }: { dir: 'prev' | 'next'; onClick: () => void; disabled?: boolean; size?: DatePickerSize }) {
  const [hovered, setHovered] = useState(false);
  const s = calNavSize[size];
  const iconS = calNavIcon[size];
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={dir === 'prev' ? 'Previous month' : 'Next month'}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: s, height: s,
        border: 'none',
        borderRadius: 'var(--lucent-radius-md)',
        background: hovered && !disabled ? 'color-mix(in srgb, var(--lucent-text-primary) 5%, transparent)' : 'transparent',
        color: disabled ? 'var(--lucent-text-disabled)' : 'var(--lucent-text-secondary)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background var(--lucent-duration-fast)',
      }}
    >
      <svg width={iconS} height={iconS} viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d={dir === 'prev' ? 'M10 12L6 8l4-4' : 'M6 4l4 4-4 4'}
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

// ─── Calendar ─────────────────────────────────────────────────────────────────

function Calendar({
  year, month, selected, today, min, max,
  onSelect, onPrevMonth, onNextMonth,
  highlightRange, onDayHover,
  size = 'md',
}: {
  year: number; month: number;
  selected?: Date; today: Date;
  min?: Date; max?: Date;
  onSelect: (d: Date) => void;
  onPrevMonth: () => void; onNextMonth: () => void;
  highlightRange?: { start?: Date; end?: Date };
  onDayHover?: (date: Date | null) => void;
  size?: DatePickerSize;
}) {
  const totalDays = daysInMonth(year, month);
  const startDay = startDayOfMonth(year, month);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  const cells: (number | null)[] = [
    ...Array(startDay).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];
  // Pad to full rows
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--lucent-space-3)' }}>
        <NavButton dir="prev" onClick={onPrevMonth} size={size} />
        <Text weight="medium" size={calHeaderSize[size]}>{MONTHS[month]} {year}</Text>
        <NavButton dir="next" onClick={onNextMonth} size={size} />
      </div>

      {/* Weekday labels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 'var(--lucent-space-1)' }}>
        {WEEKDAYS.map(d => (
          <div key={d} style={{ textAlign: 'center' }}>
            <Text size={calWeekdaySize[size]} color="secondary">{d}</Text>
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const date = new Date(year, month, day);
          const isSelected = selected ? isSameDay(date, selected) : false;
          const isToday = isSameDay(date, today);
          const isDisabled =
            (min ? isBeforeDay(date, min) : false) ||
            (max ? isAfterDay(date, max) : false);

          // Range highlight support (for DateRangePicker reuse)
          let inRange = false;
          if (highlightRange?.start && highlightRange?.end) {
            inRange = !isBeforeDay(date, highlightRange.start) && !isAfterDay(date, highlightRange.end);
          }

          return (
            <button
              key={i}
              type="button"
              disabled={isDisabled}
              onClick={() => !isDisabled && onSelect(date)}
              onMouseEnter={() => { setHoveredDay(day); onDayHover?.(date); }}
              onMouseLeave={() => { setHoveredDay(null); onDayHover?.(null); }}
              aria-label={formatDate(date)}
              aria-pressed={isSelected}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                height: calCellSize[size], width: '100%',
                border: isToday && !isSelected ? `1px solid var(--lucent-border-strong)` : '1px solid transparent',
                borderRadius: 'var(--lucent-radius-md)',
                background: isSelected
                  ? 'var(--lucent-accent-default)'
                  : inRange
                  ? 'var(--lucent-accent-subtle)'
                  : hoveredDay === day && !isDisabled
                  ? 'color-mix(in srgb, var(--lucent-accent-default) 14%, transparent)'
                  : 'transparent',
                color: isSelected
                  ? 'var(--lucent-accent-fg)'
                  : isDisabled
                  ? 'var(--lucent-text-disabled)'
                  : 'var(--lucent-text-primary)',
                fontSize: calFontSize[size],
                fontFamily: 'var(--lucent-font-family-base)',
                fontWeight: isToday ? 'var(--lucent-font-weight-medium)' : 'var(--lucent-font-weight-regular)',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                transition: 'background var(--lucent-duration-fast)',
              }}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── DatePicker ───────────────────────────────────────────────────────────────

export function DatePicker({
  value: controlledValue,
  defaultValue,
  onChange,
  placeholder = 'Pick a date',
  disabled = false,
  min,
  max,
  size = 'md',
  label,
  helperText,
  errorText,
  style,
}: DatePickerProps) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<Date | undefined>(defaultValue);
  const selected = isControlled ? controlledValue : internalValue;
  const hasError = Boolean(errorText);
  const isDisabled = disabled;

  const inputId = `lucent-datepicker-${Math.random().toString(36).slice(2, 7)}`;
  const today = new Date();
  const [viewYear, setViewYear] = useState((selected ?? today).getFullYear());
  const [viewMonth, setViewMonth] = useState((selected ?? today).getMonth());

  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node) && !dropdownRef.current?.contains(e.target as Node)) setOpen(false);
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
    if (!isControlled) setInternalValue(date);
    onChange?.(date);
    setOpen(false);
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

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
          {selected ? formatDate(selected) : placeholder}
        </span>
      </button>

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
          aria-label="Date picker"
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
            minWidth: calMinWidth[size],
          }}
        >
          <Calendar
            year={viewYear}
            month={viewMonth}
            {...(selected !== undefined && { selected })}
            today={today}
            {...(min !== undefined && { min })}
            {...(max !== undefined && { max })}
            onSelect={handleSelect}
            onPrevMonth={prevMonth}
            onNextMonth={nextMonth}
            size={size}
          />
        </div>
      , document.body)}
    </div>
  );
}

// Export Calendar for reuse in DateRangePicker
export { Calendar, NavButton, formatDate, isSameDay, isBeforeDay, isAfterDay, daysInMonth, startDayOfMonth, MONTHS, WEEKDAYS, calPadding, calMinWidth };

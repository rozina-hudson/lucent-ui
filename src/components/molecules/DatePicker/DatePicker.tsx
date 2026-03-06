import { useState, useRef, useEffect, type CSSProperties } from 'react';
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

export interface DatePickerProps {
  value?: Date;
  defaultValue?: Date;
  onChange?: (date: Date) => void;
  placeholder?: string;
  disabled?: boolean;
  min?: Date;
  max?: Date;
  style?: CSSProperties;
}

// ─── Nav button ───────────────────────────────────────────────────────────────

function NavButton({ dir, onClick, disabled }: { dir: 'prev' | 'next'; onClick: () => void; disabled?: boolean }) {
  const [hovered, setHovered] = useState(false);
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
        width: 28, height: 28,
        border: 'none',
        borderRadius: 'var(--lucent-radius-md)',
        background: hovered && !disabled ? 'var(--lucent-bg-muted)' : 'transparent',
        color: disabled ? 'var(--lucent-text-disabled)' : 'var(--lucent-text-secondary)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background var(--lucent-duration-fast)',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
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
  highlightRange,
}: {
  year: number; month: number;
  selected?: Date; today: Date;
  min?: Date; max?: Date;
  onSelect: (d: Date) => void;
  onPrevMonth: () => void; onNextMonth: () => void;
  highlightRange?: { start?: Date; end?: Date };
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
        <NavButton dir="prev" onClick={onPrevMonth} />
        <Text weight="medium" size="sm">{MONTHS[month]} {year}</Text>
        <NavButton dir="next" onClick={onNextMonth} />
      </div>

      {/* Weekday labels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 'var(--lucent-space-1)' }}>
        {WEEKDAYS.map(d => (
          <div key={d} style={{ textAlign: 'center' }}>
            <Text size="xs" color="secondary">{d}</Text>
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
              onMouseEnter={() => setHoveredDay(day)}
              onMouseLeave={() => setHoveredDay(null)}
              aria-label={formatDate(date)}
              aria-pressed={isSelected}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                height: 32, width: '100%',
                border: isToday && !isSelected ? `1px solid var(--lucent-border-strong)` : '1px solid transparent',
                borderRadius: 'var(--lucent-radius-md)',
                background: isSelected
                  ? 'var(--lucent-accent-default)'
                  : inRange
                  ? 'var(--lucent-accent-subtle)'
                  : hoveredDay === day && !isDisabled
                  ? 'var(--lucent-bg-muted)'
                  : 'transparent',
                color: isSelected
                  ? 'var(--lucent-text-on-accent)'
                  : isDisabled
                  ? 'var(--lucent-text-disabled)'
                  : 'var(--lucent-text-primary)',
                fontSize: 'var(--lucent-font-size-sm)',
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
  style,
}: DatePickerProps) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<Date | undefined>(defaultValue);
  const selected = isControlled ? controlledValue : internalValue;

  const today = new Date();
  const [viewYear, setViewYear] = useState((selected ?? today).getFullYear());
  const [viewMonth, setViewMonth] = useState((selected ?? today).getMonth());

  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
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

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block', ...style }}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(o => !o)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-haspopup="dialog"
        aria-expanded={open}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 'var(--lucent-space-2)',
          padding: 'var(--lucent-space-2) var(--lucent-space-3)',
          borderRadius: 'var(--lucent-radius-md)',
          border: `1px solid ${focused ? 'var(--lucent-accent-default)' : 'var(--lucent-border-default)'}`,
          background: disabled ? 'var(--lucent-bg-muted)' : 'var(--lucent-surface-default)',
          color: selected ? 'var(--lucent-text-primary)' : 'var(--lucent-text-secondary)',
          fontFamily: 'var(--lucent-font-family-base)',
          fontSize: 'var(--lucent-font-size-sm)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          outline: focused ? `2px solid var(--lucent-focus-ring)` : 'none',
          outlineOffset: 2,
          minWidth: 160,
          transition: 'border-color var(--lucent-duration-fast)',
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

      {open && (
        <div
          role="dialog"
          aria-label="Date picker"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            zIndex: 1000,
            background: 'var(--lucent-surface-overlay)',
            border: '1px solid var(--lucent-border-default)',
            borderRadius: 'var(--lucent-radius-lg)',
            boxShadow: 'var(--lucent-shadow-md)',
            padding: 'var(--lucent-space-4)',
            minWidth: 260,
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
          />
        </div>
      )}
    </div>
  );
}

// Export Calendar for reuse in DateRangePicker
export { Calendar, NavButton, formatDate, isSameDay, isBeforeDay, isAfterDay, daysInMonth, startDayOfMonth, MONTHS, WEEKDAYS };

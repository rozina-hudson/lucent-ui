import { type CSSProperties } from 'react';
import { Button } from '../../atoms/Button/index.js';
import { DateRangePicker } from '../DateRangePicker/index.js';
import type { DateRange } from '../DateRangePicker/DateRangePicker.js';

// ─── Types ───────────────────────────────────────────────────────────────────

export type FilterDateRangeSize = 'sm' | 'md' | 'lg';
export type FilterDateRangeVariant = 'secondary' | 'outline';

export interface FilterDateRangeProps {
  /** Label shown on the trigger button when no range is selected. */
  label?: string;
  value?: DateRange;
  defaultValue?: DateRange;
  onChange?: (range: DateRange) => void;
  /** Button style. "outline" switches to "secondary" when a range is selected. Default: "secondary". */
  variant?: FilterDateRangeVariant;
  size?: FilterDateRangeSize;
  min?: Date;
  max?: Date;
  disabled?: boolean;
  style?: CSSProperties;
}

// ─── Formatting ──────────────────────────────────────────────────────────────

function formatRange(range: DateRange | undefined, label: string): string {
  if (!range) return label;
  const fmt = (d: Date) => d.toLocaleDateString();
  return `${fmt(range.start)} → ${fmt(range.end)}`;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function FilterDateRange({
  label = 'Date range',
  value,
  defaultValue,
  onChange,
  variant = 'secondary',
  size = 'sm',
  min,
  max,
  disabled = false,
  style,
}: FilterDateRangeProps) {
  const hasValue = value !== undefined;

  return (
    <DateRangePicker
      size={size}
      {...(value !== undefined && { value })}
      {...(defaultValue !== undefined && { defaultValue })}
      {...(onChange !== undefined && { onChange })}
      {...(min !== undefined && { min })}
      {...(max !== undefined && { max })}
      disabled={disabled}
      trigger={
        <Button
          variant={variant === 'outline' && hasValue ? 'secondary' : variant}
          size={size}
          chevron
          disabled={disabled}
        >
          {formatRange(value, label)}
        </Button>
      }
      {...(style !== undefined && { style })}
    />
  );
}

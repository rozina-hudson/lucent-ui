import { useState, type CSSProperties, type ReactNode } from 'react';
import { Button } from '../../atoms/Button/index.js';
import { Menu, MenuItem, MenuSeparator } from '../Menu/index.js';
import { Text } from '../../atoms/Text/index.js';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface FilterSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export type FilterSelectSize = 'sm' | 'md' | 'lg';
export type FilterSelectVariant = 'secondary' | 'outline';

export interface FilterSelectProps {
  /** Label shown on the trigger button when no value is selected. */
  label: string;
  options: FilterSelectOption[];
  /** Controlled selected value. */
  value?: string;
  /** Initial value for uncontrolled usage. */
  defaultValue?: string;
  onChange?: (value: string | undefined) => void;
  /** Button style. "outline" switches to "secondary" when a value is selected. Default: "secondary". */
  variant?: FilterSelectVariant;
  size?: FilterSelectSize;
  disabled?: boolean;
  /** Icon rendered before the label in the trigger button. */
  icon?: ReactNode;
  style?: CSSProperties;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function FilterSelect({
  label,
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  variant = 'secondary',
  size = 'sm',
  disabled = false,
  icon,
  style,
}: FilterSelectProps) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);
  const selected = isControlled ? controlledValue : internalValue;

  const selectedLabel = options.find(o => o.value === selected)?.label;
  const hasValue = selected !== undefined;

  const handleSelect = (val: string) => {
    if (!isControlled) setInternalValue(val);
    onChange?.(val);
  };

  const handleClear = () => {
    if (!isControlled) setInternalValue(undefined);
    onChange?.(undefined);
  };

  return (
    <Menu
      trigger={
        <Button
          variant={variant === 'outline' && hasValue ? 'secondary' : variant}
          size={size}
          chevron
          disabled={disabled}
          {...(icon !== undefined && { leftIcon: icon })}
        >
          {selectedLabel ?? label}
        </Button>
      }
      size={size}
      {...(style !== undefined && { style })}
    >
      {options.map(opt => (
        <MenuItem
          key={opt.value}
          selected={selected === opt.value}
          {...(opt.disabled !== undefined && { disabled: opt.disabled })}
          onSelect={() => handleSelect(opt.value)}
        >
          {opt.label}
        </MenuItem>
      ))}
      {hasValue && (
        <>
          <MenuSeparator />
          <MenuItem onSelect={handleClear}>
            <Text size={size === 'lg' ? 'md' : 'sm'} color="secondary">Clear</Text>
          </MenuItem>
        </>
      )}
    </Menu>
  );
}

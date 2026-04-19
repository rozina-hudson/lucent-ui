import { useState, useRef, useEffect, type CSSProperties } from 'react';
import { Button } from '../../atoms/Button/index.js';
import { Input } from '../../atoms/Input/index.js';
import { Search } from '../../../icons/Search.js';

// ─── Types ───────────────────────────────────────────────────────────────────

export type FilterSearchSize = 'sm' | 'md' | 'lg';
export type FilterSearchVariant = 'secondary' | 'outline';

export interface FilterSearchProps {
  /** Controlled search value. */
  value?: string;
  /** Initial value for uncontrolled usage. */
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  /** Button style when collapsed. Default: "secondary". */
  variant?: FilterSearchVariant;
  size?: FilterSearchSize;
  /** Width of the expanded input. Default: 260. */
  width?: number;
  disabled?: boolean;
  style?: CSSProperties;
}

// ─── Search icon ─────────────────────────────────────────────────────────────

const SearchIcon = () => (
  <span aria-hidden style={{ display: 'inline-flex', width: 16, height: 16 }}><Search /></span>
);

// ─── Component ───────────────────────────────────────────────────────────────

export function FilterSearch({
  value: controlledValue,
  defaultValue = '',
  onChange,
  placeholder = 'Search…',
  variant = 'secondary',
  size = 'sm',
  width = 260,
  disabled = false,
  style,
}: FilterSearchProps) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = isControlled ? controlledValue : internalValue;

  const [expanded, setExpanded] = useState(!!currentValue);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when expanding
  useEffect(() => {
    if (expanded) {
      // Defer to next frame so the input is mounted
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [expanded]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!isControlled) setInternalValue(val);
    onChange?.(val);
  };

  const handleBlur = () => {
    if (!currentValue) setExpanded(false);
  };

  const handleExpand = () => {
    if (!disabled) setExpanded(true);
  };

  if (expanded) {
    return (
      <Input
        ref={inputRef}
        placeholder={placeholder}
        size={size}
        value={currentValue}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled}
        style={{ width, ...style }}
      />
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      disabled={disabled}
      onClick={handleExpand}
      aria-label="Search"
      leftIcon={<SearchIcon />}
      style={style}
    />
  );
}

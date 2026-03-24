import { useRef, useState, useLayoutEffect, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { Input, type InputSize } from '../../atoms/Input/Input.js';
import { Spinner } from '../../atoms/Spinner/Spinner.js';
import { Text } from '../../atoms/Text/Text.js';

export interface SearchResult {
  id: string | number;
  label: string;
}

export type SearchInputMode = 'search' | 'filter';

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  mode?: SearchInputMode;
  placeholder?: string;
  size?: InputSize;
  label?: string;
  helperText?: string;
  errorText?: string;
  results?: SearchResult[];
  onResultSelect?: (result: SearchResult) => void;
  isLoading?: boolean;
  disabled?: boolean;
  id?: string;
  style?: CSSProperties;
}

const iconSizes: Record<InputSize, number> = { sm: 14, md: 18, lg: 20 };
const dropdownTextSize: Record<InputSize, 'sm' | 'md'> = { sm: 'sm', md: 'md', lg: 'md' };
const dropdownPadding: Record<InputSize, string> = { sm: 'var(--lucent-space-1)', md: 'var(--lucent-space-2)', lg: 'var(--lucent-space-2)' };

const SearchIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const FilterIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M2 3h12M4 8h8M6 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const ClearIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export function SearchInput({
  value,
  onChange,
  mode = 'search',
  placeholder,
  size = 'md',
  label,
  helperText,
  errorText,
  results = [],
  onResultSelect,
  isLoading = false,
  disabled = false,
  id,
  style,
}: SearchInputProps) {
  const resolvedPlaceholder = placeholder ?? (mode === 'filter' ? 'Filter…' : 'Search…');
  const [focused, setFocused] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });

  const showDropdown = mode === 'search' && focused && results.length > 0;

  useLayoutEffect(() => {
    if (!showDropdown || !wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    setDropdownPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
  }, [showDropdown]);

  const handleClear = () => {
    onChange('');
  };

  const handleResultClick = (result: SearchResult) => {
    onResultSelect?.(result);
    setFocused(false);
  };

  const handleBlur = () => {
    // Delay close so result click can fire first
    closeTimer.current = setTimeout(() => setFocused(false), 150);
  };

  const handleFocus = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setFocused(true);
  };

  const rightSlot = isLoading ? (
    <Spinner size="sm" />
  ) : value ? (
    <button
      type="button"
      aria-label={mode === 'filter' ? 'Clear filter' : 'Clear search'}
      onClick={handleClear}
      style={{
        display: 'flex',
        alignItems: 'center',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 2,
        borderRadius: 'var(--lucent-radius-sm)',
        color: 'var(--lucent-text-secondary)',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--lucent-text-primary)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--lucent-text-secondary)'; }}
    >
      <ClearIcon />
    </button>
  ) : null;

  return (
    <div ref={wrapperRef} style={{ ...style }}>
      <Input
        id={id}
        type="text"
        size={size}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={resolvedPlaceholder}
        disabled={disabled}
        leftElement={mode === 'filter' ? <FilterIcon size={iconSizes[size]} /> : <SearchIcon size={iconSizes[size]} />}
        rightElement={rightSlot ?? undefined}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...(label !== undefined && { label })}
        {...(helperText !== undefined && { helperText })}
        {...(errorText !== undefined && { errorText })}
      />
      {showDropdown && createPortal(
        <div
          ref={dropdownRef}
          role="listbox"
          style={{
            position: 'fixed',
            top: dropdownPos.top,
            left: dropdownPos.left,
            width: dropdownPos.width,
            zIndex: 1000,
            background: 'color-mix(in srgb, var(--lucent-surface-overlay) 85%, transparent)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            border: '1px solid color-mix(in srgb, var(--lucent-accent-default) 15%, var(--lucent-border-default))',
            borderRadius: 'var(--lucent-radius-lg)',
            boxShadow: '0 0 24px -4px color-mix(in srgb, var(--lucent-accent-default) 12%, transparent), var(--lucent-shadow-md)',
            padding: dropdownPadding[size],
          }}
        >
          {results.map((result, idx) => (
            <div
              key={result.id}
              role="option"
              aria-selected={false}
              onMouseDown={() => handleResultClick(result)}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                padding: 'var(--lucent-space-2)',
                borderRadius: 'var(--lucent-radius-md)',
                cursor: 'pointer',
                background: hoveredIndex === idx ? 'color-mix(in srgb, var(--lucent-accent-default) 20%, var(--lucent-surface-secondary))' : 'transparent',
                transition: `background var(--lucent-duration-fast) var(--lucent-easing-default)`,
              }}
            >
              <Text as="span" size={dropdownTextSize[size]}>{result.label}</Text>
            </div>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}

import { useRef, useState, type CSSProperties } from 'react';
import { Input } from '../../atoms/Input/Input.js';
import { Spinner } from '../../atoms/Spinner/Spinner.js';
import { Text } from '../../atoms/Text/Text.js';

export interface SearchResult {
  id: string | number;
  label: string;
}

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  results?: SearchResult[];
  onResultSelect?: (result: SearchResult) => void;
  isLoading?: boolean;
  disabled?: boolean;
  id?: string;
  style?: CSSProperties;
}

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
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
  placeholder = 'Search…',
  results = [],
  onResultSelect,
  isLoading = false,
  disabled = false,
  id,
  style,
}: SearchInputProps) {
  const [focused, setFocused] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showDropdown = focused && results.length > 0;

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
      aria-label="Clear search"
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
    <div style={{ position: 'relative', ...style }}>
      <Input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        leftElement={<SearchIcon />}
        rightElement={rightSlot ?? undefined}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {showDropdown && (
        <div
          role="listbox"
          style={{
            position: 'absolute',
            top: 'calc(100% + var(--lucent-space-1))',
            left: 0,
            right: 0,
            zIndex: 50,
            background: 'var(--lucent-surface-overlay)',
            border: '1px solid var(--lucent-border-default)',
            borderRadius: 'var(--lucent-radius-md)',
            boxShadow: 'var(--lucent-shadow-md)',
            overflow: 'hidden',
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
                padding: 'var(--lucent-space-2) var(--lucent-space-3)',
                cursor: 'pointer',
                background: hoveredIndex === idx ? 'var(--lucent-bg-subtle)' : 'transparent',
                transition: `background var(--lucent-duration-fast) var(--lucent-easing-default)`,
              }}
            >
              <Text as="span" size="md">{result.label}</Text>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

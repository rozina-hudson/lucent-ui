import {
  useState, useEffect, useRef, useCallback,
  type CSSProperties, type ReactNode, type KeyboardEvent,
} from 'react';
import { Button } from '../../atoms/Button/index.js';
import { Text } from '../../atoms/Text/index.js';
import { Search } from '../../../icons/Search.js';

// ─── Keyframes ────────────────────────────────────────────────────────────────

const KEYFRAMES = `
@keyframes lucent-palette-in {
  from { opacity: 0; transform: scale(0.96) translateY(-8px); }
  to   { opacity: 1; transform: scale(1)    translateY(0);    }
}
`;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  group?: string;
  onSelect: () => void;
  disabled?: boolean;
}

export interface CommandPaletteProps {
  commands: CommandItem[];
  placeholder?: string;
  /** Key that triggers open when held with Meta (Mac) or Ctrl (Win). Default: 'k' */
  shortcutKey?: string;
  /** Controlled open state */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  style?: CSSProperties;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function matches(item: CommandItem, query: string): boolean {
  const q = query.toLowerCase();
  return (
    item.label.toLowerCase().includes(q) ||
    (item.description?.toLowerCase().includes(q) ?? false)
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CommandPalette({
  commands,
  placeholder = 'Search commands…',
  shortcutKey = 'k',
  open: controlledOpen,
  onOpenChange,
  style,
}: CommandPaletteProps) {
  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isControlled ? controlledOpen! : internalOpen;

  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const styleInjected = useRef(false);

  if (!styleInjected.current) {
    const el = document.createElement('style');
    el.textContent = KEYFRAMES;
    document.head.appendChild(el);
    styleInjected.current = true;
  }

  const setOpen = useCallback((value: boolean) => {
    if (!isControlled) setInternalOpen(value);
    onOpenChange?.(value);
  }, [isControlled, onOpenChange]);

  // ⌘K / Ctrl+K global listener
  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === shortcutKey) {
        e.preventDefault();
        setOpen(!open);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, shortcutKey, setOpen]);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  const filtered = query ? commands.filter(c => matches(c, query)) : commands;
  const enabled = filtered.filter(c => !c.disabled);

  // Scroll active item into view
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const active = list.querySelector('[data-active="true"]') as HTMLElement | null;
    active?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const handleSelect = (item: CommandItem) => {
    if (item.disabled) return;
    item.onSelect();
    setOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') { setOpen(false); return; }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (enabled.length > 0) {
        setActiveIndex(i => (i + 1) % enabled.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (enabled.length > 0) {
        setActiveIndex(i => (i - 1 + enabled.length) % enabled.length);
      }
    } else if (e.key === 'Enter') {
      const item = enabled[activeIndex];
      if (item) handleSelect(item);
    }
  };

  // Group the filtered results
  const grouped: { group: string | undefined; items: CommandItem[] }[] = [];
  for (const item of filtered) {
    const last = grouped[grouped.length - 1];
    if (last && last.group === item.group) {
      last.items.push(item);
    } else {
      grouped.push({ group: item.group, items: [item] });
    }
  }

  if (!open) return null;

  // Map enabled items to their flat index for active tracking
  let enabledCounter = 0;

  return (
    <div
      role="dialog"
      aria-label="Command palette"
      aria-modal="true"
      onClick={() => setOpen(false)}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9000,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '15vh',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        background: 'rgba(0, 0, 0, 0.15)',
        ...style,
      }}
    >
      <div
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded="true"
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 560,
          margin: '0 var(--lucent-space-4)',
          background: 'color-mix(in srgb, var(--lucent-surface-overlay) 85%, transparent)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          borderRadius: 'var(--lucent-radius-xl)',
          border: '1px solid color-mix(in srgb, var(--lucent-accent-default) 15%, var(--lucent-border-default))',
          boxShadow: '0 0 24px -4px color-mix(in srgb, var(--lucent-accent-default) 12%, transparent), var(--lucent-shadow-xl)',
          overflow: 'hidden',
          animation: 'lucent-palette-in 150ms var(--lucent-easing-decelerate)',
        }}
      >
        {/* Search input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--lucent-space-3)',
          padding: 'var(--lucent-space-3) var(--lucent-space-4)',
          borderBottom: filtered.length > 0 ? '1px solid var(--lucent-border-subtle)' : 'none',
        }}>
          <span aria-hidden style={{ display: 'inline-flex', width: 16, height: 16, flexShrink: 0, color: 'var(--lucent-text-secondary)' }}><Search /></span>
          <input
            ref={inputRef}
            role="searchbox"
            aria-autocomplete="list"
            aria-controls="lucent-command-list"
            value={query}
            onChange={e => { setQuery(e.target.value); setActiveIndex(0); }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontFamily: 'var(--lucent-font-family-base)',
              fontSize: 'var(--lucent-font-size-md)',
              color: 'var(--lucent-text-primary)',
              lineHeight: 'var(--lucent-line-height-base)',
            }}
          />
          <Button size="xs" variant="outline" tabIndex={-1} style={{ pointerEvents: 'none', flexShrink: 0 }}>Esc</Button>
        </div>

        {/* Results */}
        <div
          id="lucent-command-list"
          role="listbox"
          ref={listRef}
          style={{ maxHeight: 360, overflowY: 'auto', padding: 'var(--lucent-space-1) var(--lucent-space-2)' }}
        >
          {filtered.length === 0 ? (
            <div style={{ padding: 'var(--lucent-space-8)', textAlign: 'center' }}>
              <Text color="secondary">No results for "{query}"</Text>
            </div>
          ) : (
            grouped.map(({ group, items }, gi) => (
              <div key={gi}>
                {group && (
                  <div style={{
                    padding: 'var(--lucent-space-2) var(--lucent-space-2) var(--lucent-space-1)',
                    ...(gi > 0 ? { borderTop: '1px solid var(--lucent-border-subtle)', marginTop: 'var(--lucent-space-2)' } : {}),
                  }}>
                    <Text size="xs" color="secondary" weight="medium">{group}</Text>
                  </div>
                )}
                {items.map(item => {
                  const isDisabled = item.disabled ?? false;
                  let isActive = false;
                  if (!isDisabled) {
                    isActive = enabledCounter === activeIndex;
                    enabledCounter++;
                  }
                  return (
                    <div
                      key={item.id}
                      role="option"
                      aria-selected={isActive}
                      aria-disabled={isDisabled}
                      data-active={isActive}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => {
                        if (!isDisabled) {
                          const idx = enabled.indexOf(item);
                          if (idx !== -1) setActiveIndex(idx);
                        }
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--lucent-space-3)',
                        padding: 'var(--lucent-space-2) var(--lucent-space-3)',
                        borderRadius: 'var(--lucent-radius-md)',
                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                        background: isActive ? 'color-mix(in srgb, var(--lucent-accent-default) 20%, var(--lucent-surface-secondary))' : 'transparent',
                        transition: 'background var(--lucent-duration-fast) var(--lucent-easing-default)',
                        opacity: isDisabled ? 0.5 : 1,
                      }}
                    >
                      {item.icon && (
                        <span style={{ flexShrink: 0, color: 'var(--lucent-text-secondary)', display: 'flex' }}>
                          {item.icon}
                        </span>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Text size="sm" weight="medium" truncate>{item.label}</Text>
                        {item.description && (
                          <Text size="xs" color="secondary" truncate>{item.description}</Text>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer hint */}
        <div style={{
          display: 'flex',
          gap: 'var(--lucent-space-4)',
          padding: 'var(--lucent-space-2) var(--lucent-space-4)',
          borderTop: '1px solid var(--lucent-border-subtle)',
          background: 'var(--lucent-surface-secondary)',
        }}>
          {[
            ['↑↓', 'Navigate'],
            ['↵', 'Select'],
            ['Esc', 'Close'],
          ].map(([key, label]) => (
            <span key={key} style={{ display: 'flex', alignItems: 'center', gap: 'var(--lucent-space-1)' }}>
              <Button size="xs" variant="outline" tabIndex={-1} style={{ pointerEvents: 'none' }}>{key}</Button>
              <Text size="xs" color="secondary">{label}</Text>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

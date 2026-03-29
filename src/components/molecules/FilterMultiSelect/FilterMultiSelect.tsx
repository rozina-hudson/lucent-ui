import {
  useState, useEffect, useLayoutEffect, useRef, useCallback,
  type CSSProperties, type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../../atoms/Button/index.js';
import { Chip } from '../../atoms/Chip/index.js';
import { Checkbox } from '../../atoms/Checkbox/index.js';
import { Text } from '../../atoms/Text/index.js';

// ─── Keyframes (shared with Menu) ────────────────────────────────────────────

const ANIM_DURATION = 120;

const KEYFRAMES = `
@keyframes lucent-filter-ms-in {
  from { opacity: 0; transform: scale(0.97) translateY(-2px); }
  to   { opacity: 1; transform: scale(1)    translateY(0);    }
}
@keyframes lucent-filter-ms-out {
  from { opacity: 1; transform: scale(1)    translateY(0);    }
  to   { opacity: 0; transform: scale(0.97) translateY(-2px); }
}
`;

let keyframesInjected = false;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface FilterMultiSelectOption {
  value: string;
  label: string;
  /** Hex color — renders a Chip with swatch dot instead of plain text. */
  swatch?: string;
  disabled?: boolean;
}

export type FilterMultiSelectSize = 'sm' | 'md' | 'lg';

export type FilterMultiSelectVariant = 'secondary' | 'outline';

export interface FilterMultiSelectProps {
  /** Label shown on the trigger button. */
  label: string;
  options: FilterMultiSelectOption[];
  /** Controlled selected values. */
  value?: string[];
  /** Initial values for uncontrolled usage. */
  defaultValue?: string[];
  onChange?: (values: string[]) => void;
  /** Button style. "outline" switches to "secondary" when items are selected. Default: "secondary". */
  variant?: FilterMultiSelectVariant;
  size?: FilterMultiSelectSize;
  disabled?: boolean;
  /** Icon rendered before the label in the trigger button. */
  icon?: ReactNode;
  style?: CSSProperties;
}

// ─── Size maps ───────────────────────────────────────────────────────────────

const padMap: Record<FilterMultiSelectSize, string> = {
  sm: 'var(--lucent-space-2)',
  md: 'var(--lucent-space-2)',
  lg: 'var(--lucent-space-3)',
};

const fontMap: Record<FilterMultiSelectSize, 'sm' | 'md' | 'lg'> = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
};

// ─── Positioning ─────────────────────────────────────────────────────────────

const GAP = 4;

function computePos(triggerRect: DOMRect, popover: HTMLElement) {
  const ph = popover.offsetHeight;
  const pw = popover.offsetWidth;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let top = triggerRect.bottom + GAP;
  let left = triggerRect.left;
  let origin = 'top left';

  // Flip to top if overflows bottom
  if (top + ph > vh && triggerRect.top - ph - GAP >= 0) {
    top = triggerRect.top - ph - GAP;
    origin = 'bottom left';
  }

  // Clamp horizontal
  if (left + pw > vw) left = vw - pw - 8;
  if (left < 0) left = 8;

  return { top, left, transformOrigin: origin };
}

// ─── Component ───────────────────────────────────────────────────────────────

export function FilterMultiSelect({
  label,
  options,
  value: controlledValue,
  defaultValue = [],
  onChange,
  variant = 'secondary',
  size = 'sm',
  disabled = false,
  icon,
  style,
}: FilterMultiSelectProps) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<string[]>(defaultValue);
  const selected = isControlled ? controlledValue : internalValue;

  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [animState, setAnimState] = useState<'idle' | 'entering' | 'exiting'>('idle');
  const [pos, setPos] = useState<{ top: number; left: number; transformOrigin: string } | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLSpanElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Inject keyframes
  if (!keyframesInjected && typeof document !== 'undefined') {
    const el = document.createElement('style');
    el.textContent = KEYFRAMES;
    document.head.appendChild(el);
    keyframesInjected = true;
  }

  // Open / close animation
  useEffect(() => {
    if (open) {
      setVisible(true);
      setAnimState('entering');
      setActiveIndex(-1);
    } else if (visible) {
      setAnimState('exiting');
      const timer = setTimeout(() => {
        setVisible(false);
        setAnimState('idle');
      }, ANIM_DURATION);
      return () => clearTimeout(timer);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Position
  useLayoutEffect(() => {
    if (!visible || animState !== 'entering' || !containerRef.current) return;
    const frame = requestAnimationFrame(() => {
      const popover = popoverRef.current;
      const trigger = containerRef.current;
      if (!popover || !trigger) return;
      setPos(computePos(trigger.getBoundingClientRect(), popover));
    });
    return () => cancelAnimationFrame(frame);
  }, [visible, animState]);

  const close = useCallback(() => setOpen(false), []);

  // Outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (containerRef.current?.contains(target)) return;
      if (popoverRef.current?.contains(target)) return;
      close();
    };
    const frame = requestAnimationFrame(() => {
      document.addEventListener('mousedown', handler);
    });
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('mousedown', handler);
    };
  }, [open, close]);

  // Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, close]);

  const toggle = (val: string) => {
    const next = selected.includes(val)
      ? selected.filter(v => v !== val)
      : [...selected, val];
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  };

  const clearAll = () => {
    if (!isControlled) setInternalValue([]);
    onChange?.([]);
    close();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => (i + 1) % options.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => (i - 1 + options.length) % options.length);
    } else if ((e.key === 'Enter' || e.key === ' ') && activeIndex >= 0) {
      e.preventDefault();
      const opt = options[activeIndex];
      if (opt && !opt.disabled) toggle(opt.value);
    }
  };

  const pad = padMap[size];
  const fontSize = fontMap[size];

  return (
    <span ref={containerRef} style={{ display: 'inline-flex', ...style }}>
      <Button
        variant={variant === 'outline' && selected.length > 0 ? 'secondary' : variant}
        size={size}
        chevron
        disabled={disabled}
        onClick={() => !disabled && setOpen(o => !o)}
        {...(icon !== undefined && { leftIcon: icon })}
      >
        {label}
        {selected.length > 0 && (
          <Chip variant="accent" size={size}>{selected.length}</Chip>
        )}
      </Button>

      {visible && createPortal(
        <div
          ref={popoverRef}
          role="listbox"
          aria-multiselectable
          aria-label={label}
          tabIndex={-1}
          onKeyDown={handleKeyDown}
          style={{
            position: 'fixed',
            top: pos?.top ?? -9999,
            left: pos?.left ?? -9999,
            zIndex: 1000,
            minWidth: 180,
            background: 'color-mix(in srgb, var(--lucent-surface-overlay) 85%, transparent)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            border: '1px solid color-mix(in srgb, var(--lucent-accent-default) 15%, var(--lucent-border-default))',
            borderRadius: 'var(--lucent-radius-lg)',
            boxShadow: '0 0 24px -4px color-mix(in srgb, var(--lucent-accent-default) 12%, transparent), var(--lucent-shadow-md)',
            padding: pad,
            maxHeight: 'min(320px, calc(100vh - 32px))',
            overflowY: 'auto',
            animation: animState === 'exiting'
              ? `lucent-filter-ms-out ${ANIM_DURATION}ms var(--lucent-easing-default) forwards`
              : `lucent-filter-ms-in ${ANIM_DURATION}ms var(--lucent-easing-decelerate)`,
            transformOrigin: pos?.transformOrigin ?? 'top left',
            outline: 'none',
            pointerEvents: animState === 'exiting' ? 'none' : 'auto',
            fontFamily: 'var(--lucent-font-family-base)',
          }}
        >
          {options.map((opt, i) => {
            const isSelected = selected.includes(opt.value);
            const isActive = activeIndex === i;
            return (
              <div
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                aria-disabled={opt.disabled}
                onClick={() => !opt.disabled && toggle(opt.value)}
                onMouseEnter={() => setActiveIndex(i)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--lucent-space-2)',
                  padding: `var(--lucent-space-2) ${pad}`,
                  borderRadius: 'var(--lucent-radius-md)',
                  cursor: opt.disabled ? 'not-allowed' : 'pointer',
                  background: isActive
                    ? 'var(--lucent-surface-secondary)'
                    : 'transparent',
                  opacity: opt.disabled ? 0.5 : 1,
                  transition: 'background var(--lucent-duration-fast) var(--lucent-easing-default)',
                }}
              >
                <Checkbox
                  checked={isSelected}
                  onChange={() => {}}
                  disabled={opt.disabled}
                  style={{ pointerEvents: 'none' }}
                />
                {opt.swatch ? (
                  <Chip size={size} swatch={opt.swatch}>{opt.label}</Chip>
                ) : (
                  <Text size={fontSize}>{opt.label}</Text>
                )}
              </div>
            );
          })}

          {/* Clear all footer */}
          <div
            role="separator"
            style={{
              height: 1,
              margin: 'var(--lucent-space-1) 0',
              background: 'var(--lucent-border-subtle)',
            }}
          />
          <div
            onClick={selected.length > 0 ? clearAll : undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: `var(--lucent-space-2) ${pad}`,
              borderRadius: 'var(--lucent-radius-md)',
              cursor: selected.length > 0 ? 'pointer' : 'default',
              opacity: selected.length > 0 ? 1 : 0.5,
            }}
          >
            <Text size={fontSize} color={selected.length > 0 ? 'secondary' : 'disabled'}>
              Clear all
            </Text>
          </div>
        </div>,
        document.body,
      )}
    </span>
  );
}

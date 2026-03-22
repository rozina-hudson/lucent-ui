import {
  useState, useEffect, useLayoutEffect, useRef, useCallback, createContext, useContext, useId,
  type CSSProperties, type ReactNode, type KeyboardEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { Text } from '../../atoms/Text/index.js';

// ─── Keyframes ────────────────────────────────────────────────────────────────

const ANIM_DURATION = 120;

const KEYFRAMES = `
@keyframes lucent-menu-in {
  from { opacity: 0; transform: scale(0.97) translateY(-2px); }
  to   { opacity: 1; transform: scale(1)    translateY(0);    }
}
@keyframes lucent-menu-out {
  from { opacity: 1; transform: scale(1)    translateY(0);    }
  to   { opacity: 0; transform: scale(0.97) translateY(-2px); }
}
`;

// ─── Types ────────────────────────────────────────────────────────────────────

export type MenuPlacement =
  | 'top' | 'top-start' | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'right';

export type MenuSize = 'sm' | 'md' | 'lg';

export interface MenuProps {
  /** Element that toggles the menu on click. */
  trigger: ReactNode;
  /** MenuItem, MenuSeparator, or MenuGroup elements. */
  children: ReactNode;
  /** Preferred placement relative to the trigger. */
  placement?: MenuPlacement;
  /** Size of the menu items. */
  size?: MenuSize;
  /** Controlled open state. */
  open?: boolean;
  /** Callback when open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** DOM element to portal the popover into. Defaults to document.body. Use this to preserve CSS custom property inheritance for per-section theming. */
  portalContainer?: HTMLElement | null;
  /** Style overrides for the popover panel. */
  style?: CSSProperties;
}

// ─── Size maps (aligned with MultiSelect) ─────────────────────────────────────

const itemPadding: Record<MenuSize, string> = {
  sm: 'var(--lucent-space-2)',
  md: 'var(--lucent-space-2)',
  lg: 'var(--lucent-space-3)',
};

const itemFontSize: Record<MenuSize, 'sm' | 'md' | 'lg'> = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
};

const groupLabelSize: Record<MenuSize, 'xs' | 'sm' | 'md'> = {
  sm: 'xs',
  md: 'sm',
  lg: 'md',
};

const checkIconSize: Record<MenuSize, number> = {
  sm: 12,
  md: 14,
  lg: 16,
};

export interface MenuItemProps {
  /** Fires when item is selected (click or Enter). */
  onSelect: () => void;
  /** Label content. */
  children: ReactNode;
  /** Leading icon. */
  icon?: ReactNode;
  /** Trailing shortcut hint text. */
  shortcut?: string;
  /** Disables selection and grays out. */
  disabled?: boolean;
  /** Renders in danger color. */
  danger?: boolean;
  /** Marks the item as currently selected (shows checkmark). */
  selected?: boolean;
  /** Style overrides. */
  style?: CSSProperties;
}

export interface MenuSeparatorProps {
  style?: CSSProperties;
}

export interface MenuGroupProps {
  /** Label shown above the group. */
  label: string;
  children: ReactNode;
  style?: CSSProperties;
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface MenuContextValue {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  registerItem: (index: number, disabled: boolean) => void;
  close: () => void;
  getItemIndex: () => number;
  size: MenuSize;
}

const MenuContext = createContext<MenuContextValue | null>(null);

// ─── Positioning ──────────────────────────────────────────────────────────────

const GAP = 4;

function computePosition(
  triggerRect: DOMRect,
  popover: HTMLElement,
  placement: MenuPlacement,
): { top: number; left: number; transformOrigin: string } {
  const pw = popover.offsetWidth;
  const ph = popover.offsetHeight;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let top = 0;
  let left = 0;
  let actualPlacement = placement;

  // Compute desired position
  const positions = {
    top: triggerRect.top - ph - GAP,
    bottom: triggerRect.bottom + GAP,
    left: triggerRect.left - pw - GAP,
    right: triggerRect.right + GAP,
  };

  // Vertical placement
  if (actualPlacement.startsWith('bottom')) {
    top = positions.bottom;
    // Auto-flip to top if overflows bottom
    if (top + ph > vh && positions.top >= 0) {
      top = positions.top;
      actualPlacement = actualPlacement.replace('bottom', 'top') as MenuPlacement;
    }
  } else if (actualPlacement.startsWith('top')) {
    top = positions.top;
    // Auto-flip to bottom if overflows top
    if (top < 0 && positions.bottom + ph <= vh) {
      top = positions.bottom;
      actualPlacement = actualPlacement.replace('top', 'bottom') as MenuPlacement;
    }
  } else if (actualPlacement === 'left') {
    top = triggerRect.top + triggerRect.height / 2 - ph / 2;
    left = positions.left;
    if (left < 0 && positions.right + pw <= vw) {
      left = positions.right;
      actualPlacement = 'right';
    }
  } else if (actualPlacement === 'right') {
    top = triggerRect.top + triggerRect.height / 2 - ph / 2;
    left = positions.right;
    if (left + pw > vw && positions.left >= 0) {
      left = positions.left;
      actualPlacement = 'left';
    }
  }

  // Horizontal alignment for top/bottom placements
  if (actualPlacement.startsWith('top') || actualPlacement.startsWith('bottom')) {
    if (actualPlacement.endsWith('-start')) {
      left = triggerRect.left;
    } else if (actualPlacement.endsWith('-end')) {
      left = triggerRect.right - pw;
    } else {
      left = triggerRect.left + triggerRect.width / 2 - pw / 2;
    }
  }

  // Clamp to viewport
  if (left + pw > vw) left = vw - pw - 8;
  if (left < 0) left = 8;
  if (top + ph > vh) top = vh - ph - 8;
  if (top < 0) top = 8;

  // Transform origin for animation
  let transformOrigin = 'top left';
  if (actualPlacement.startsWith('top')) {
    transformOrigin = actualPlacement.endsWith('-end') ? 'bottom right' : actualPlacement.endsWith('-start') ? 'bottom left' : 'bottom center';
  } else if (actualPlacement.startsWith('bottom')) {
    transformOrigin = actualPlacement.endsWith('-end') ? 'top right' : actualPlacement.endsWith('-start') ? 'top left' : 'top center';
  } else if (actualPlacement === 'left') {
    transformOrigin = 'center right';
  } else if (actualPlacement === 'right') {
    transformOrigin = 'center left';
  }

  return { top, left, transformOrigin };
}

// ─── MenuItem ─────────────────────────────────────────────────────────────────

export function MenuItem({
  onSelect,
  children,
  icon,
  shortcut,
  disabled = false,
  danger = false,
  selected = false,
  style,
}: MenuItemProps) {
  const ctx = useContext(MenuContext);
  const indexRef = useRef(-1);

  if (indexRef.current === -1 && ctx) {
    indexRef.current = ctx.getItemIndex();
    ctx.registerItem(indexRef.current, disabled);
  }

  const isActive = ctx ? ctx.activeIndex === indexRef.current : false;
  const size = ctx?.size ?? 'md';
  const pad = itemPadding[size];
  const fontSize = itemFontSize[size];
  const checkSize = checkIconSize[size];

  const handleClick = () => {
    if (disabled) return;
    onSelect();
    ctx?.close();
  };

  const handleMouseEnter = () => {
    if (!disabled && ctx) {
      ctx.setActiveIndex(indexRef.current);
    }
  };

  const textColor = disabled
    ? 'var(--lucent-text-disabled)'
    : danger
    ? 'var(--lucent-danger-text)'
    : 'var(--lucent-text-primary)';

  return (
    <div
      role="menuitemcheckbox"
      aria-checked={selected}
      aria-disabled={disabled || undefined}
      data-active={isActive || undefined}
      tabIndex={-1}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: pad,
        padding: pad,
        borderRadius: 'var(--lucent-radius-md)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        background: selected
          ? 'color-mix(in srgb, var(--lucent-accent-default) 12%, var(--lucent-surface-overlay))'
          : isActive
          ? 'var(--lucent-surface-secondary)'
          : 'transparent',
        boxShadow: selected ? 'var(--lucent-shadow-sm)' : 'none',
        transition: 'background var(--lucent-duration-fast) var(--lucent-easing-default), box-shadow var(--lucent-duration-fast) var(--lucent-easing-default)',
        opacity: disabled ? 0.5 : 1,
        outline: 'none',
        ...style,
      }}
    >
      {icon && (
        <span style={{
          flexShrink: 0,
          display: 'flex',
          color: disabled ? 'var(--lucent-text-disabled)' : danger ? 'var(--lucent-danger-text)' : 'var(--lucent-text-secondary)',
        }}>
          {icon}
        </span>
      )}
      <span style={{ flex: 1, minWidth: 0 }}>
        <Text size={fontSize} style={{ color: textColor }}>{children}</Text>
      </span>
      {shortcut && (
        <Text size={size === 'lg' ? 'sm' : 'xs'} style={{ color: 'var(--lucent-text-secondary)', flexShrink: 0 }}>{shortcut}</Text>
      )}
      {selected && (
        <span style={{
          flexShrink: 0,
          display: 'flex',
          color: 'var(--lucent-accent-default)',
        }}>
          <svg width={checkSize} height={checkSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
      )}
    </div>
  );
}

// ─── MenuSeparator ────────────────────────────────────────────────────────────

export function MenuSeparator({ style }: MenuSeparatorProps) {
  return (
    <div
      role="separator"
      style={{
        height: 1,
        margin: 'var(--lucent-space-1) 0',
        background: 'var(--lucent-border-subtle)',
        ...style,
      }}
    />
  );
}

// ─── MenuGroup ────────────────────────────────────────────────────────────────

export function MenuGroup({ label, children, style }: MenuGroupProps) {
  const ctx = useContext(MenuContext);
  const size = ctx?.size ?? 'md';
  const pad = itemPadding[size];

  return (
    <div role="group" aria-label={label} style={style}>
      <div style={{ padding: `${pad} ${pad} var(--lucent-space-1)` }}>
        <Text size={groupLabelSize[size]} color="secondary" weight="medium">{label}</Text>
      </div>
      {children}
    </div>
  );
}

// ─── Menu (root) ──────────────────────────────────────────────────────────────

export function Menu({
  trigger,
  children,
  placement = 'bottom-start',
  size = 'md',
  open: controlledOpen,
  onOpenChange,
  portalContainer,
  style,
}: MenuProps) {
  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isControlled ? controlledOpen! : internalOpen;

  // `visible` keeps the portal in the DOM during the exit animation
  const [visible, setVisible] = useState(false);
  const [animState, setAnimState] = useState<'idle' | 'entering' | 'exiting'>('idle');

  const containerRef = useRef<HTMLSpanElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const styleInjected = useRef(false);

  const [pos, setPos] = useState<{ top: number; left: number; transformOrigin: string } | null>(null);

  // Item registration
  const itemIndexCounter = useRef(0);
  const itemMap = useRef<Map<number, { disabled: boolean }>>(new Map());
  const [activeIndex, setActiveIndex] = useState(-1);

  // Inject keyframes
  if (!styleInjected.current && typeof document !== 'undefined') {
    const el = document.createElement('style');
    el.textContent = KEYFRAMES;
    document.head.appendChild(el);
    styleInjected.current = true;
  }

  // Mount portal when opening, play exit animation then unmount when closing
  useEffect(() => {
    if (open) {
      // Reset item registration before portal renders
      itemIndexCounter.current = 0;
      itemMap.current.clear();
      setVisible(true);
      setAnimState('entering');
    } else if (visible) {
      setAnimState('exiting');
      const timer = setTimeout(() => {
        setVisible(false);
        setAnimState('idle');
      }, ANIM_DURATION);
      return () => clearTimeout(timer);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const setOpen = useCallback((value: boolean) => {
    if (!isControlled) setInternalOpen(value);
    onOpenChange?.(value);
  }, [isControlled, onOpenChange]);

  const returnFocusToTrigger = useCallback(() => {
    const triggerEl = triggerRef.current;
    if (triggerEl) {
      const focusable = triggerEl.querySelector('button, [tabindex]') as HTMLElement | null;
      (focusable ?? triggerEl).focus();
    }
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    returnFocusToTrigger();
  }, [setOpen, returnFocusToTrigger]);

  // Compute position when portal mounts
  useLayoutEffect(() => {
    if (!visible || animState !== 'entering' || !containerRef.current) return;
    const frame = requestAnimationFrame(() => {
      const popover = popoverRef.current;
      const trigger = containerRef.current;
      if (!popover || !trigger) return;
      const triggerRect = trigger.getBoundingClientRect();
      setPos(computePosition(triggerRect, popover, placement));
    });
    return () => cancelAnimationFrame(frame);
  }, [visible, animState, placement]);

  // Set initial active index to first enabled item after portal mounts
  useEffect(() => {
    if (!visible || animState !== 'entering') return;
    const timer = setTimeout(() => {
      const entries = Array.from(itemMap.current.entries()).sort((a, b) => a[0] - b[0]);
      const firstEnabled = entries.find(([, v]) => !v.disabled);
      setActiveIndex(firstEnabled ? firstEnabled[0] : -1);
    }, 0);
    return () => clearTimeout(timer);
  }, [visible, animState]);

  // Outside click — defer registration so the opening click doesn't trigger it
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

  // Close on scroll (menus are transient) — skip scroll events briefly after opening
  useEffect(() => {
    if (!open) return;
    let armed = false;
    const armTimer = setTimeout(() => { armed = true; }, 50);
    const handler = () => { if (armed) close(); };
    window.addEventListener('scroll', handler, { passive: true, capture: true });
    return () => {
      clearTimeout(armTimer);
      window.removeEventListener('scroll', handler, { capture: true });
    };
  }, [open, close]);

  // Keyboard navigation
  const getEnabledIndices = useCallback(() => {
    return Array.from(itemMap.current.entries())
      .filter(([, v]) => !v.disabled)
      .map(([i]) => i)
      .sort((a, b) => a - b);
  }, []);

  const handleKeyDown = useCallback((e: globalThis.KeyboardEvent) => {
    if (!open) return;

    const enabled = getEnabledIndices();
    if (enabled.length === 0) return;

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        close();
        break;
      case 'ArrowDown': {
        e.preventDefault();
        setActiveIndex(prev => {
          const currentPos = enabled.indexOf(prev);
          return currentPos < enabled.length - 1 ? enabled[currentPos + 1]! : enabled[0]!;
        });
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        setActiveIndex(prev => {
          const currentPos = enabled.indexOf(prev);
          return currentPos > 0 ? enabled[currentPos - 1]! : enabled[enabled.length - 1]!;
        });
        break;
      }
      case 'Home': {
        e.preventDefault();
        setActiveIndex(enabled[0]!);
        break;
      }
      case 'End': {
        e.preventDefault();
        setActiveIndex(enabled[enabled.length - 1]!);
        break;
      }
      case 'Enter':
      case ' ': {
        e.preventDefault();
        // Find the active item element and click it
        const popover = popoverRef.current;
        if (popover) {
          const activeEl = popover.querySelector('[data-active="true"]') as HTMLElement | null;
          activeEl?.click();
        }
        break;
      }
      case 'Tab': {
        close();
        break;
      }
    }
  }, [open, close, getEnabledIndices]);

  useEffect(() => {
    if (!open) return;
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, handleKeyDown]);

  // Scroll active item into view
  useEffect(() => {
    if (!open) return;
    const popover = popoverRef.current;
    if (!popover) return;
    const active = popover.querySelector('[data-active="true"]') as HTMLElement | null;
    active?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open]);

  // Trigger click & keyboard
  const handleTriggerClick = () => {
    setOpen(!open);
  };

  const handleTriggerKeyDown = (e: KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) {
        setOpen(true);
      }
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        // Focus last enabled item after opening
        setTimeout(() => {
          const enabled = getEnabledIndices();
          if (enabled.length > 0) setActiveIndex(enabled[enabled.length - 1]!);
        }, 0);
      }
    }
  };

  const contextValue: MenuContextValue = {
    activeIndex,
    setActiveIndex,
    registerItem: (index: number, disabled: boolean) => {
      itemMap.current.set(index, { disabled });
    },
    close,
    getItemIndex: () => itemIndexCounter.current++,
    size,
  };

  const menuId = useId();

  return (
    <>
      <span
        ref={containerRef}
        style={{ display: 'inline-flex' }}
      >
        <span
          ref={triggerRef}
          onClick={handleTriggerClick}
          onKeyDown={handleTriggerKeyDown}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={open ? menuId : undefined}
          style={{ display: 'inline-flex', cursor: 'pointer' }}
        >
          {trigger}
        </span>
      </span>
      {visible && createPortal(
        <MenuContext.Provider value={contextValue}>
          <div
            ref={popoverRef}
            id={menuId}
            role="menu"
            style={{
              position: 'fixed',
              top: pos?.top ?? -9999,
              left: pos?.left ?? -9999,
              zIndex: 1000,
              minWidth: 180,
              background: 'var(--lucent-surface-overlay)',
              border: '1px solid var(--lucent-border-default)',
              borderRadius: 'var(--lucent-radius-lg)',
              boxShadow: 'var(--lucent-shadow-md)',
              padding: itemPadding[size],
              maxHeight: 'min(320px, calc(100vh - 32px))',
              overflowY: 'auto',
              animation: animState === 'exiting'
                ? `lucent-menu-out ${ANIM_DURATION}ms var(--lucent-easing-default) forwards`
                : `lucent-menu-in ${ANIM_DURATION}ms var(--lucent-easing-decelerate)`,
              transformOrigin: pos?.transformOrigin ?? 'top left',
              outline: 'none',
              pointerEvents: animState === 'exiting' ? 'none' : 'auto',
              ...style,
            }}
          >
            {children}
          </div>
        </MenuContext.Provider>,
        portalContainer ?? document.body,
      )}
    </>
  );
}

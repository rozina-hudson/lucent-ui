import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  useLayoutEffect,
  type CSSProperties,
  type ReactNode,
  type MouseEventHandler,
  type KeyboardEvent,
} from 'react';
import { sanitizeHref } from '../../../utils/sanitizeHref.js';

/* ─── Constants ─────────────────────────────────────────────────────────────── */

const ANIM_DURATION = 120; // ms — dropdown enter/exit

const KEYFRAMES = `
@keyframes lucent-navmenu-open {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes lucent-navmenu-dropdown-in {
  from { opacity: 0; transform: scale(0.97) translateY(-2px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes lucent-navmenu-dropdown-out {
  from { opacity: 1; transform: scale(1) translateY(0); }
  to   { opacity: 0; transform: scale(0.97) translateY(-2px); }
}
[data-lucent-navitem]:not([data-active]):not([data-active-parent]):not([data-hint]):not([aria-disabled]):hover {
  background: color-mix(in srgb, var(--lucent-text-primary) 5%, transparent) !important;
  color: var(--lucent-text-primary) !important;
}
`;

const SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

/* ─── Size tokens ───────────────────────────────────────────────────────────── */

type NavMenuSize = 'sm' | 'md' | 'lg';

const SIZE_TOKENS: Record<NavMenuSize, {
  fontSize: string;
  paddingY: string;
  paddingX: string;
  gap: string;
  itemGap: string;
  iconWidth: string;
  nestedFontSize: string;
}> = {
  sm: {
    fontSize: 'var(--lucent-font-size-sm)',
    paddingY: '5px',
    paddingX: 'var(--lucent-space-3)',
    gap: 'var(--lucent-space-2)',
    itemGap: '0px',
    iconWidth: 'var(--lucent-space-5)',
    nestedFontSize: 'var(--lucent-font-size-xs)',
  },
  md: {
    fontSize: 'var(--lucent-font-size-md)',
    paddingY: '6px',
    paddingX: 'var(--lucent-space-3)',
    gap: 'var(--lucent-space-2)',
    itemGap: '2px',
    iconWidth: 'var(--lucent-space-5)',
    nestedFontSize: 'var(--lucent-font-size-sm)',
  },
  lg: {
    fontSize: 'var(--lucent-font-size-lg)',
    paddingY: 'var(--lucent-space-2)',
    paddingX: 'var(--lucent-space-4)',
    gap: 'var(--lucent-space-3)',
    itemGap: 'var(--lucent-space-1)',
    iconWidth: 'var(--lucent-space-6)',
    nestedFontSize: 'var(--lucent-font-size-md)',
  },
};

/* ─── Context ───────────────────────────────────────────────────────────────── */

interface NavMenuContextValue {
  orientation: 'vertical' | 'horizontal';
  depth: number;
  inverse: boolean;
  size: NavMenuSize;
  hasIcons: boolean;
  parentHasIcon: boolean;
  requestMeasure: () => void;
}

const NavMenuContext = createContext<NavMenuContextValue>({
  orientation: 'vertical',
  depth: 0,
  inverse: false,
  size: 'md',
  hasIcons: false,
  parentHasIcon: false,
  requestMeasure: () => {},
});

/* ─── NavMenu (root) ────────────────────────────────────────────────────────── */

export interface NavMenuProps {
  children: ReactNode;
  /** Layout direction. Defaults to `"vertical"`. */
  orientation?: 'vertical' | 'horizontal';
  /** Uses surface background instead of accent for the active state. */
  inverse?: boolean;
  /** Size variant. `"sm"` for compact sidebar layouts. Defaults to `"md"`. */
  size?: NavMenuSize;
  /** Whether items use icons. Tightens left padding so group headers align with icons. */
  hasIcons?: boolean;
  style?: CSSProperties;
  /** Accessible label for the `<nav>` element. */
  'aria-label'?: string;
}

export function NavMenu({
  children,
  orientation = 'vertical',
  inverse = false,
  size = 'md',
  hasIcons = false,
  style,
  'aria-label': ariaLabel = 'Navigation',
}: NavMenuProps) {
  const styleInjected = useRef(false);
  if (!styleInjected.current && typeof document !== 'undefined') {
    const el = document.createElement('style');
    el.textContent = KEYFRAMES;
    document.head.appendChild(el);
    styleInjected.current = true;
  }

  const tokens = SIZE_TOKENS[size];
  const navRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);
  const rafId = useRef(0);

  const measure = useCallback(() => {
    const nav = navRef.current;
    const pill = pillRef.current;
    if (!nav || !pill) return;

    // Query for active item (prefer visible child over parent)
    const active = nav.querySelector('[data-active="true"]') as HTMLElement | null;
    const parent = nav.querySelector('[data-active-parent="true"]') as HTMLElement | null;

    // Pick target: visible active child first, then parent
    let target: HTMLElement | null = null;
    let isParentHighlight = false;

    if (active && !active.closest('[aria-hidden="true"]')) {
      target = active;
    } else if (parent && !parent.closest('[aria-hidden="true"]')) {
      target = parent;
      isParentHighlight = true;
    }

    if (!target) {
      pill.style.opacity = '0';
      return;
    }

    const navRect = nav.getBoundingClientRect();
    const tRect = target.getBoundingClientRect();

    // Gate first animation — no transition on initial render
    if (!mounted.current) {
      pill.style.transition = 'none';
      mounted.current = true;
    } else {
      pill.style.transition = [
        `top 150ms ${SPRING}`,
        `left 150ms ${SPRING}`,
        `width 150ms ${SPRING}`,
        `height 150ms ${SPRING}`,
        'opacity 100ms ease',
        'background 150ms ease',
        'box-shadow 150ms ease',
      ].join(', ');
    }

    pill.style.top = `${tRect.top - navRect.top}px`;
    pill.style.left = `${tRect.left - navRect.left}px`;
    pill.style.width = `${tRect.width}px`;
    pill.style.height = `${tRect.height}px`;
    pill.style.opacity = '1';

    // Parent highlight: lighter surface style; child highlight: full accent
    if (isParentHighlight) {
      pill.style.background = inverse
        ? 'var(--lucent-surface-secondary)'
        : 'color-mix(in srgb, var(--lucent-accent-default) 12%, transparent)';
      pill.style.boxShadow = 'none';
    } else {
      pill.style.background = inverse
        ? 'var(--lucent-surface)'
        : 'var(--lucent-accent-default)';
      pill.style.boxShadow = inverse
        ? 'inset -3px 0 0 var(--lucent-accent-default), var(--lucent-shadow-sm)'
        : 'none';
    }
  }, [inverse]);

  const requestMeasure = useCallback(() => {
    cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(measure);
  }, [measure]);

  // MutationObserver — watches data-active, data-active-parent, aria-hidden changes
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const mo = new MutationObserver(requestMeasure);
    mo.observe(nav, {
      attributes: true,
      attributeFilter: ['data-active', 'data-active-parent', 'aria-hidden'],
      subtree: true,
    });
    return () => mo.disconnect();
  }, [requestMeasure]);

  // ResizeObserver — handles density/window resize
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const ro = new ResizeObserver(requestMeasure);
    ro.observe(nav);
    return () => ro.disconnect();
  }, [requestMeasure]);

  // Fonts
  useEffect(() => {
    document.fonts.ready.then(requestMeasure);
  }, [requestMeasure]);

  // Re-measure when children, inverse, or size change
  useEffect(() => {
    requestMeasure();
  }, [children, inverse, size, requestMeasure]);

  return (
    <NavMenuContext.Provider value={{ orientation, depth: 0, inverse, size, hasIcons, parentHasIcon: false, requestMeasure }}>
      <nav
        ref={navRef as React.RefObject<HTMLElement>}
        aria-label={ariaLabel}
        style={{
          display: 'flex',
          flexDirection: orientation === 'vertical' ? 'column' : 'row',
          gap: tokens.itemGap,
          fontFamily: 'var(--lucent-font-family-base)',
          fontSize: tokens.fontSize,
          position: 'relative',
          ...style,
        }}
      >
        {/* Sliding highlight pill — always in DOM */}
        <div
          ref={pillRef}
          aria-hidden
          style={{
            position: 'absolute',
            borderRadius: 'var(--lucent-radius-md)',
            pointerEvents: 'none',
            zIndex: 0,
            opacity: 0,
            top: 0,
            left: 0,
            width: 0,
            height: 0,
          }}
        />
        {children}
      </nav>
    </NavMenuContext.Provider>
  );
}

/* ─── NavMenu.Item ──────────────────────────────────────────────────────────── */

export interface NavMenuItemProps {
  children: ReactNode;
  href?: string;
  isActive?: boolean;
  icon?: ReactNode;
  badge?: ReactNode;
  disabled?: boolean;
  onClick?: MouseEventHandler;
  /** Polymorphic root element. Defaults to `<a>`. Use e.g. `Link` from react-router. */
  as?: React.ElementType;
  style?: CSSProperties;
}

export function NavMenuItem({
  children,
  href,
  isActive = false,
  icon,
  badge,
  disabled = false,
  onClick,
  as,
  style,
}: NavMenuItemProps) {
  const { orientation, depth, inverse, size, parentHasIcon, requestMeasure } = useContext(NavMenuContext);
  const tokens = SIZE_TOKENS[size];

  // Trigger measurement when active state changes
  useEffect(() => {
    requestMeasure();
  }, [isActive, requestMeasure]);

  // Detect if this item has a NavMenuSub child
  let subMenu: ReactNode = null;
  const labelChildren: ReactNode[] = [];

  const childArray = Array.isArray(children) ? children : [children];
  for (const child of childArray) {
    if (
      child != null &&
      typeof child === 'object' &&
      'type' in child &&
      (child as React.ReactElement).type === NavMenuSub
    ) {
      subMenu = child;
    } else {
      labelChildren.push(child);
    }
  }

  if (subMenu) {
    return (
      <NavMenuParentItem
        subMenu={subMenu}
        orientation={orientation}
        depth={depth}
        inverse={inverse}
        size={size}
        isActive={isActive}
        disabled={disabled}
        {...(icon !== undefined && { icon })}
        {...(badge !== undefined && { badge })}
        {...(onClick !== undefined && { onClick })}
        {...(style !== undefined && { style })}
      >
        {labelChildren}
      </NavMenuParentItem>
    );
  }

  const Tag = (as ?? 'a') as React.ElementType;

  return (
    <Tag
      data-lucent-navitem=""
      data-active={isActive || undefined}
      href={disabled ? undefined : sanitizeHref(href)}
      onClick={disabled ? undefined : onClick}
      aria-current={isActive ? 'page' : undefined}
      aria-disabled={disabled || undefined}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: tokens.gap,
        padding: orientation === 'vertical'
          ? `${tokens.paddingY} ${tokens.paddingX} ${tokens.paddingY} ${(icon != null || parentHasIcon) ? 'var(--lucent-space-2)' : 'var(--lucent-space-4)'}`
          : `${tokens.paddingY} ${tokens.paddingX}`,
        borderRadius: 'var(--lucent-radius-md)',
        background: 'transparent',
        color: disabled
          ? 'var(--lucent-text-disabled)'
          : isActive
          ? (inverse ? 'var(--lucent-text-primary)' : 'var(--lucent-accent-fg)')
          : 'var(--lucent-text-secondary)',
        border: 0,
        borderBottom: isActive && orientation === 'horizontal'
          ? '2px solid var(--lucent-accent-default)'
          : orientation === 'horizontal'
          ? '2px solid transparent'
          : 0,
        boxShadow: 'none',
        fontFamily: 'var(--lucent-font-family-base)',
        fontSize: tokens.fontSize,
        fontWeight: isActive ? 'var(--lucent-font-weight-medium)' : 'var(--lucent-font-weight-regular)',
        textDecoration: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background var(--lucent-duration-fast) var(--lucent-easing-default), color var(--lucent-duration-fast) var(--lucent-easing-default)',
        userSelect: 'none',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 1,
        whiteSpace: orientation === 'horizontal' ? 'nowrap' : undefined,
        width: orientation === 'vertical' ? '100%' : undefined,
        textAlign: 'left',
        outline: 'none',
        ...style,
      }}
    >
      {icon != null && (
        <span style={{ display: 'flex', flexShrink: 0, width: tokens.iconWidth, minWidth: 14, minHeight: 14, alignItems: 'center', justifyContent: 'center', color: 'inherit' }}>{icon}</span>
      )}
      <span style={{ flex: 1 }}>{labelChildren}</span>
      {badge != null && (
        <span style={{ display: 'flex', flexShrink: 0, marginLeft: 'auto' }}>{badge}</span>
      )}
    </Tag>
  );
}

/* ─── Parent item (has sub-menu) ────────────────────────────────────────────── */

interface NavMenuParentItemProps {
  children: ReactNode;
  subMenu: ReactNode;
  orientation: 'vertical' | 'horizontal';
  depth: number;
  inverse: boolean;
  size: NavMenuSize;
  icon?: ReactNode;
  badge?: ReactNode;
  isActive?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler;
  style?: CSSProperties;
}

function NavMenuParentItem({
  children,
  icon,
  badge,
  isActive = false,
  disabled = false,
  onClick,
  style,
  subMenu,
  orientation,
  depth,
  inverse,
  size,
}: NavMenuParentItemProps) {
  const { hasIcons, requestMeasure } = useContext(NavMenuContext);
  const tokens = SIZE_TOKENS[size];
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();

  // Track whether any child is active to highlight this parent
  const hasActiveChild = useHasActiveChild(subMenu);

  // Parent is the active destination (no child selected)
  const selfActive = isActive && !hasActiveChild;
  // When collapsed with active child, highlight sits on the parent with lighter style
  const collapsedWithActiveChild = !selfActive && !isOpen && hasActiveChild;
  const showHint = isActive || hasActiveChild;

  // Trigger measurement when open/active state changes
  useEffect(() => {
    requestMeasure();
  }, [isOpen, isActive, hasActiveChild, requestMeasure]);

  // Vertical: inline expand/collapse with height animation
  useEffect(() => {
    if (orientation !== 'vertical') return;
    const el = contentRef.current;
    if (!el) return;

    if (isOpen) {
      const scrollH = el.scrollHeight;
      setHeight(scrollH);
      const timer = setTimeout(() => {
        setHeight(undefined);
      }, 130);
      return () => clearTimeout(timer);
    } else {
      setHeight(el.scrollHeight);
      el.getBoundingClientRect();
      setHeight(0);
    }
  }, [isOpen, orientation]);

  // Horizontal dropdown: close on click outside
  useEffect(() => {
    if (orientation !== 'horizontal' || !isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        startClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [orientation, isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Horizontal dropdown: viewport collision detection
  useLayoutEffect(() => {
    if (orientation !== 'horizontal' || !isOpen) return;
    const dropdown = dropdownRef.current;
    if (!dropdown) return;
    const rect = dropdown.getBoundingClientRect();
    // Flip to right-aligned if overflowing right edge
    if (rect.right > window.innerWidth) {
      dropdown.style.left = 'auto';
      dropdown.style.right = '0';
    }
    // Push up if overflowing bottom edge
    if (rect.bottom > window.innerHeight) {
      dropdown.style.top = 'auto';
      dropdown.style.bottom = '100%';
      dropdown.style.marginTop = '0';
      dropdown.style.marginBottom = 'var(--lucent-space-1)';
    }
  }, [orientation, isOpen]);

  // Dropdown exit animation state
  const [animState, setAnimState] = useState<'idle' | 'entering' | 'exiting'>('idle');
  const [visible, setVisible] = useState(false);

  const startOpen = () => {
    if (disabled) return;
    setVisible(true);
    setAnimState('entering');
    setIsOpen(true);
  };

  const startClose = () => {
    setAnimState('exiting');
    setTimeout(() => {
      setIsOpen(false);
      setVisible(false);
      setAnimState('idle');
    }, ANIM_DURATION);
  };

  const toggle = () => {
    if (disabled) return;
    if (orientation === 'horizontal') {
      if (isOpen) startClose();
      else startOpen();
    } else {
      setIsOpen(!isOpen);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (disabled) return;
    if (orientation === 'vertical') {
      if (e.key === 'ArrowRight' && !isOpen) { e.preventDefault(); setIsOpen(true); }
      if (e.key === 'ArrowLeft' && isOpen) { e.preventDefault(); setIsOpen(false); }
    } else {
      if (e.key === 'ArrowDown' && !isOpen) { e.preventDefault(); startOpen(); }
      if (e.key === 'ArrowUp' && isOpen) { e.preventDefault(); startClose(); }
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
    if (e.key === 'Escape' && isOpen) {
      e.preventDefault();
      if (orientation === 'horizontal') startClose();
      else setIsOpen(false);
    }
  };

  // Horizontal hover open/close
  const handleMouseEnter = () => {
    if (orientation === 'horizontal' && !disabled) {
      clearTimeout(closeTimer.current);
      startOpen();
    }
  };
  const handleMouseLeave = () => {
    if (orientation === 'horizontal') {
      closeTimer.current = setTimeout(() => startClose(), 150);
    }
  };

  if (orientation === 'horizontal') {
    return (
      <div
        ref={wrapperRef}
        style={{ position: 'relative' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button
          data-lucent-navitem=""
          data-hint={showHint || undefined}
          onClick={(e) => {
            toggle();
            onClick?.(e);
          }}
          onKeyDown={handleKeyDown}
          aria-expanded={isOpen}
          aria-disabled={disabled || undefined}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: tokens.gap,
            padding: `${tokens.paddingY} ${tokens.paddingX}`,
            borderRadius: 'var(--lucent-radius-md)',
            background: 'transparent',
            color: disabled
              ? 'var(--lucent-text-disabled)'
              : showHint
              ? 'var(--lucent-text-primary)'
              : 'var(--lucent-text-secondary)',
            border: 0,
            borderBottom: showHint
              ? '2px solid var(--lucent-accent-default)'
              : '2px solid transparent',
            fontFamily: 'var(--lucent-font-family-base)',
            fontSize: tokens.fontSize,
            fontWeight: showHint ? 'var(--lucent-font-weight-medium)' : 'var(--lucent-font-weight-regular)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'background var(--lucent-duration-fast) var(--lucent-easing-default), color var(--lucent-duration-fast) var(--lucent-easing-default)',
            userSelect: 'none',
            whiteSpace: 'nowrap',
            outline: 'none',
            boxSizing: 'border-box',
            ...style,
          }}
        >
          {icon != null && (
            <span style={{ display: 'flex', flexShrink: 0, width: tokens.iconWidth, minWidth: 14, minHeight: 14, alignItems: 'center', justifyContent: 'center', color: 'inherit' }}>{icon}</span>
          )}
          <span>{children}</span>
          {badge != null && (
            <span style={{ display: 'flex', flexShrink: 0 }}>{badge}</span>
          )}
        </button>

        {/* Horizontal dropdown */}
        {visible && (
          <NavMenuContext.Provider value={{ orientation: 'vertical', depth: 0, inverse, size, hasIcons, parentHasIcon: false, requestMeasure }}>
            <div
              ref={dropdownRef}
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: 'var(--lucent-space-1)',
                minWidth: 180,
                background: 'var(--lucent-surface)',
                border: '1px solid var(--lucent-border-default)',
                borderRadius: 'var(--lucent-radius-lg)',
                boxShadow: 'var(--lucent-shadow-lg)',
                padding: 'var(--lucent-space-1)',
                zIndex: 100,
                animation: animState === 'exiting'
                  ? `lucent-navmenu-dropdown-out ${ANIM_DURATION}ms var(--lucent-easing-default) forwards`
                  : `lucent-navmenu-dropdown-in ${ANIM_DURATION}ms var(--lucent-easing-default) forwards`,
              }}
            >
              {subMenu}
            </div>
          </NavMenuContext.Provider>
        )}
      </div>
    );
  }

  // Vertical orientation: inline expand/collapse
  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <button
        data-lucent-navitem=""
        data-active={selfActive || undefined}
        data-active-parent={collapsedWithActiveChild || undefined}
        data-hint={(!selfActive && !collapsedWithActiveChild && showHint) || undefined}
        onClick={(e) => {
          toggle();
          onClick?.(e);
        }}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-disabled={disabled || undefined}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: tokens.gap,
          width: '100%',
          padding: `${tokens.paddingY} ${tokens.paddingX} ${tokens.paddingY} ${icon != null ? 'var(--lucent-space-2)' : 'var(--lucent-space-4)'}`,
          borderRadius: 'var(--lucent-radius-md)',
          background: 'transparent',
          color: disabled
            ? 'var(--lucent-text-disabled)'
            : selfActive
            ? (inverse ? 'var(--lucent-text-primary)' : 'var(--lucent-accent-fg)')
            : collapsedWithActiveChild
            ? 'var(--lucent-text-primary)'
            : showHint
            ? 'var(--lucent-text-primary)'
            : 'var(--lucent-text-secondary)',
          border: 0,
          boxShadow: 'none',
          fontFamily: 'var(--lucent-font-family-base)',
          fontSize: tokens.fontSize,
          fontWeight: showHint ? 'var(--lucent-font-weight-medium)' : 'var(--lucent-font-weight-regular)',
          textAlign: 'left',
          textDecoration: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'background var(--lucent-duration-fast) var(--lucent-easing-default), color var(--lucent-duration-fast) var(--lucent-easing-default)',
          userSelect: 'none',
          boxSizing: 'border-box',
          outline: 'none',
          ...style,
        }}
      >
        {icon != null && (
          <span style={{ display: 'flex', flexShrink: 0, width: tokens.iconWidth, minWidth: 14, minHeight: 14, alignItems: 'center', justifyContent: 'center', color: 'inherit' }}>{icon}</span>
        )}
        <span style={{ flex: 1 }}>{children}</span>
        {badge != null && (
          <span style={{ display: 'flex', flexShrink: 0 }}>{badge}</span>
        )}
      </button>

      {/* Collapsible children */}
      <div
        ref={contentRef}
        aria-hidden={!isOpen}
        style={{
          overflow: 'hidden',
          height: height !== undefined ? height : 'auto',
          transition: 'height 120ms var(--lucent-easing-default)',
        }}
      >
        <NavMenuContext.Provider value={{ orientation, depth: depth + 1, inverse, size, hasIcons, parentHasIcon: icon != null, requestMeasure }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: tokens.itemGap,
              padding: `var(--lucent-space-1) 0`,
              marginLeft: icon != null
                ? `calc(${tokens.iconWidth} + ${tokens.gap})`
                : 'var(--lucent-space-3)',
              animation: isOpen ? 'lucent-navmenu-open 200ms var(--lucent-easing-default) forwards' : undefined,
            }}
          >
            {subMenu}
          </div>
        </NavMenuContext.Provider>
      </div>
    </div>
  );
}

/* ─── useHasActiveChild ─────────────────────────────────────────────────────── */

/** Walks the ReactNode tree to detect if any NavMenuItem has isActive=true. */
function useHasActiveChild(subMenu: ReactNode): boolean {
  return checkActiveChild(subMenu);
}

function checkActiveChild(node: ReactNode): boolean {
  if (node == null) return false;
  if (Array.isArray(node)) return node.some(checkActiveChild);
  if (typeof node === 'object' && 'props' in node) {
    const el = node as React.ReactElement<NavMenuItemProps & { children?: ReactNode }>;
    if (el.props.isActive) return true;
    if (el.props.children) return checkActiveChild(el.props.children);
  }
  return false;
}

/* ─── NavMenu.Sub ───────────────────────────────────────────────────────────── */

export interface NavMenuSubProps {
  children: ReactNode;
}

export function NavMenuSub({ children }: NavMenuSubProps) {
  // Marker component — children rendered by NavMenuParentItem.
  return <>{children}</>;
}

/* ─── NavMenu.Group ─────────────────────────────────────────────────────────── */

export interface NavMenuGroupProps {
  children: ReactNode;
  /** Section header label. */
  label?: ReactNode;
  /** Whether this group starts open. Only applies to vertical orientation. */
  defaultOpen?: boolean;
  /** Controlled open state. */
  open?: boolean;
  /** Callback when the group open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Whether the group is collapsible. Defaults to `true` when a label is provided. */
  collapsible?: boolean;
  style?: CSSProperties;
}

export function NavMenuGroup({
  children,
  label,
  defaultOpen = true,
  open,
  onOpenChange,
  collapsible: collapsibleProp,
  style,
}: NavMenuGroupProps) {
  const { orientation, inverse, size, hasIcons } = useContext(NavMenuContext);
  const tokens = SIZE_TOKENS[size];
  const isCollapsible = collapsibleProp ?? (label != null);
  const headerInset = hasIcons ? 'var(--lucent-space-2)' : 'var(--lucent-space-4)';

  // In horizontal mode, groups just render children inline
  if (orientation === 'horizontal') {
    return <>{children}</>;
  }

  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = isControlled ? open! : internalOpen;

  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(isOpen ? undefined : 0);

  useEffect(() => {
    if (!isCollapsible) return;
    const el = contentRef.current;
    if (!el) return;

    if (isOpen) {
      const scrollH = el.scrollHeight;
      setHeight(scrollH);
      const timer = setTimeout(() => {
        setHeight(undefined);
      }, 130);
      return () => clearTimeout(timer);
    } else {
      setHeight(el.scrollHeight);
      el.getBoundingClientRect();
      setHeight(0);
    }
  }, [isOpen, isCollapsible]);

  const toggle = useCallback(() => {
    const next = !isOpen;
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  }, [isOpen, isControlled, onOpenChange]);

  if (!label) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.itemGap, ...style }}>
        {children}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginTop: 'var(--lucent-space-3)', ...style }}>
      {/* Group header */}
      {isCollapsible ? (
        <button
          onClick={toggle}
          aria-expanded={isOpen}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            padding: `var(--lucent-space-1) var(--lucent-space-3) var(--lucent-space-1) ${headerInset}`,
            background: 'none',
            border: 0,
            cursor: 'pointer',
            outline: 'none',
            fontFamily: 'var(--lucent-font-family-base)',
            fontSize: 'var(--lucent-font-size-xs)',
            fontWeight: 'var(--lucent-font-weight-semibold)',
            color: 'var(--lucent-text-secondary)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            textAlign: 'left',
            userSelect: 'none',
            marginBottom: isOpen ? 'var(--lucent-space-1)' : '0',
            transition: 'margin-bottom 200ms var(--lucent-easing-default)',
          }}
        >
          <span>{label}</span>
          <NavMenuChevron open={isOpen} size={12} />
        </button>
      ) : (
        <div
          style={{
            padding: `var(--lucent-space-1) var(--lucent-space-3) var(--lucent-space-1) ${headerInset}`,
            fontFamily: 'var(--lucent-font-family-base)',
            fontSize: 'var(--lucent-font-size-xs)',
            fontWeight: 'var(--lucent-font-weight-semibold)',
            color: 'var(--lucent-text-secondary)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            userSelect: 'none',
            marginBottom: 'var(--lucent-space-1)',
          }}
        >
          {label}
        </div>
      )}

      {/* Group children */}
      {isCollapsible ? (
        <div
          ref={contentRef}
          aria-hidden={!isOpen}
          style={{
            overflow: 'hidden',
            height: height !== undefined ? height : 'auto',
            transition: 'height 120ms var(--lucent-easing-default)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: tokens.itemGap,
            }}
          >
            {children}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.itemGap }}>
          {children}
        </div>
      )}
    </div>
  );
}

/* ─── NavMenu.Separator ─────────────────────────────────────────────────────── */

export interface NavMenuSeparatorProps {
  style?: CSSProperties;
}

export function NavMenuSeparator({ style }: NavMenuSeparatorProps) {
  const { orientation } = useContext(NavMenuContext);

  return (
    <div
      role="separator"
      style={{
        ...(orientation === 'vertical'
          ? {
              height: 1,
              margin: 'var(--lucent-space-2) var(--lucent-space-4)',
            }
          : {
              width: 1,
              alignSelf: 'stretch',
              margin: 'var(--lucent-space-1) var(--lucent-space-1)',
            }),
        background: 'var(--lucent-border-default)',
        flexShrink: 0,
        ...style,
      }}
    />
  );
}

/* ─── Chevron helper ────────────────────────────────────────────────────────── */

function NavMenuChevron({ open, size = 14 }: { open: boolean; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={{
        flexShrink: 0,
        color: 'var(--lucent-text-secondary)',
        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 200ms var(--lucent-easing-default)',
      }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/* ─── Compound export ───────────────────────────────────────────────────────── */

NavMenu.Item = NavMenuItem;
NavMenu.Group = NavMenuGroup;
NavMenu.Sub = NavMenuSub;
NavMenu.Separator = NavMenuSeparator;

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { Text } from '../../atoms/Text/Text.js';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type ToastVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

export type ToastPosition =
  | 'top-left' | 'top-center' | 'top-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right';

export type ToastActionStyle = 'link' | 'button';

export interface ToastAction {
  label: string;
  onClick: () => void;
  /** Render as an underlined link or a bordered button. Default `'button'`. */
  style?: ToastActionStyle;
}

export interface ToastOptions {
  /** Primary message line. */
  title: string;
  /** Optional secondary description (supports multi-line). */
  description?: string;
  /** Visual variant — drives icon, border color, and tint. */
  variant?: ToastVariant;
  /** Auto-dismiss duration in ms. Pass `Infinity` to disable. Default 5000. */
  duration?: number;
  /** Action button or link rendered inline. */
  action?: ToastAction;
  /** Optional custom icon. */
  icon?: ReactNode;
}

interface ToastEntry extends Required<Pick<ToastOptions, 'title' | 'variant'>> {
  id: string;
  description?: string;
  duration: number;
  action?: ToastAction;
  icon?: ReactNode;
  /** Phase drives enter/exit animation. */
  phase: 'entering' | 'visible' | 'exiting';
}

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

type ToastFn = (options: ToastOptions) => string;
type DismissFn = (id: string) => void;

interface ToastContextValue {
  toast: ToastFn;
  dismiss: DismissFn;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

/* ------------------------------------------------------------------ */
/*  Icons (reuse Alert patterns)                                       */
/* ------------------------------------------------------------------ */

const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 5.5V8.5M8 10.5V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const SuccessIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M5 8L7 10L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const WarningIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 2L14.5 13H1.5L8 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M8 6V9M8 11V11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const DangerIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M5.5 5.5L10.5 10.5M10.5 5.5L5.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const DismissIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const defaultIcons: Record<Exclude<ToastVariant, 'default'>, ReactNode> = {
  info:    <InfoIcon />,
  success: <SuccessIcon />,
  warning: <WarningIcon />,
  danger:  <DangerIcon />,
};

/* ------------------------------------------------------------------ */
/*  Variant styles                                                     */
/* ------------------------------------------------------------------ */

interface VariantStyle {
  border: string;
  iconColor: string;
}

const variantStyles: Record<ToastVariant, VariantStyle> = {
  default: { border: 'var(--lucent-border-default)', iconColor: 'var(--lucent-text-secondary)' },
  info:    { border: 'var(--lucent-info-default)',    iconColor: 'var(--lucent-info-text)' },
  success: { border: 'var(--lucent-success-default)', iconColor: 'var(--lucent-success-text)' },
  warning: { border: 'var(--lucent-warning-default)', iconColor: 'var(--lucent-warning-text)' },
  danger:  { border: 'var(--lucent-danger-default)',  iconColor: 'var(--lucent-danger-text)' },
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

let counter = 0;
function nextId(): string {
  return `lucent-toast-${++counter}`;
}

function isTop(pos: ToastPosition): boolean {
  return pos.startsWith('top');
}

/** Matches var(--lucent-duration-base) = 200ms */
const ENTER_MS = 200;
/** Matches var(--lucent-duration-base) = 200ms */
const EXIT_MS = 200;

/** How many px each stacked card peeks beyond the front toast. */
const STACK_GAP = 8;
/** Width shrink per stack level (applied via scaleX). */
const STACK_SCALE_STEP = 0.04;
/** Opacity reduction per stack level. */
const STACK_OPACITY_STEP = 0.2;
/** Max visible stacked cards behind the front toast. */
const STACK_MAX_VISIBLE = 3;

const TOAST_WIDTH = 356;

/* ------------------------------------------------------------------ */
/*  Toast card (inner content — no positioning)                        */
/* ------------------------------------------------------------------ */

interface ToastCardProps {
  entry: ToastEntry;
  onDismiss: (id: string) => void;
  /** When true, renders only the empty card shell (bg + border + shadow). */
  hideContent?: boolean;
  /** Fixed height to force on the card (used for stacked shells). */
  fixedHeight?: number;
}

function ToastCard({ entry, onDismiss, hideContent, fixedHeight }: ToastCardProps) {
  const { id, title, description, variant, action, icon } = entry;
  const v = variantStyles[variant];
  const resolvedIcon = icon ?? (variant !== 'default' ? defaultIcons[variant] : null);
  const actionStyle = action?.style ?? 'button';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--lucent-space-3)',
        padding: 'var(--lucent-space-3) var(--lucent-space-4)',
        background: 'var(--lucent-surface-raised)',
        border: `1px solid ${v.border}`,
        borderRadius: 'var(--lucent-radius-lg)',
        boxShadow: hideContent ? 'none' : 'var(--lucent-shadow-lg)',
        boxSizing: 'border-box',
        width: TOAST_WIDTH,
        maxWidth: 'calc(100vw - var(--lucent-space-8))',
        fontFamily: 'var(--lucent-font-family-base)',
        transition: 'height var(--lucent-duration-base) var(--lucent-easing-emphasized), box-shadow var(--lucent-duration-base) var(--lucent-easing-default)',
        ...(fixedHeight !== undefined && { height: fixedHeight, overflow: 'hidden' }),
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--lucent-space-3)',
          width: '100%',
          opacity: hideContent ? 0 : 1,
          transition: 'opacity var(--lucent-duration-base) var(--lucent-easing-default)',
        }}
      >
        {resolvedIcon && (
          <span style={{ flexShrink: 0, color: v.iconColor, display: 'flex', alignItems: 'center' }}>
            {resolvedIcon}
          </span>
        )}

        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 'var(--lucent-space-1)' }}>
          <Text as="span" size="sm" weight="semibold" color="primary" lineHeight="tight">
            {title}
          </Text>
          {description && (
            <Text as="span" size="sm" color="secondary" lineHeight="base" style={{ whiteSpace: 'pre-line' }}>
              {description}
            </Text>
          )}
        </div>

        {action && actionStyle === 'button' && (
          <ActionButton label={action.label} onClick={() => { action.onClick(); onDismiss(id); }} />
        )}
        {action && actionStyle === 'link' && (
          <ActionLink label={action.label} iconColor={v.iconColor} onClick={() => { action.onClick(); onDismiss(id); }} />
        )}

        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => onDismiss(id)}
          style={{
            flexShrink: 0, display: 'flex', alignItems: 'center',
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 2, borderRadius: 'var(--lucent-radius-sm)',
            color: 'var(--lucent-text-secondary)', opacity: hideContent ? 0 : 0.6,
          }}
          onMouseEnter={(e) => { if (!hideContent) e.currentTarget.style.opacity = '1'; }}
          onMouseLeave={(e) => { if (!hideContent) e.currentTarget.style.opacity = '0.6'; }}
        >
          <DismissIcon />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Action renderers                                                   */
/* ------------------------------------------------------------------ */

function ActionButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flexShrink: 0, padding: 'var(--lucent-space-1) var(--lucent-space-3)',
        background: 'var(--lucent-surface)',
        border: '1px solid var(--lucent-border-strong)',
        borderRadius: 'var(--lucent-radius-md)',
        cursor: 'pointer',
        fontFamily: 'var(--lucent-font-family-base)',
        fontSize: 'var(--lucent-font-size-xs)',
        fontWeight: 'var(--lucent-font-weight-medium)',
        color: 'var(--lucent-text-primary)',
        lineHeight: 'var(--lucent-line-height-tight)',
        whiteSpace: 'nowrap',
        transition: 'background var(--lucent-duration-fast) var(--lucent-easing-default)',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--lucent-surface-secondary)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--lucent-surface)'; }}
    >
      {label}
    </button>
  );
}

function ActionLink({ label, iconColor, onClick }: { label: string; iconColor: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flexShrink: 0, padding: 0, background: 'none', border: 'none',
        cursor: 'pointer',
        fontFamily: 'var(--lucent-font-family-base)',
        fontSize: 'var(--lucent-font-size-sm)',
        fontWeight: 'var(--lucent-font-weight-semibold)',
        color: iconColor === 'var(--lucent-text-secondary)' ? 'var(--lucent-accent-default)' : iconColor,
        textDecoration: 'underline', textUnderlineOffset: 2, whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Viewport                                                           */
/* ------------------------------------------------------------------ */

interface ToastViewportProps {
  toasts: ToastEntry[];
  position: ToastPosition;
  onDismiss: (id: string) => void;
  portalContainer?: HTMLElement;
}

/** Fixed distance from the screen edge to the toast's side (matches space-6 = 1.5rem). */
const EDGE_OFFSET = 'var(--lucent-space-6)';
/** Fixed distance from the screen edge to the toast's anchored edge.
 *  Bottom positions: top edge is at `calc(100vh - ANCHOR_INSET)`.
 *  Top positions: top edge is at `ANCHOR_INSET`. */
const ANCHOR_INSET = 40;
/**  Bottom positions: top edge is at `ANCHOR_INSET_BOTTOM`. */
const ANCHOR_INSET_BOTTOM = 120;

function viewportStyles(position: ToastPosition): CSSProperties {
  const base: CSSProperties = {
    position: 'fixed',
    zIndex: 9999,
    pointerEvents: 'none',
    boxSizing: 'border-box',
  };

  if (isTop(position)) {
    base.top = ANCHOR_INSET;
  } else {
    base.top = `calc(100vh - ${ANCHOR_INSET_BOTTOM}px)`;
  }

  if (position.endsWith('left')) {
    base.left = EDGE_OFFSET;
  } else if (position.endsWith('right')) {
    base.right = EDGE_OFFSET;
  } else {
    base.left = '50%';
    base.transform = 'translateX(-50%)';
  }

  return base;
}

function ToastViewport({ toasts, position, onDismiss, portalContainer }: ToastViewportProps) {
  const [expanded, setExpanded] = useState(false);
  const [frontHeight, setFrontHeight] = useState<number | undefined>(undefined);
  const frontRef = useCallback((el: HTMLDivElement | null) => {
    if (el) setFrontHeight(el.offsetHeight);
  }, []);
  const top = isTop(position);

  const activeToasts = toasts.filter((t) => t.phase !== 'exiting');
  const exitingToasts = toasts.filter((t) => t.phase === 'exiting');

  // Collapse when ≤ 1 toast
  useEffect(() => {
    if (activeToasts.length <= 1) setExpanded(false);
  }, [activeToasts.length]);

  // Debounced expand/collapse
  const collapseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (collapseTimer.current) {
      clearTimeout(collapseTimer.current);
      collapseTimer.current = null;
    }
    if (activeToasts.length > 1) setExpanded(true);
  }, [activeToasts.length]);

  const handleMouseLeave = useCallback(() => {
    collapseTimer.current = setTimeout(() => {
      setExpanded(false);
      collapseTimer.current = null;
    }, 150);
  }, []);

  const content = (
    <div style={viewportStyles(position)}>
      {/* Outer hover zone — padding extends the hover target without
          affecting absolute positioning inside the inner wrapper. */}
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ margin: 'calc(-1 * var(--lucent-space-2))', padding: 'var(--lucent-space-2)' }}
      >
      <div style={{
        position: 'relative',
        display: 'flex',
        flexDirection: top ? 'column-reverse' : 'column',
        gap: expanded ? 'var(--lucent-space-2)' : 0,
        transform: expanded && !top ? 'translateY(-100%)' : undefined,
        marginTop: expanded && !top ? (frontHeight ?? 0) : 0,
        transition: 'transform var(--lucent-duration-base) var(--lucent-easing-emphasized), margin var(--lucent-duration-base) var(--lucent-easing-emphasized), gap var(--lucent-duration-base) var(--lucent-easing-emphasized)',
      }}>
        {activeToasts.map((entry, i) => {
          const stackIndex = activeToasts.length - 1 - i;
          const hidden = !expanded && stackIndex > STACK_MAX_VISIBLE;

          const offset = stackIndex * STACK_GAP;
          // Bottom: stacked cards peek above (negative Y from top: 0)
          // Top: stacked cards peek below (positive Y from bottom: 0)
          const translateY = top ? offset : -offset;

          const scale = expanded ? 1 : 1 - stackIndex * STACK_SCALE_STEP;
          const opacity = expanded ? 1 : Math.max(0, 1 - stackIndex * STACK_OPACITY_STEP);

          const isEntering = entry.phase === 'entering';

          const isFront = stackIndex === 0;
          const isStacked = !expanded && !isFront;

          return (
            <div
              key={entry.id}
              ref={isFront ? frontRef : undefined}
              role="status"
              aria-live="polite"
              aria-hidden={hidden}
              style={{
                // Front toast is relative (sets container height).
                // Stacked toasts overlap via absolute + top: 0.
                position: isFront || expanded ? 'relative' : 'absolute',
                // Bottom positions: anchor at top:0 (peek above front toast)
                // Top positions: anchor at bottom:0 (peek below front toast)
                ...(!expanded && !isFront && (top ? { bottom: 0 } : { top: 0 })),
                zIndex: 100 - stackIndex,
                transform: isEntering
                  ? `translateY(${top ? '-20px' : '20px'}) scale(0.96)`
                  : expanded
                  ? undefined
                  : `translateY(${translateY}px) scaleX(${scale})`,
                opacity: isEntering ? 0 : (entry.phase === 'exiting' ? 0 : opacity),
                transformOrigin: top ? 'bottom center' : 'top center',
                transition: isEntering ? 'none'
                  : 'transform var(--lucent-duration-base) var(--lucent-easing-emphasized), opacity var(--lucent-duration-base) var(--lucent-easing-default)',
                pointerEvents: hidden ? 'none' : 'auto',
                visibility: hidden ? 'hidden' : 'visible',
              }}
            >
              <ToastCard
                entry={entry}
                onDismiss={onDismiss}
                hideContent={isStacked}
                {...(isStacked && frontHeight !== undefined && { fixedHeight: frontHeight })}
              />
            </div>
          );
        })}

        {/* Exiting toasts */}
        {exitingToasts.map((entry) => (
          <div
            key={entry.id}
            role="status"
            aria-live="polite"
            style={{
              position: 'absolute',
              ...(top ? { bottom: 0 } : { top: 0 }),
              zIndex: 200,
              transform: `translateY(${top ? '20px' : '-20px'}) scale(0.96)`,
              opacity: 0,
              transformOrigin: top ? 'bottom center' : 'top center',
              transition: 'transform var(--lucent-duration-base) var(--lucent-easing-default), opacity var(--lucent-duration-base) var(--lucent-easing-default)',
              pointerEvents: 'none',
            }}
          >
            <ToastCard entry={entry} onDismiss={onDismiss} />
          </div>
        ))}
      </div>
      </div>
    </div>
  );

  return createPortal(content, portalContainer ?? document.body);
}

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

export interface ToastProviderProps {
  children: ReactNode;
  /** Default position for all toasts. Default `'bottom-right'`. */
  position?: ToastPosition;
  /** Default auto-dismiss duration in ms. Default `5000`. */
  duration?: number;
  /** Max visible toasts at once. Default `5`. */
  max?: number;
  /** Portal container element. Default `document.body`. */
  portalContainer?: HTMLElement;
}

export function ToastProvider({
  children,
  position = 'bottom-right',
  duration: defaultDuration = 5000,
  max = 5,
  portalContainer,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => {
      const entry = prev.find((t) => t.id === id);
      if (!entry || entry.phase === 'exiting') return prev;
      return prev.map((t) => (t.id === id ? { ...t, phase: 'exiting' as const } : t));
    });

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, EXIT_MS);
  }, []);

  const toast = useCallback((options: ToastOptions): string => {
    const id = nextId();
    const entry: ToastEntry = {
      id,
      title: options.title,
      variant: options.variant ?? 'default',
      duration: options.duration ?? defaultDuration,
      ...(options.description !== undefined && { description: options.description }),
      ...(options.action !== undefined && { action: options.action }),
      ...(options.icon !== undefined && { icon: options.icon }),
      phase: 'entering',
    };

    setToasts((prev) => {
      const next = [...prev, entry];
      const visible = next.filter((t) => t.phase !== 'exiting');
      if (visible.length > max) {
        const toDismiss = visible.slice(0, visible.length - max);
        for (const t of toDismiss) {
          setTimeout(() => dismiss(t.id), 0);
        }
      }
      return next;
    });

    // Entering → visible: triggers CSS transition from offscreen to final position
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setToasts((prev) =>
          prev.map((t) => (t.id === id && t.phase === 'entering' ? { ...t, phase: 'visible' } : t)),
        );
      });
    });

    return id;
  }, [defaultDuration, max, dismiss]);

  // Auto-dismiss timer
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (const t of toasts) {
      if (t.phase === 'visible' && t.duration !== Infinity) {
        const timer = setTimeout(() => dismiss(t.id), t.duration);
        timers.push(timer);
      }
    }
    return () => timers.forEach(clearTimeout);
  }, [toasts, dismiss]);

  const ctx: ToastContextValue = { toast, dismiss };

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      {toasts.length > 0 && (
        <ToastViewport
          toasts={toasts}
          position={position}
          onDismiss={dismiss}
          {...(portalContainer !== undefined && { portalContainer })}
        />
      )}
    </ToastContext.Provider>
  );
}

import { useState, useRef, useCallback, useLayoutEffect, type ReactNode, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  placement?: TooltipPlacement;
  /** Delay in ms before the tooltip appears. Default: 300 */
  delay?: number;
  /** Controlled visibility. When provided, overrides hover behavior. */
  open?: boolean;
  /** When true, the popup stays visible while hovered and allows pointer events inside. */
  interactive?: boolean;
}

// Arrow size in px
const ARROW = 5;
const GAP = ARROW + 3;

const arrowStyles: Record<TooltipPlacement, CSSProperties> = {
  top: {
    bottom: -ARROW,
    left: '50%',
    transform: 'translateX(-50%)',
    borderWidth: `${ARROW}px ${ARROW}px 0 ${ARROW}px`,
    borderColor: 'var(--lucent-text-primary) transparent transparent transparent',
  },
  bottom: {
    top: -ARROW,
    left: '50%',
    transform: 'translateX(-50%)',
    borderWidth: `0 ${ARROW}px ${ARROW}px ${ARROW}px`,
    borderColor: 'transparent transparent var(--lucent-text-primary) transparent',
  },
  left: {
    right: -ARROW,
    top: '50%',
    transform: 'translateY(-50%)',
    borderWidth: `${ARROW}px 0 ${ARROW}px ${ARROW}px`,
    borderColor: `transparent transparent transparent var(--lucent-text-primary)`,
  },
  right: {
    left: -ARROW,
    top: '50%',
    transform: 'translateY(-50%)',
    borderWidth: `${ARROW}px ${ARROW}px ${ARROW}px 0`,
    borderColor: `transparent var(--lucent-text-primary) transparent transparent`,
  },
};

export function Tooltip({ content, children, placement = 'top', delay = 300, open, interactive = false }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const isVisible = open !== undefined ? open : visible;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  const cancelHide = () => {
    if (hideTimer.current) { clearTimeout(hideTimer.current); hideTimer.current = null; }
  };

  const show = () => {
    cancelHide();
    timer.current = setTimeout(() => setVisible(true), delay);
  };

  const hide = () => {
    if (timer.current) clearTimeout(timer.current);
    if (interactive) {
      hideTimer.current = setTimeout(() => setVisible(false), 100);
    } else {
      setVisible(false);
    }
  };

  const updatePosition = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    switch (placement) {
      case 'top':
        setPos({ top: rect.top - GAP, left: cx });
        break;
      case 'bottom':
        setPos({ top: rect.bottom + GAP, left: cx });
        break;
      case 'left':
        setPos({ top: cy, left: rect.left - GAP });
        break;
      case 'right':
        setPos({ top: cy, left: rect.right + GAP });
        break;
    }
  }, [placement]);

  useLayoutEffect(() => {
    if (isVisible) updatePosition();
  }, [isVisible, updatePosition]);

  if (!content) return <>{children}</>;

  const transformMap: Record<TooltipPlacement, string> = {
    top: 'translate(-50%, -100%)',
    bottom: 'translate(-50%, 0)',
    left: 'translate(-100%, -50%)',
    right: 'translate(0, -50%)',
  };

  return (
    <span
      ref={triggerRef}
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {isVisible && pos && createPortal(
        <span
          role="tooltip"
          onMouseEnter={interactive ? cancelHide : undefined}
          onMouseLeave={interactive ? hide : undefined}
          style={{
            position: 'fixed',
            top: pos.top,
            left: pos.left,
            transform: transformMap[placement],
            background: 'var(--lucent-text-primary)',
            color: 'var(--lucent-bg-base)',
            padding: '5px 10px',
            borderRadius: 'var(--lucent-radius-md)',
            fontSize: 'var(--lucent-font-size-xs)',
            fontFamily: 'var(--lucent-font-family-base)',
            fontWeight: 'var(--lucent-font-weight-medium)',
            lineHeight: 'var(--lucent-line-height-base)',
            whiteSpace: 'nowrap',
            zIndex: 9999,
            pointerEvents: interactive ? 'auto' : 'none',
            boxShadow: 'var(--lucent-shadow-md)',
          }}
        >
          {content}
          <span
            aria-hidden
            style={{
              position: 'absolute',
              width: 0,
              height: 0,
              borderStyle: 'solid',
              ...arrowStyles[placement],
            }}
          />
        </span>,
        document.body,
      )}
    </span>
  );
}

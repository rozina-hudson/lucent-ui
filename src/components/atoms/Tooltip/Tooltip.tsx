import { useState, useRef, type ReactNode, type CSSProperties } from 'react';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  placement?: TooltipPlacement;
  /** Delay in ms before the tooltip appears. Default: 300 */
  delay?: number;
}

// Arrow size in px
const ARROW = 5;

const tooltipPositionStyles: Record<TooltipPlacement, CSSProperties> = {
  top:    { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: ARROW + 3 },
  bottom: { top: '100%',   left: '50%', transform: 'translateX(-50%)', marginTop: ARROW + 3 },
  left:   { right: '100%', top: '50%',  transform: 'translateY(-50%)', marginRight: ARROW + 3 },
  right:  { left: '100%',  top: '50%',  transform: 'translateY(-50%)', marginLeft: ARROW + 3 },
};

// Arrow is a zero-size element with coloured borders forming a triangle.
// The border on the side facing the trigger is transparent; the opposite side is coloured.
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

export function Tooltip({ content, children, placement = 'top', delay = 300 }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    timer.current = setTimeout(() => setVisible(true), delay);
  };

  const hide = () => {
    if (timer.current) clearTimeout(timer.current);
    setVisible(false);
  };

  if (!content) return <>{children}</>;

  return (
    <span
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {visible && (
        <span
          role="tooltip"
          style={{
            position: 'absolute',
            ...tooltipPositionStyles[placement],
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
            pointerEvents: 'none',
            boxShadow: 'var(--lucent-shadow-md)',
          }}
        >
          {content}
          {/* Arrow */}
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
        </span>
      )}
    </span>
  );
}

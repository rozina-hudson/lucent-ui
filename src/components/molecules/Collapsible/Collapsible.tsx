import { useState, useRef, useEffect, type CSSProperties, type ReactNode } from 'react';

const STYLES = `
@keyframes lucent-collapsible-open {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}
`;

export interface CollapsibleProps {
  trigger: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  style?: CSSProperties;
}

export function Collapsible({ trigger, children, defaultOpen = false, open, onOpenChange, style }: CollapsibleProps) {
  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = isControlled ? open! : internalOpen;

  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(isOpen ? undefined : 0);
  const animating = useRef(false);

  // Animate height changes
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    if (isOpen) {
      const scrollH = el.scrollHeight;
      setHeight(scrollH);
      animating.current = true;
      const timer = setTimeout(() => {
        setHeight(undefined); // remove fixed height so content can reflow
        animating.current = false;
      }, 220);
      return () => clearTimeout(timer);
    } else {
      // Snapshot current height then collapse
      setHeight(el.scrollHeight);
      // Force reflow
      el.getBoundingClientRect();
      setHeight(0);
    }
  }, [isOpen]);

  const toggle = () => {
    const next = !isOpen;
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  return (
    <>
      <style>{STYLES}</style>
      <div style={{ display: 'flex', flexDirection: 'column', fontFamily: 'var(--lucent-font-family-base)', fontSize: 'var(--lucent-font-size-md)', ...style }}>
        {/* Trigger button */}
        <button
          onClick={toggle}
          aria-expanded={isOpen}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            background: 'none',
            border: 'none',
            padding: 'var(--lucent-space-3) var(--lucent-space-4)',
            cursor: 'pointer',
            textAlign: 'left',
            outline: 'none',
            fontFamily: 'inherit',
            fontSize: 'inherit',
          }}
        >
          <span style={{ flex: 1 }}>{trigger}</span>
          <CollapsibleChevron open={isOpen} />
        </button>

        {/* Animated content wrapper */}
        <div
          ref={contentRef}
          aria-hidden={!isOpen}
          style={{
            overflow: 'hidden',
            height: height !== undefined ? height : 'auto',
            transition: 'height 200ms var(--lucent-easing-default)',
          }}
        >
          <div
            style={{
              padding: 'var(--lucent-space-2) var(--lucent-space-4) var(--lucent-space-3)',
              animation: isOpen ? 'lucent-collapsible-open 200ms var(--lucent-easing-default) forwards' : undefined,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

function CollapsibleChevron({ open }: { open: boolean }) {
  return (
    <svg
      width={16}
      height={16}
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

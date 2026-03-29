import { useState, useRef, useContext, useLayoutEffect, useEffect, type CSSProperties, type ReactNode } from 'react';
import { CardPaddingContext } from '../Card/Card.js';

const CONTENT_FADE_MS = 80;
const HEIGHT_MS = 180;
const HEIGHT_EASING = 'var(--lucent-easing-default)';
const DURATION_FAST = 'var(--lucent-duration-fast)';
const HEIGHT_TRANSITION = `height ${HEIGHT_MS}ms ${HEIGHT_EASING}`;

const STYLES = `
[data-lucent-collapsible-trigger]:hover:not(:disabled) {
  background: color-mix(in srgb, var(--lucent-text-primary) 5%, transparent) !important;
}
[data-lucent-collapsible-trigger]:hover:not(:disabled) [data-lucent-collapsible-chevron] {
  color: var(--lucent-text-primary) !important;
}
[data-lucent-collapsible-trigger]:focus-visible {
  box-shadow: 0 0 0 2px var(--lucent-surface), 0 0 0 4px var(--lucent-accent-default) !important;
}
`;

let stylesInjected = false;
function injectStyles() {
  if (stylesInjected || typeof document === 'undefined') return;
  const tag = document.createElement('style');
  tag.setAttribute('data-lucent-collapsible', '');
  tag.textContent = STYLES;
  document.head.appendChild(tag);
  stylesInjected = true;
}

export interface CollapsibleProps {
  trigger: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** When false, removes the default content padding so children can provide their own. */
  padded?: boolean;
  /** Disables the trigger button. */
  disabled?: boolean;
  style?: CSSProperties;
}

export function Collapsible({ trigger, children, defaultOpen = false, open, onOpenChange, padded = true, disabled = false, style }: CollapsibleProps) {
  const cardPad = useContext(CardPaddingContext);
  const inCard = cardPad.px !== '0' || cardPad.py !== '0';

  const isControlled = open !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = isControlled ? open! : internalOpen;

  const contentRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  // Inject shared styles once
  useEffect(injectStyles, []);

  useEffect(() => {
    mounted.current = true;
  }, []);

  // Direct DOM height animation — avoids React batching issues
  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    if (isOpen) {
      // Expand: set explicit height to animate, then clear for reflow
      el.style.overflow = 'hidden';
      const scrollH = el.scrollHeight;
      el.style.height = `${scrollH}px`;
      el.style.transition = HEIGHT_TRANSITION;
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        el.style.height = 'auto';
        el.style.overflow = 'visible';
        el.style.transition = '';
      }, HEIGHT_MS + 20);
    } else if (mounted.current) {
      // Collapse: snapshot current height, force reflow, then animate to 0
      clearTimeout(timerRef.current);
      el.style.overflow = 'hidden';
      el.style.transition = '';
      el.style.height = `${el.scrollHeight}px`;
      // Force the browser to commit the starting height
      el.getBoundingClientRect();
      el.style.transition = HEIGHT_TRANSITION;
      el.style.height = '0px';
    }
  }, [isOpen]);

  // Set initial collapsed state (no animation)
  useEffect(() => {
    const el = contentRef.current;
    if (el && !isOpen && !mounted.current) {
      el.style.height = '0px';
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup timer on unmount
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const toggle = () => {
    if (disabled) return;
    const next = !isOpen;
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  return (
      <div style={{ display: 'flex', flexDirection: 'column', fontFamily: 'var(--lucent-font-family-base)', fontSize: 'var(--lucent-font-size-md)', ...(inCard && { margin: `calc(-1 * ${cardPad.py}) calc(-1 * ${cardPad.px})` }), ...style }}>
        {/* Trigger button */}
        <button
          data-lucent-collapsible-trigger
          onClick={toggle}
          disabled={disabled}
          aria-expanded={isOpen}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            background: 'none',
            border: 'none',
            borderRadius: 'var(--lucent-radius-md)',
            padding: 'var(--lucent-space-4)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            textAlign: 'left',
            outline: 'none',
            color: 'inherit',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            opacity: disabled ? 0.5 : 1,
            transition: `background ${DURATION_FAST} ${HEIGHT_EASING}`,
          }}
        >
          <span style={{ flex: 1 }}>{trigger}</span>
          <CollapsibleChevron open={isOpen} />
        </button>

        {/* Animated content wrapper */}
        <div
          ref={contentRef}
          aria-hidden={!isOpen}
          style={{ overflow: isOpen ? 'visible' : 'hidden' }}
        >
          <div
            style={{
              ...(padded ? { padding: 'var(--lucent-space-3) var(--lucent-space-4) var(--lucent-space-4)' } : {}),
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? 'translateY(0)' : 'translateY(-4px)',
              transition: `opacity ${CONTENT_FADE_MS}ms ${HEIGHT_EASING}, transform ${CONTENT_FADE_MS}ms ${HEIGHT_EASING}`,
            }}
          >
            {children}
          </div>
        </div>
      </div>
  );
}

function CollapsibleChevron({ open }: { open: boolean }) {
  return (
    <svg
      data-lucent-collapsible-chevron
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
        transition: `transform ${DURATION_FAST} ${HEIGHT_EASING}, color ${DURATION_FAST} ${HEIGHT_EASING}`,
      }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

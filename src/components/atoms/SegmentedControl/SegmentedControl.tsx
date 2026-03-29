import { useState, useRef, useLayoutEffect, type ReactNode, type CSSProperties } from 'react';

export type SegmentedControlSize = 'sm' | 'md' | 'lg';

export interface SegmentedOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps {
  options: SegmentedOption[];
  /** Controlled selected value */
  value?: string;
  /** Initial value for uncontrolled usage */
  defaultValue?: string;
  onChange?: (value: string) => void;
  size?: SegmentedControlSize;
  /** Disabled all options */
  disabled?: boolean;
  /** Stretch to fill available width */
  fullWidth?: boolean;
  id?: string;
  style?: CSSProperties;
}

const sizeH: Record<SegmentedControlSize, string> = {
  sm: 'calc(var(--lucent-space-8) * 0.5 + 18px)',
  md: 'calc(var(--lucent-space-10) * 0.5 + 22px)',
  lg: 'calc(var(--lucent-space-12) * 0.5 + 26px)',
};
const sizeFont: Record<SegmentedControlSize, string> = {
  sm: 'var(--lucent-font-size-sm)',
  md: 'var(--lucent-font-size-md)',
  lg: 'var(--lucent-font-size-lg)',
};
const sizePx: Record<SegmentedControlSize, string> = {
  sm: 'var(--lucent-space-3)',
  md: 'var(--lucent-space-4)',
  lg: 'var(--lucent-space-5)',
};

export function SegmentedControl({
  options,
  value,
  defaultValue,
  onChange,
  size = 'md',
  disabled = false,
  fullWidth = true,
  id,
  style,
}: SegmentedControlProps) {
  const [internalValue, setInternalValue] = useState(
    defaultValue ?? options[0]?.value ?? '',
  );
  const activeValue = value !== undefined ? value : internalValue;

  const trackRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number; animate: boolean } | null>(null);
  const mounted = useRef(false);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      const btn = track.querySelector(`[data-sc-value="${activeValue}"]`) as HTMLElement | null;
      if (!btn) return;
      setIndicator({
        left: btn.offsetLeft,
        width: btn.offsetWidth,
        animate: mounted.current,
      });
      mounted.current = true;
    };
    measure();
    // Re-measure on resize (font/spacing changes can affect layout)
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    return () => ro.disconnect();
  }, [activeValue, options]);

  const handleSelect = (opt: SegmentedOption) => {
    if (disabled || opt.disabled) return;
    if (value === undefined) setInternalValue(opt.value);
    onChange?.(opt.value);
  };

  return (
    <div
      id={id}
      ref={trackRef}
      role="group"
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: fullWidth ? '100%' : 'fit-content',
        height: sizeH[size],
        // color-mix with transparent produces a relative tint that adapts to any
        // parent background (white, tinted chrome, dark mode). Baseline 2023.
        background: 'color-mix(in srgb, var(--lucent-text-primary) 6%, transparent)',
        borderRadius: 'var(--lucent-radius-lg)',
        padding: 0,
        gap: 0,
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      {/* Sliding active indicator */}
      {indicator && (
        <span
          aria-hidden
          style={{
            position: 'absolute',
            top: 3,
            left: indicator.left + 3,
            width: indicator.width - 6,
            height: `calc(100% - 6px)`,
            background: 'var(--lucent-surface)',
            borderRadius: 'var(--lucent-radius-lg)',
            boxShadow: 'var(--lucent-shadow-sm)',
            transition: indicator.animate
              ? `left var(--lucent-duration-base) cubic-bezier(0.34, 1.56, 0.64, 1), width var(--lucent-duration-base) cubic-bezier(0.22, 1, 0.36, 1)`
              : 'none',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
      )}

      {options.map(opt => {
        const isActive   = opt.value === activeValue;
        const isDisabled = disabled || Boolean(opt.disabled);

        return (
          <button
            key={opt.value}
            data-sc-value={opt.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            disabled={isDisabled}
            onClick={() => handleSelect(opt)}
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--lucent-space-1)',
              flex: 1,
              height: sizeH[size],
              padding: `0 ${sizePx[size]}`,
              fontSize: sizeFont[size],
              fontFamily: 'var(--lucent-font-family-base)',
              fontWeight: isActive
                ? 'var(--lucent-font-weight-medium)'
                : 'var(--lucent-font-weight-regular)',
              color: isDisabled
                ? 'var(--lucent-text-disabled)'
                : isActive
                  ? 'var(--lucent-text-primary)'
                  : 'var(--lucent-text-secondary)',
              background: 'transparent',
              border: 'none',
              borderRadius: 'var(--lucent-radius-lg)',
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              outline: 'none',
              whiteSpace: 'nowrap',
              transition: [
                `color var(--lucent-duration-fast) var(--lucent-easing-default)`,
                `font-weight var(--lucent-duration-fast) var(--lucent-easing-default)`,
              ].join(', '),
            }}
            onFocus={e => {
              if (e.currentTarget.matches(':focus-visible')) {
                e.currentTarget.style.boxShadow = `0 0 0 2px var(--lucent-accent-subtle)`;
              }
            }}
            onBlur={e => {
              e.currentTarget.style.boxShadow = '';
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

SegmentedControl.displayName = 'SegmentedControl';

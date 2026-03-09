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

const sizeH:    Record<SegmentedControlSize, string> = { sm: '30px', md: '36px', lg: '42px' };
const sizeFont: Record<SegmentedControlSize, string> = {
  sm: 'var(--lucent-font-size-sm)',
  md: 'var(--lucent-font-size-sm)',
  lg: 'var(--lucent-font-size-md)',
};
const sizePx: Record<SegmentedControlSize, string> = {
  sm: 'var(--lucent-space-2)',
  md: 'var(--lucent-space-3)',
  lg: 'var(--lucent-space-4)',
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
    const btn = track.querySelector(`[data-sc-value="${activeValue}"]`) as HTMLElement | null;
    if (!btn) return;
    setIndicator({ left: btn.offsetLeft, width: btn.offsetWidth, animate: mounted.current });
    mounted.current = true;
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
        background: 'var(--lucent-surface-secondary)',
        borderRadius: 'var(--lucent-radius-lg)',
        padding: 2,
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
            top: 2,
            left: indicator.left,
            width: indicator.width,
            height: `calc(100% - 4px)`,
            background: 'var(--lucent-surface)',
            borderRadius: 'var(--lucent-radius-md)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
            transition: indicator.animate
              ? `left var(--lucent-duration-base) var(--lucent-easing-default), width var(--lucent-duration-base) var(--lucent-easing-default)`
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
              height: `calc(${sizeH[size]} - 4px)`,
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
              borderRadius: 'var(--lucent-radius-md)',
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              outline: 'none',
              whiteSpace: 'nowrap',
              transition: [
                `color var(--lucent-duration-fast) var(--lucent-easing-default)`,
                `font-weight var(--lucent-duration-fast) var(--lucent-easing-default)`,
              ].join(', '),
            }}
            onFocus={e => {
              e.currentTarget.style.boxShadow = `0 0 0 2px var(--lucent-accent-subtle)`;
            }}
            onBlur={e => {
              e.currentTarget.style.boxShadow = 'none';
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

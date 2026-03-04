import { useState, useEffect, useRef, type InputHTMLAttributes } from 'react';

export type ToggleSize = 'sm' | 'md' | 'lg';

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  label?: string;
  size?: ToggleSize;
  checked?: boolean;
  defaultChecked?: boolean;
}

const sizes: Record<ToggleSize, { track: [number, number]; thumb: number }> = {
  sm: { track: [28, 16], thumb: 12 },
  md: { track: [36, 20], thumb: 16 },
  lg: { track: [44, 24], thumb: 20 },
};

const SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

const STYLES = `
@keyframes lucent-toggle-pop {
  0%   { transform: scale(1); }
  35%  { transform: scale(0.94); }
  70%  { transform: scale(1.06); }
  100% { transform: scale(1); }
}
`;

export function Toggle({
  label,
  size = 'md',
  checked,
  defaultChecked,
  disabled,
  id,
  onChange,
  style,
  ...rest
}: ToggleProps) {
  const inputId = id ?? `lucent-toggle-${Math.random().toString(36).slice(2, 7)}`;
  const isControlled = checked !== undefined;
  const [internalChecked, setInternalChecked] = useState(defaultChecked ?? false);
  const isChecked = isControlled ? Boolean(checked) : internalChecked;

  const prevChecked = useRef(isChecked);
  const [popKey, setPopKey] = useState(0);

  useEffect(() => {
    if (!disabled && prevChecked.current !== isChecked) {
      prevChecked.current = isChecked;
      setPopKey(k => k + 1);
    }
  }, [isChecked, disabled]);

  const { track: [trackW, trackH], thumb: thumbSize } = sizes[size];
  const thumbOffset = isChecked ? trackW - thumbSize - 2 : 2;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setInternalChecked(e.target.checked);
    onChange?.(e);
  };

  return (
    <>
      <style>{STYLES}</style>
      <label
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--lucent-space-2)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontFamily: 'var(--lucent-font-family-base)',
          fontSize: 'var(--lucent-font-size-md)',
          color: disabled ? 'var(--lucent-text-disabled)' : 'var(--lucent-text-primary)',
          userSelect: 'none',
          ...(style as React.CSSProperties),
        }}
      >
        <input
          type="checkbox"
          role="switch"
          id={inputId}
          checked={isControlled ? checked : internalChecked}
          disabled={disabled}
          onChange={handleChange}
          aria-checked={isChecked}
          style={{ position: 'absolute', opacity: 0, width: 0, height: 0, margin: 0, pointerEvents: 'none' }}
          {...rest}
        />
        {/* Track — re-keyed to replay pop on every toggle */}
        <span
          key={popKey}
          aria-hidden
          style={{
            position: 'relative',
            width: trackW,
            height: trackH,
            borderRadius: trackH / 2,
            background: disabled ? 'var(--lucent-bg-muted)' : isChecked ? 'var(--lucent-accent-default)' : 'var(--lucent-border-strong)',
            flexShrink: 0,
            transition: `background var(--lucent-duration-fast) var(--lucent-easing-default)`,
            animation: popKey > 0 ? `lucent-toggle-pop 240ms ${SPRING} forwards` : undefined,
          }}
        >
          {/* Thumb — spring slide */}
          <span
            style={{
              position: 'absolute',
              top: 2,
              left: thumbOffset,
              width: thumbSize,
              height: thumbSize,
              borderRadius: '50%',
              background: '#ffffff',
              boxShadow: '0 1px 3px rgb(0 0 0 / 0.2)',
              transition: `left 260ms ${SPRING}`,
            }}
          />
        </span>
        {label}
      </label>
    </>
  );
}

import { useState, useEffect, useRef, type InputHTMLAttributes } from 'react';

export type ToggleSize = 'sm' | 'md' | 'lg';

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  label?: string;
  size?: ToggleSize;
  checked?: boolean;
  defaultChecked?: boolean;
  /** Wraps the toggle in a bordered container with padding. */
  contained?: boolean;
  /** Helper text displayed below the label. */
  helperText?: string;
  /** Position of the toggle track relative to the label. */
  align?: 'left' | 'right';
}

const containedHeight: Record<ToggleSize, string> = { sm: 'calc(var(--lucent-space-8) * 0.5 + 16px)', md: 'calc(var(--lucent-space-10) * 0.5 + 20px)', lg: 'calc(var(--lucent-space-12) * 0.5 + 24px)' };

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
  contained = false,
  helperText,
  align = 'left',
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
  const [isSliding, setIsSliding] = useState(false);

  useEffect(() => {
    if (!disabled && prevChecked.current !== isChecked) {
      prevChecked.current = isChecked;
      setPopKey(k => k + 1);
      setIsSliding(true);
      const timer = setTimeout(() => setIsSliding(false), 150);
      return () => clearTimeout(timer);
    }
  }, [isChecked, disabled]);

  const { track: [trackW, trackH], thumb: thumbSize } = sizes[size];
  const thumbOffset = isChecked ? trackW - thumbSize - 2 : 2;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setInternalChecked(e.target.checked);
    onChange?.(e);
  };

  const trackEl = (
    <span
      aria-hidden
      style={{
        position: 'relative',
        width: trackW,
        height: trackH,
        borderRadius: trackH / 2,
        flexShrink: 0,
      }}
    >
      {/* Track background — remounts for pop animation */}
      <span
        key={popKey}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          background: disabled ? 'var(--lucent-surface-secondary)' : isChecked ? 'var(--lucent-accent-default)' : 'color-mix(in srgb, var(--lucent-text-primary) 12%, transparent)',
          transition: `background var(--lucent-duration-fast) var(--lucent-easing-default)`,
          animation: popKey > 0 ? `lucent-toggle-pop 240ms ${SPRING} forwards` : undefined,
        }}
      />
      {/* Thumb — persists across toggles for smooth slide + stretch */}
      <span
        style={{
          position: 'absolute',
          top: 2,
          left: thumbOffset,
          width: isSliding ? thumbSize * 1.3 : thumbSize,
          height: thumbSize,
          borderRadius: thumbSize,
          background: '#ffffff',
          boxShadow: '0 1px 3px rgb(0 0 0 / 0.2)',
          transition: `left 260ms ${SPRING}, width 200ms cubic-bezier(0.22, 1, 0.36, 1)`,
        }}
      />
    </span>
  );

  const labelContent = (
    <label
      style={{
        display: align === 'right' ? 'flex' : 'inline-flex',
        alignItems: helperText ? 'flex-start' : 'center',
        gap: 'var(--lucent-space-2)',
        ...(align === 'right' ? { width: '100%' } : {}),
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'var(--lucent-font-family-base)',
        fontSize: size === 'sm' ? 'var(--lucent-font-size-sm)' : 'var(--lucent-font-size-md)',
        color: disabled ? 'var(--lucent-text-disabled)' : 'var(--lucent-text-primary)',
        userSelect: 'none',
        ...(contained ? {} : (style as React.CSSProperties)),
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
      {align === 'left' && trackEl}
      {(label || helperText) ? (
        <span style={{ display: 'flex', flexDirection: 'column', flex: align === 'right' ? 1 : undefined }}>
          {label && <span style={{
            fontWeight: helperText ? 'var(--lucent-font-weight-medium)' : 'var(--lucent-font-weight-regular)',
            lineHeight: helperText ? 1.3 : 1,
          }}>{label}</span>}
          {helperText && (
            <span style={{
              fontSize: 'var(--lucent-font-size-xs)',
              color: disabled ? 'var(--lucent-text-disabled)' : 'var(--lucent-text-secondary)',
              marginTop: '2px',
            }}>
              {helperText}
            </span>
          )}
        </span>
      ) : null}
      {align === 'right' && trackEl}
    </label>
  );

  return (
    <>
      <style>{STYLES}</style>
      {contained ? (
        <div
          style={{
            border: `1px solid var(--lucent-border-strong)`,
            borderRadius: 'var(--lucent-radius-lg)',
            ...(helperText ? { padding: 'var(--lucent-space-3)' } : { minHeight: containedHeight[size], padding: '0 var(--lucent-space-3)', display: 'flex', alignItems: 'center' }),
            background: isChecked && !disabled ? 'color-mix(in srgb, var(--lucent-text-primary) 6%, transparent)' : 'transparent',
            transition: 'border-color var(--lucent-duration-fast) var(--lucent-easing-default), background var(--lucent-duration-fast) var(--lucent-easing-default)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            ...(style as React.CSSProperties),
          }}
          onClick={(e) => {
            if (disabled) return;
            if (e.target === e.currentTarget) {
              const input = e.currentTarget.querySelector('input');
              input?.click();
            }
          }}
        >
          {labelContent}
        </div>
      ) : labelContent}
    </>
  );
}

import {
  forwardRef,
  useState,
  useEffect,
  useCallback,
  useRef,
  type InputHTMLAttributes,
  type CSSProperties,
} from 'react';

export type CheckboxSize = 'sm' | 'md';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  label?: string;
  size?: CheckboxSize;
  indeterminate?: boolean;
}

const sizePx: Record<CheckboxSize, number> = { sm: 14, md: 16 };

// Keyframes injected once — spring pop on the box, draw-in on the mark.
const STYLES = `
@keyframes lucent-cb-pop {
  0%   { transform: scale(1); }
  35%  { transform: scale(0.82); }
  70%  { transform: scale(1.12); }
  100% { transform: scale(1); }
}
@keyframes lucent-cb-mark {
  0%   { opacity: 0; transform: scale(0.4) rotate(-10deg); }
  60%  { transform: scale(1.15) rotate(2deg); }
  100% { opacity: 1; transform: scale(1) rotate(0deg); }
}
`;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      size = 'md',
      indeterminate = false,
      checked,
      defaultChecked,
      disabled,
      id,
      onChange,
      style,
      ...rest
    },
    externalRef,
  ) => {
    const internalRef = useRef<HTMLInputElement | null>(null);
    const inputId = id ?? `lucent-checkbox-${Math.random().toString(36).slice(2, 7)}`;
    const px = sizePx[size];

    const isControlled = checked !== undefined;
    const [internalChecked, setInternalChecked] = useState(defaultChecked ?? false);
    const isChecked = isControlled ? Boolean(checked) : internalChecked;

    // Track when checked state changes to trigger the box pop animation.
    const prevChecked = useRef(isChecked);
    const [popKey, setPopKey] = useState(0);

    useEffect(() => {
      if (!disabled && prevChecked.current !== isChecked) {
        prevChecked.current = isChecked;
        setPopKey(k => k + 1);
      }
    }, [isChecked, disabled]);

    const mergeRef = useCallback(
      (el: HTMLInputElement | null) => {
        internalRef.current = el;
        if (typeof externalRef === 'function') externalRef(el);
        else if (externalRef) (externalRef as React.MutableRefObject<HTMLInputElement | null>).current = el;
      },
      [externalRef],
    );

    useEffect(() => {
      if (internalRef.current) internalRef.current.indeterminate = indeterminate;
    }, [indeterminate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setInternalChecked(e.target.checked);
      onChange?.(e);
    };

    const stroke = disabled ? 'var(--lucent-text-disabled)' : 'var(--lucent-text-on-accent)';

    const boxStyle: CSSProperties = {
      width: px,
      height: px,
      // fixed corner so global radius overrides (e.g. via customizer) don't
      // turn checkboxes into circles. the design spec keeps them slightly
      // rounded regardless of theming.
      // bumping up a bit to keep the box from feeling too sharp.
      borderRadius: '4px',
      border: `1.5px solid ${disabled ? 'transparent' : isChecked || indeterminate ? 'var(--lucent-accent-default)' : 'var(--lucent-border-strong)'}`,
      background: disabled ? 'var(--lucent-bg-muted)' : isChecked || indeterminate ? 'var(--lucent-accent-default)' : 'var(--lucent-surface-default)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      transition: `background var(--lucent-duration-fast) var(--lucent-easing-default), border-color var(--lucent-duration-fast) var(--lucent-easing-default)`,
      // Re-key forces the animation to restart on every toggle.
      animation: popKey > 0 ? 'lucent-cb-pop 220ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards' : undefined,
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
            fontSize: size === 'sm' ? 'var(--lucent-font-size-sm)' : 'var(--lucent-font-size-md)',
            color: disabled ? 'var(--lucent-text-disabled)' : 'var(--lucent-text-primary)',
            userSelect: 'none',
            ...style,
          }}
        >
          <input
            ref={mergeRef}
            type="checkbox"
            id={inputId}
            checked={isControlled ? checked : internalChecked}
            disabled={disabled}
            onChange={handleChange}
            style={{ position: 'absolute', opacity: 0, width: 0, height: 0, margin: 0, pointerEvents: 'none' }}
            {...rest}
          />
          {/* Box — animates on every toggle via popKey */}
          <span key={popKey} aria-hidden style={boxStyle}>
            {(isChecked && !indeterminate) && (
              <svg
                width={px - 4}
                height={px - 4}
                viewBox="0 0 10 10"
                fill="none"
                style={{ animation: 'lucent-cb-mark 200ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards' }}
              >
                <path d="M1.5 5L4 7.5L8.5 2.5" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {indeterminate && (
              <svg
                width={px - 4}
                height={px - 4}
                viewBox="0 0 10 10"
                fill="none"
                style={{ animation: 'lucent-cb-mark 200ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards' }}
              >
                <path d="M2 5H8" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" />
              </svg>
            )}
          </span>
          {label}
        </label>
      </>
    );
  },
);

Checkbox.displayName = 'Checkbox';

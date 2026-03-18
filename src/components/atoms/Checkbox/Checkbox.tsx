import {
  forwardRef,
  useState,
  useEffect,
  useCallback,
  useRef,
  type InputHTMLAttributes,
  type CSSProperties,
} from 'react';

export type CheckboxSize = 'sm' | 'md' | 'lg';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  label?: string;
  size?: CheckboxSize;
  indeterminate?: boolean;
  /** Wraps the checkbox in a bordered container with padding. */
  contained?: boolean;
  /** Helper text displayed below the label. */
  helperText?: string;
}

const sizePx: Record<CheckboxSize, number> = { sm: 14, md: 16, lg: 20 };
// Contained height matches Input (dampened vertical scaling)
const containedHeight: Record<CheckboxSize, string> = { sm: 'calc(var(--lucent-space-8) * 0.5 + 16px)', md: 'calc(var(--lucent-space-10) * 0.5 + 20px)', lg: 'calc(var(--lucent-space-12) * 0.5 + 24px)' };

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
      contained = false,
      helperText,
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
    const [hovered, setHovered] = useState(false);
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
      background: disabled ? 'var(--lucent-surface-secondary)' : isChecked || indeterminate ? 'var(--lucent-accent-default)' : 'var(--lucent-surface)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      transition: `background var(--lucent-duration-fast) var(--lucent-easing-default), border-color var(--lucent-duration-fast) var(--lucent-easing-default)`,
      // Re-key forces the animation to restart on every toggle.
      animation: popKey > 0 ? 'lucent-cb-pop 220ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards' : undefined,
    };

    const labelContent = (
      <label
        style={{
          display: 'inline-flex',
          alignItems: helperText ? 'flex-start' : 'center',
          gap: 'var(--lucent-space-2)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontFamily: 'var(--lucent-font-family-base)',
          fontSize: size === 'sm' ? 'var(--lucent-font-size-sm)' : 'var(--lucent-font-size-md)',
          color: disabled ? 'var(--lucent-text-disabled)' : 'var(--lucent-text-primary)',
          userSelect: 'none',
          ...(contained ? {} : style),
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
        {(label || helperText) && (
          <span style={{ display: 'flex', flexDirection: 'column' }}>
            {label && <span style={{
              fontWeight: helperText ? 'var(--lucent-font-weight-medium)' : 'var(--lucent-font-weight-regular)',
              lineHeight: helperText ? 1.4 : 1,
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
        )}
      </label>
    );

    return (
      <>
        <style>{STYLES}</style>
        {contained ? (
          <div
            onMouseEnter={() => { if (!disabled) setHovered(true); }}
            onMouseLeave={() => setHovered(false)}
            style={{
              border: `1px solid ${
                isChecked && !disabled
                  ? 'var(--lucent-accent-default)'
                  : hovered && !disabled
                  ? 'var(--lucent-border-strong)'
                  : 'var(--lucent-border-default)'
              }`,
              borderRadius: 'var(--lucent-radius-lg)',
              ...(helperText ? {} : { minHeight: containedHeight[size] }),
              padding: helperText ? 'var(--lucent-space-3)' : '0 var(--lucent-space-3)',
              display: 'flex',
              alignItems: helperText ? 'flex-start' : 'center',
              background: isChecked && !disabled ? 'var(--lucent-accent-subtle)' : 'var(--lucent-surface)',
              transition: 'border-color var(--lucent-duration-fast) var(--lucent-easing-default), background var(--lucent-duration-fast) var(--lucent-easing-default)',
              cursor: disabled ? 'not-allowed' : 'pointer',
              ...style,
            }}
            onClick={(e) => {
              if (disabled) return;
              // Only handle clicks on the container padding (not bubbled from label)
              if (e.target === e.currentTarget) {
                internalRef.current?.click();
              }
            }}
          >
            {labelContent}
          </div>
        ) : labelContent}
      </>
    );
  },
);

Checkbox.displayName = 'Checkbox';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type InputHTMLAttributes,
  type ReactNode,
  type CSSProperties,
} from 'react';

const STYLES = `
@keyframes lucent-radio-pop {
  0%   { transform: scale(1); }
  35%  { transform: scale(0.82); }
  70%  { transform: scale(1.12); }
  100% { transform: scale(1); }
}
@keyframes lucent-radio-dot {
  0%   { opacity: 0; transform: scale(0.3); }
  60%  { transform: scale(1.2); }
  100% { opacity: 1; transform: scale(1); }
}
`;

// ─── RadioGroup context ────────────────────────────────────────────────────────

interface RadioContextValue {
  name: string;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

const RadioContext = createContext<RadioContextValue | null>(null);

// ─── RadioGroup ────────────────────────────────────────────────────────────────

export type RadioGroupOrientation = 'vertical' | 'horizontal';

export interface RadioGroupProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  orientation?: RadioGroupOrientation;
  label?: string;
  children: ReactNode;
}

export function RadioGroup({
  name,
  value,
  onChange,
  disabled,
  orientation = 'vertical',
  label,
  children,
}: RadioGroupProps) {
  return (
    <RadioContext.Provider value={{ name, value, onChange, disabled: disabled ?? false }}>
      <div
        role="radiogroup"
        aria-label={label}
        style={{
          display: 'flex',
          flexDirection: orientation === 'vertical' ? 'column' : 'row',
          gap: orientation === 'vertical' ? 'var(--lucent-space-3)' : 'var(--lucent-space-4)',
          flexWrap: 'wrap',
        }}
      >
        {children}
      </div>
    </RadioContext.Provider>
  );
}

// ─── Radio ─────────────────────────────────────────────────────────────────────

export type RadioSize = 'sm' | 'md';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  value: string;
  label?: string;
  size?: RadioSize;
}

const sizePx: Record<RadioSize, number> = { sm: 14, md: 16 };

export function Radio({ value, label, size = 'md', disabled, id, onChange, checked, ...rest }: RadioProps) {
  const ctx = useContext(RadioContext);
  const inputId = id ?? `lucent-radio-${Math.random().toString(36).slice(2, 7)}`;
  const px = sizePx[size];

  const isDisabled = disabled ?? ctx?.disabled ?? false;
  const isChecked = ctx ? ctx.value === value : Boolean(checked);

  const prevChecked = useRef(isChecked);
  const [popKey, setPopKey] = useState(0);

  useEffect(() => {
    if (!isDisabled && prevChecked.current !== isChecked) {
      prevChecked.current = isChecked;
      setPopKey(k => k + 1);
    }
  }, [isChecked, isDisabled]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    ctx?.onChange(value);
    onChange?.(e);
  };

  const dotStyle: CSSProperties = {
    width: px / 2,
    height: px / 2,
    borderRadius: '50%',
    background: isDisabled ? 'var(--lucent-text-disabled)' : 'var(--lucent-text-on-accent)',
    animation: isChecked ? 'lucent-radio-dot 200ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards' : undefined,
    opacity: isChecked ? 1 : 0,
  };

  const circleStyle: CSSProperties = {
    width: px,
    height: px,
    borderRadius: '50%',
    border: `1.5px solid ${isDisabled ? 'transparent' : isChecked ? 'var(--lucent-accent-default)' : 'var(--lucent-border-strong)'}`,
    background: isDisabled ? 'var(--lucent-bg-muted)' : isChecked ? 'var(--lucent-accent-default)' : 'var(--lucent-surface-default)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: `background var(--lucent-duration-fast) var(--lucent-easing-default), border-color var(--lucent-duration-fast) var(--lucent-easing-default)`,
    animation: popKey > 0 ? 'lucent-radio-pop 220ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards' : undefined,
  };

  return (
    <>
      <style>{STYLES}</style>
      <label
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--lucent-space-2)',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          fontFamily: 'var(--lucent-font-family-base)',
          fontSize: size === 'sm' ? 'var(--lucent-font-size-sm)' : 'var(--lucent-font-size-md)',
          color: isDisabled ? 'var(--lucent-text-disabled)' : 'var(--lucent-text-primary)',
          userSelect: 'none',
        }}
      >
        <input
          type="radio"
          id={inputId}
          value={value}
          name={ctx?.name ?? rest.name}
          checked={isChecked}
          disabled={isDisabled}
          onChange={handleChange}
          style={{ position: 'absolute', opacity: 0, width: 0, height: 0, margin: 0, pointerEvents: 'none' }}
          {...rest}
        />
        <span key={popKey} aria-hidden style={circleStyle}>
          <span style={dotStyle} />
        </span>
        {label}
      </label>
    </>
  );
}

// ─── Uncontrolled standalone RadioGroup ───────────────────────────────────────

export interface RadioGroupUncontrolledProps extends Omit<RadioGroupProps, 'value' | 'onChange'> {
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export function RadioGroupUncontrolled({
  defaultValue = '',
  onChange,
  ...rest
}: RadioGroupUncontrolledProps) {
  const [value, setValue] = useState(defaultValue);
  return (
    <RadioGroup
      {...rest}
      value={value}
      onChange={(v) => {
        setValue(v);
        onChange?.(v);
      }}
    />
  );
}

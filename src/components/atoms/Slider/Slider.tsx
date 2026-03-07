import { useState, type InputHTMLAttributes } from 'react';

export type SliderSize = 'sm' | 'md' | 'lg';

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  label?: string;
  showValue?: boolean;
  size?: SliderSize;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TRACK_H: Record<SliderSize, string> = { sm: '3px', md: '4px', lg: '5px' };
const THUMB_S: Record<SliderSize, string> = { sm: '14px', md: '18px', lg: '22px' };

const STYLES = `
.lucent-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  background: transparent;
  cursor: pointer;
  outline: none;
  margin: 0;
  padding: 6px 0;
  box-sizing: border-box;
}
.lucent-slider:disabled { cursor: not-allowed; }

/* WebKit track */
.lucent-slider::-webkit-slider-runnable-track {
  height: var(--ls-track-h);
  border-radius: 999px;
  background: linear-gradient(
    to right,
    var(--lucent-accent-default) 0%,
    var(--lucent-accent-default) var(--ls-fill),
    var(--lucent-border-default) var(--ls-fill),
    var(--lucent-border-default) 100%
  );
}
.lucent-slider:disabled::-webkit-slider-runnable-track {
  background: var(--lucent-border-default);
}

/* WebKit thumb */
.lucent-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: var(--ls-thumb);
  height: var(--ls-thumb);
  border-radius: 50%;
  background: var(--lucent-accent-default);
  border: 2px solid var(--lucent-surface-default);
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.15);
  margin-top: calc((var(--ls-thumb) - var(--ls-track-h)) / -2);
  transition: transform 120ms ease, box-shadow 120ms ease;
  cursor: pointer;
}
.lucent-slider:not(:disabled):hover::-webkit-slider-thumb {
  transform: scale(1.15);
}
.lucent-slider:focus-visible::-webkit-slider-thumb {
  box-shadow: 0 0 0 3px var(--lucent-accent-subtle);
}
.lucent-slider:disabled::-webkit-slider-thumb {
  background: var(--lucent-bg-muted);
  border-color: var(--lucent-border-default);
  cursor: not-allowed;
}

/* Firefox track */
.lucent-slider::-moz-range-track {
  height: var(--ls-track-h);
  border-radius: 999px;
  background: var(--lucent-border-default);
}
.lucent-slider::-moz-range-progress {
  height: var(--ls-track-h);
  border-radius: 999px;
  background: var(--lucent-accent-default);
}
.lucent-slider:disabled::-moz-range-progress {
  background: transparent;
}

/* Firefox thumb */
.lucent-slider::-moz-range-thumb {
  width: var(--ls-thumb);
  height: var(--ls-thumb);
  border-radius: 50%;
  background: var(--lucent-accent-default);
  border: 2px solid var(--lucent-surface-default);
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.15);
  cursor: pointer;
  transition: transform 120ms ease, box-shadow 120ms ease;
}
.lucent-slider:not(:disabled):hover::-moz-range-thumb {
  transform: scale(1.15);
}
.lucent-slider:focus-visible::-moz-range-thumb {
  box-shadow: 0 0 0 3px var(--lucent-accent-subtle);
}
.lucent-slider:disabled::-moz-range-thumb {
  background: var(--lucent-bg-muted);
  border-color: var(--lucent-border-default);
  cursor: not-allowed;
}
`;

export function Slider({
  label,
  showValue = false,
  size = 'md',
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue,
  disabled,
  id,
  onChange,
  style,
  ...rest
}: SliderProps) {
  const inputId = id ?? `lucent-slider-${Math.random().toString(36).slice(2, 7)}`;
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<number>(
    defaultValue ?? Math.round((min + max) / 2),
  );
  const currentValue = isControlled ? value : internalValue;
  const fillPct = `${((currentValue - min) / (max - min)) * 100}%`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setInternalValue(Number(e.target.value));
    onChange?.(e);
  };

  return (
    <>
      <style>{STYLES}</style>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--lucent-space-1)',
          width: '100%',
          fontFamily: 'var(--lucent-font-family-base)',
          ...style,
        }}
      >
        {(label || showValue) && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            {label && (
              <label
                htmlFor={inputId}
                style={{
                  fontSize: 'var(--lucent-font-size-sm)',
                  fontWeight: 'var(--lucent-font-weight-medium)',
                  color: disabled ? 'var(--lucent-text-disabled)' : 'var(--lucent-text-primary)',
                  cursor: disabled ? 'not-allowed' : 'default',
                }}
              >
                {label}
              </label>
            )}
            {showValue && (
              <span
                style={{
                  fontSize: 'var(--lucent-font-size-sm)',
                  color: disabled ? 'var(--lucent-text-disabled)' : 'var(--lucent-text-secondary)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {currentValue}
              </span>
            )}
          </div>
        )}
        <input
          type="range"
          id={inputId}
          className="lucent-slider"
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          value={isControlled ? value : internalValue}
          onChange={handleChange}
          style={{
            ['--ls-track-h' as string]: TRACK_H[size],
            ['--ls-thumb' as string]: THUMB_S[size],
            ['--ls-fill' as string]: fillPct,
          }}
          {...rest}
        />
      </div>
    </>
  );
}

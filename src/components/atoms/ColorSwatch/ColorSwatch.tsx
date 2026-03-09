import { forwardRef, type ButtonHTMLAttributes, type CSSProperties } from 'react';

export type ColorSwatchSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type ColorSwatchShape = 'circle' | 'square';

export interface ColorSwatchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  color: string;
  size?: ColorSwatchSize;
  shape?: ColorSwatchShape;
  /** Show a checkerboard underneath — use when color may have transparency */
  showCheckerboard?: boolean;
  selected?: boolean;
}

const sizePx: Record<ColorSwatchSize, number> = {
  xs: 12,
  sm: 16,
  md: 22,
  lg: 28,
  xl: 36,
  '2xl': 48,
};

const squareRadius: Record<ColorSwatchSize, string> = {
  xs:  'var(--lucent-radius-sm)',
  sm:  'var(--lucent-radius-sm)',
  md:  'var(--lucent-radius-md)',
  lg:  'var(--lucent-radius-md)',
  xl:  'var(--lucent-radius-lg)',
  '2xl': 'var(--lucent-radius-lg)',
};

const BORDER_SHADOW   = 'inset 0 0 0 1px rgba(0,0,0,0.2)';
const SELECTED_SHADOW = 'inset 0 0 0 2px rgba(0,0,0,0.5)';
const FOCUS_SHADOW    = 'inset 0 0 0 1px rgba(0,0,0,0.2), 0 0 0 3px var(--lucent-accent-subtle)';

function checkerboardBg(color: string): CSSProperties {
  return {
    backgroundImage: [
      `linear-gradient(${color}, ${color})`,
      'linear-gradient(45deg, #e5e5e5 25%, transparent 25%)',
      'linear-gradient(-45deg, #e5e5e5 25%, transparent 25%)',
      'linear-gradient(45deg, transparent 75%, #e5e5e5 75%)',
      'linear-gradient(-45deg, transparent 75%, #e5e5e5 75%)',
    ].join(', '),
    backgroundSize: 'auto, 8px 8px, 8px 8px, 8px 8px, 8px 8px',
    backgroundPosition: '0 0, 0 0, 0 4px, 4px -4px, -4px 0',
    backgroundColor: '#fff',
  };
}

export const ColorSwatch = forwardRef<HTMLButtonElement, ColorSwatchProps>(({
  color,
  size = 'md',
  shape = 'circle',
  showCheckerboard = false,
  selected = false,
  disabled = false,
  style,
  onFocus,
  onBlur,
  onClick,
  ...rest
}, ref) => {
  const px = sizePx[size];
  const borderRadius = shape === 'circle' ? '50%' : squareRadius[size];

  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      onClick={onClick}
      style={{
        width: px,
        height: px,
        flexShrink: 0,
        ...(showCheckerboard ? checkerboardBg(color) : { background: color }),
        border: 'none',
        borderRadius,
        cursor: disabled ? 'not-allowed' : onClick ? 'pointer' : 'default',
        padding: 0,
        outline: 'none',
        opacity: disabled ? 0.4 : 1,
        boxShadow: selected ? SELECTED_SHADOW : BORDER_SHADOW,
        transition: `box-shadow var(--lucent-duration-fast) var(--lucent-easing-default)`,
        ...style,
      }}
      onFocus={e => {
        if (!disabled) e.currentTarget.style.boxShadow = FOCUS_SHADOW;
        onFocus?.(e);
      }}
      onBlur={e => {
        e.currentTarget.style.boxShadow = selected ? SELECTED_SHADOW : BORDER_SHADOW;
        onBlur?.(e);
      }}
      {...rest}
    />
  );
});

ColorSwatch.displayName = 'ColorSwatch';

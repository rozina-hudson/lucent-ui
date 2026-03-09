import { type CSSProperties } from 'react';

export type ColorSwatchSize = 'sm' | 'md' | 'lg';

export interface ColorSwatchProps {
  color: string;
  size?: ColorSwatchSize;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
  style?: CSSProperties;
}

const sizePx: Record<ColorSwatchSize, number> = { sm: 16, md: 22, lg: 28 };

export function ColorSwatch({
  color,
  size = 'md',
  selected = false,
  onClick,
  disabled = false,
  title,
  style,
}: ColorSwatchProps) {
  const px = sizePx[size];

  return (
    <button
      type="button"
      title={title ?? color}
      disabled={disabled}
      onClick={onClick}
      style={{
        width: px,
        height: px,
        flexShrink: 0,
        background: color,
        border: selected ? '2px solid var(--lucent-accent-default)' : '2px solid transparent',
        borderRadius: '50%',
        cursor: disabled ? 'not-allowed' : onClick ? 'pointer' : 'default',
        padding: 0,
        outline: 'none',
        opacity: disabled ? 0.4 : 1,
        boxShadow: '0 0 0 1px var(--lucent-border-default)',
        transition: [
          `border-color var(--lucent-duration-fast) var(--lucent-easing-default)`,
          `box-shadow var(--lucent-duration-fast) var(--lucent-easing-default)`,
        ].join(', '),
        ...style,
      }}
      onFocus={e => { if (!disabled) e.currentTarget.style.boxShadow = `0 0 0 2px var(--lucent-accent-subtle)`; }}
      onBlur={e => { e.currentTarget.style.boxShadow = '0 0 0 1px var(--lucent-border-default)'; }}
    />
  );
}

ColorSwatch.displayName = 'ColorSwatch';

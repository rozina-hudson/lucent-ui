import type { ReactNode, CSSProperties } from 'react';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface IconProps {
  /** The icon element — any SVG or icon-set component. */
  children: ReactNode;
  size?: IconSize;
  /** Accessible label. When provided the wrapper gets role="img". Omit for decorative icons. */
  label?: string;
  /** CSS color value. Defaults to currentColor so the icon inherits parent text colour. */
  color?: string;
  style?: CSSProperties;
}

const sizePx: Record<IconSize, number> = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
};

export function Icon({ children, size = 'md', label, color, style }: IconProps) {
  const px = sizePx[size];

  return (
    <span
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: px,
        height: px,
        flexShrink: 0,
        color: color ?? 'currentColor',
        ...style,
      }}
    >
      {children}
    </span>
  );
}

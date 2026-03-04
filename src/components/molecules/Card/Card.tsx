import type { CSSProperties, ReactNode } from 'react';

export type CardPadding = 'none' | 'sm' | 'md' | 'lg';
export type CardShadow = 'none' | 'sm' | 'md' | 'lg';
export type CardRadius = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps {
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  padding?: CardPadding;
  shadow?: CardShadow;
  radius?: CardRadius;
  style?: CSSProperties;
}

const paddingMap: Record<CardPadding, string> = {
  none: '0',
  sm:   'var(--lucent-space-3)',
  md:   'var(--lucent-space-4)',
  lg:   'var(--lucent-space-6)',
};

const shadowMap: Record<CardShadow, string> = {
  none: 'var(--lucent-shadow-none)',
  sm:   'var(--lucent-shadow-sm)',
  md:   'var(--lucent-shadow-md)',
  lg:   'var(--lucent-shadow-lg)',
};

const radiusMap: Record<CardRadius, string> = {
  none: 'var(--lucent-radius-none)',
  sm:   'var(--lucent-radius-sm)',
  md:   'var(--lucent-radius-md)',
  lg:   'var(--lucent-radius-lg)',
};

export function Card({
  header,
  footer,
  children,
  padding = 'md',
  shadow = 'sm',
  radius = 'md',
  style,
}: CardProps) {
  const p = paddingMap[padding];
  const borderRadius = radiusMap[radius];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--lucent-surface-default)',
        border: '1px solid var(--lucent-border-default)',
        borderRadius,
        boxShadow: shadowMap[shadow],
        overflow: 'hidden',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {header != null && (
        <div
          style={{
            padding: p,
            borderBottom: '1px solid var(--lucent-border-default)',
          }}
        >
          {header}
        </div>
      )}
      <div style={{ padding: p, flex: 1 }}>
        {children}
      </div>
      {footer != null && (
        <div
          style={{
            padding: p,
            borderTop: '1px solid var(--lucent-border-default)',
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}

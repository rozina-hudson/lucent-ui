import { createContext, useContext } from 'react';
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

export interface CardBleedProps {
  children: ReactNode;
  style?: CSSProperties;
}

const CardPaddingContext = createContext<string>('0');

const paddingMap: Record<CardPadding, string> = {
  none: '0',
  sm:   'var(--lucent-space-4)',
  md:   'var(--lucent-space-6)',
  lg:   'var(--lucent-space-8)',
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
        background: 'var(--lucent-surface)',
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
      <CardPaddingContext.Provider value={p}>
        <div style={{ padding: p, flex: 1 }}>
          {children}
        </div>
      </CardPaddingContext.Provider>
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

export function CardBleed({ children, style }: CardBleedProps) {
  const p = useContext(CardPaddingContext);

  return (
    <div
      style={{
        marginLeft: `calc(-1 * ${p})`,
        marginRight: `calc(-1 * ${p})`,
        paddingLeft: p,
        paddingRight: p,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

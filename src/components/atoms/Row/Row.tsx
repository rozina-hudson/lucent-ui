import type { CSSProperties, ReactNode } from 'react';

export type RowAs =
  | 'div'
  | 'section'
  | 'nav'
  | 'header'
  | 'footer'
  | 'main'
  | 'aside'
  | 'article'
  | 'form'
  | 'fieldset'
  | 'ul'
  | 'ol';

export type RowGap =
  | '0' | '1' | '2' | '3' | '4' | '5' | '6'
  | '8' | '10' | '12' | '16' | '20' | '24';

export type RowAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type RowJustify = 'start' | 'center' | 'end' | 'between' | 'around';

export interface RowProps {
  gap?: RowGap;
  align?: RowAlign;
  justify?: RowJustify;
  as?: RowAs;
  wrap?: boolean;
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  id?: string;
  role?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

const alignMap: Record<RowAlign, string> = {
  start:    'flex-start',
  center:   'center',
  end:      'flex-end',
  stretch:  'stretch',
  baseline: 'baseline',
};

const justifyMap: Record<RowJustify, string> = {
  start:   'flex-start',
  center:  'center',
  end:     'flex-end',
  between: 'space-between',
  around:  'space-around',
};

export function Row({
  gap = '3',
  align = 'center',
  justify = 'start',
  as = 'div',
  wrap = false,
  children,
  style,
  ...rest
}: RowProps) {
  const isList = as === 'ul' || as === 'ol';
  const computedStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    gap: `var(--lucent-space-${gap})`,
    alignItems: alignMap[align],
    justifyContent: justifyMap[justify],
    ...(wrap && { flexWrap: 'wrap' }),
    ...(isList && { listStyle: 'none', margin: 0, padding: 0 }),
    ...style,
  };

  const Tag = as as React.ElementType;
  return <Tag style={computedStyle} {...rest}>{children}</Tag>;
}

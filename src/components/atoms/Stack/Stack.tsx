import type { CSSProperties, ReactNode } from 'react';

export type StackAs =
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

export type StackGap =
  | '0' | '1' | '2' | '3' | '4' | '5' | '6'
  | '8' | '10' | '12' | '16' | '20' | '24';

export type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around';

export interface StackProps {
  gap?: StackGap;
  align?: StackAlign;
  justify?: StackJustify;
  as?: StackAs;
  wrap?: boolean;
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  id?: string;
  role?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

const alignMap: Record<StackAlign, string> = {
  start:    'flex-start',
  center:   'center',
  end:      'flex-end',
  stretch:  'stretch',
  baseline: 'baseline',
};

const justifyMap: Record<StackJustify, string> = {
  start:   'flex-start',
  center:  'center',
  end:     'flex-end',
  between: 'space-between',
  around:  'space-around',
};

export function Stack({
  gap = '4',
  align = 'stretch',
  justify = 'start',
  as = 'div',
  wrap = false,
  children,
  style,
  ...rest
}: StackProps) {
  const isList = as === 'ul' || as === 'ol';
  const computedStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
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

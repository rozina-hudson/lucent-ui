import type { CSSProperties, ReactNode } from 'react';

export type TextAs =
  | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'span' | 'div' | 'label' | 'strong' | 'em' | 'code';

export type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';
export type TextColor =
  | 'primary' | 'secondary' | 'disabled' | 'inverse' | 'onAccent'
  | 'success' | 'warning' | 'danger' | 'info';
export type TextAlign = 'left' | 'center' | 'right';
export type TextLineHeight = 'tight' | 'base' | 'relaxed';
export type TextFamily = 'base' | 'mono' | 'display';

export interface TextProps {
  as?: TextAs;
  size?: TextSize;
  weight?: TextWeight;
  color?: TextColor;
  align?: TextAlign;
  lineHeight?: TextLineHeight;
  family?: TextFamily;
  truncate?: boolean;
  children: ReactNode;
  style?: CSSProperties;
  id?: string;
  htmlFor?: string;
  className?: string;
  onClick?: React.MouseEventHandler;
  title?: string;
  'aria-label'?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
}

const colorMap: Record<TextColor, string> = {
  primary:   'var(--lucent-text-primary)',
  secondary: 'var(--lucent-text-secondary)',
  disabled:  'var(--lucent-text-disabled)',
  inverse:   'var(--lucent-text-inverse)',
  onAccent:  'var(--lucent-text-on-accent)',
  success:   'var(--lucent-success-text)',
  warning:   'var(--lucent-warning-text)',
  danger:    'var(--lucent-danger-text)',
  info:      'var(--lucent-info-text)',
};

const sizeMap: Record<TextSize, string> = {
  xs:   'var(--lucent-font-size-xs)',
  sm:   'var(--lucent-font-size-sm)',
  md:   'var(--lucent-font-size-md)',
  lg:   'var(--lucent-font-size-lg)',
  xl:   'var(--lucent-font-size-xl)',
  '2xl':'var(--lucent-font-size-2xl)',
  '3xl':'var(--lucent-font-size-3xl)',
};

const weightMap: Record<TextWeight, string> = {
  regular:  'var(--lucent-font-weight-regular)',
  medium:   'var(--lucent-font-weight-medium)',
  semibold: 'var(--lucent-font-weight-semibold)',
  bold:     'var(--lucent-font-weight-bold)',
};

const lineHeightMap: Record<TextLineHeight, string> = {
  tight:   'var(--lucent-line-height-tight)',
  base:    'var(--lucent-line-height-base)',
  relaxed: 'var(--lucent-line-height-relaxed)',
};

const familyMap: Record<TextFamily, string> = {
  base:    'var(--lucent-font-family-base)',
  mono:    'var(--lucent-font-family-mono)',
  display: 'var(--lucent-font-family-display)',
};

export function Text({
  as = 'p',
  size = 'md',
  weight = 'regular',
  color = 'primary',
  align = 'left',
  lineHeight = 'base',
  family = 'base',
  truncate = false,
  children,
  style,
  ...rest
}: TextProps) {
  const computedStyle: CSSProperties = {
    fontSize:   sizeMap[size],
    fontWeight: weightMap[weight],
    color:      colorMap[color],
    textAlign:  align,
    lineHeight: lineHeightMap[lineHeight],
    fontFamily: familyMap[family],
    margin:     0,
    ...(truncate && {
      overflow:     'hidden',
      textOverflow: 'ellipsis',
      whiteSpace:   'nowrap',
    }),
    ...style,
  };

  // React.createElement lets us use the `as` prop as a dynamic tag
  // without a JSX-level polymorphic component trick
  const Tag = as as React.ElementType;
  return <Tag style={computedStyle} {...rest}>{children}</Tag>;
}

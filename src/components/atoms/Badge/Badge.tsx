import type { ReactNode } from 'react';

export type BadgeVariant = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'accent';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: ReactNode;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, { bg: string; color: string; border: string }> = {
  neutral: { bg: 'var(--lucent-bg-muted)', color: 'var(--lucent-text-secondary)', border: 'var(--lucent-border-default)' },
  accent:  { bg: 'var(--lucent-accent-subtle)', color: 'var(--lucent-accent-active)', border: 'var(--lucent-accent-subtle)' },
  success: { bg: 'var(--lucent-success-subtle)', color: 'var(--lucent-success-text)', border: 'var(--lucent-success-subtle)' },
  warning: { bg: 'var(--lucent-warning-subtle)', color: 'var(--lucent-warning-text)', border: 'var(--lucent-warning-subtle)' },
  danger:  { bg: 'var(--lucent-danger-subtle)', color: 'var(--lucent-danger-text)', border: 'var(--lucent-danger-subtle)' },
  info:    { bg: 'var(--lucent-info-subtle)', color: 'var(--lucent-info-text)', border: 'var(--lucent-info-subtle)' },
};

const sizeStyles: Record<BadgeSize, { fontSize: string; padding: string; height: string }> = {
  sm: { fontSize: 'var(--lucent-font-size-xs)', padding: '0 var(--lucent-space-2)', height: '18px' },
  md: { fontSize: 'var(--lucent-font-size-sm)', padding: '0 var(--lucent-space-2)', height: '22px' },
};

export function Badge({ variant = 'neutral', size = 'md', dot = false, children }: BadgeProps) {
  const v = variantStyles[variant];
  const s = sizeStyles[size];

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--lucent-space-1)',
      height: s.height,
      padding: s.padding,
      fontSize: s.fontSize,
      fontFamily: 'var(--lucent-font-family-base)',
      fontWeight: 'var(--lucent-font-weight-medium)',
      lineHeight: 1,
      borderRadius: 'var(--lucent-radius-full)',
      background: v.bg,
      color: v.color,
      border: `1px solid ${v.border}`,
      whiteSpace: 'nowrap',
      boxSizing: 'border-box',
    }}>
      {dot && (
        <span style={{
          width: 6, height: 6,
          borderRadius: 'var(--lucent-radius-full)',
          background: 'currentColor',
          flexShrink: 0,
        }} />
      )}
      {children}
    </span>
  );
}

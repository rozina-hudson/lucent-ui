import type { ReactNode } from 'react';

export type TagVariant = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';
export type TagSize = 'sm' | 'md';

export interface TagProps {
  children: ReactNode;
  variant?: TagVariant;
  size?: TagSize;
  onDismiss?: () => void;
  disabled?: boolean;
}

const variantStyles: Record<TagVariant, { bg: string; color: string; border: string; dismissHover: string }> = {
  neutral: { bg: 'var(--lucent-bg-muted)',     color: 'var(--lucent-text-secondary)', border: 'var(--lucent-border-default)', dismissHover: 'var(--lucent-border-strong)' },
  accent:  { bg: 'var(--lucent-accent-subtle)', color: 'var(--lucent-accent-active)',  border: 'var(--lucent-accent-subtle)',  dismissHover: 'var(--lucent-accent-default)' },
  success: { bg: 'var(--lucent-success-subtle)', color: 'var(--lucent-success-text)', border: 'var(--lucent-success-subtle)', dismissHover: 'var(--lucent-success-default)' },
  warning: { bg: 'var(--lucent-warning-subtle)', color: 'var(--lucent-warning-text)', border: 'var(--lucent-warning-subtle)', dismissHover: 'var(--lucent-warning-default)' },
  danger:  { bg: 'var(--lucent-danger-subtle)',  color: 'var(--lucent-danger-text)',  border: 'var(--lucent-danger-subtle)',  dismissHover: 'var(--lucent-danger-default)' },
  info:    { bg: 'var(--lucent-info-subtle)',    color: 'var(--lucent-info-text)',    border: 'var(--lucent-info-subtle)',    dismissHover: 'var(--lucent-info-default)' },
};

const sizeStyles: Record<TagSize, { fontSize: string; height: string; padding: string; iconSize: number; gap: string }> = {
  sm: { fontSize: 'var(--lucent-font-size-xs)', height: '20px', padding: '0 var(--lucent-space-2)', iconSize: 10, gap: 'var(--lucent-space-1)' },
  md: { fontSize: 'var(--lucent-font-size-sm)', height: '24px', padding: '0 var(--lucent-space-2)', iconSize: 12, gap: 'var(--lucent-space-1)' },
};

export function Tag({ children, variant = 'neutral', size = 'md', onDismiss, disabled }: TagProps) {
  const v = variantStyles[variant];
  const s = sizeStyles[size];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: s.gap,
        height: s.height,
        padding: onDismiss ? `0 var(--lucent-space-1) 0 var(--lucent-space-2)` : s.padding,
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
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {children}
      {onDismiss && (
        <button
          type="button"
          onClick={disabled ? undefined : onDismiss}
          disabled={disabled}
          aria-label="Dismiss"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: s.iconSize + 4,
            height: s.iconSize + 4,
            padding: 0,
            border: 'none',
            borderRadius: 'var(--lucent-radius-full)',
            background: 'transparent',
            color: 'inherit',
            cursor: disabled ? 'not-allowed' : 'pointer',
            flexShrink: 0,
            lineHeight: 1,
          }}
          onMouseEnter={(e) => {
            if (!disabled) e.currentTarget.style.background = v.dismissHover + '33';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <svg width={s.iconSize} height={s.iconSize} viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
            <path d="M2 2L8 8M8 2L2 8" />
          </svg>
        </button>
      )}
    </span>
  );
}

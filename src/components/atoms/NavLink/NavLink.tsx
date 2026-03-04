import type { CSSProperties, MouseEventHandler, ReactNode } from 'react';

export interface NavLinkProps {
  children: ReactNode;
  href?: string;
  isActive?: boolean;
  icon?: ReactNode;
  disabled?: boolean;
  onClick?: MouseEventHandler;
  /** Polymorphic root element. Defaults to `<a>`. Use e.g. `Link` from react-router. */
  as?: React.ElementType;
  style?: CSSProperties;
}

export function NavLink({
  children,
  href,
  isActive = false,
  icon,
  disabled = false,
  onClick,
  as,
  style,
}: NavLinkProps) {
  const Tag = (as ?? 'a') as React.ElementType;

  return (
    <Tag
      href={disabled ? undefined : href}
      onClick={disabled ? undefined : onClick}
      aria-current={isActive ? 'page' : undefined}
      aria-disabled={disabled || undefined}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--lucent-space-2)',
        padding: 'var(--lucent-space-2) var(--lucent-space-3) var(--lucent-space-2) var(--lucent-space-4)',
        borderRadius: 'var(--lucent-radius-md)',
        background: disabled
          ? 'transparent'
          : isActive
          ? 'var(--lucent-accent-default)'
          : 'transparent',
        color: disabled
          ? 'var(--lucent-text-disabled)'
          : isActive
          ? 'var(--lucent-text-on-accent)'
          : 'var(--lucent-text-secondary)',
        fontFamily: 'var(--lucent-font-family-base)',
        fontSize: 'var(--lucent-font-size-md)',
        fontWeight: isActive ? 'var(--lucent-font-weight-medium)' : 'var(--lucent-font-weight-regular)',
        textDecoration: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background var(--lucent-duration-fast) var(--lucent-easing-default), color var(--lucent-duration-fast) var(--lucent-easing-default)',
        userSelect: 'none',
        boxSizing: 'border-box',
        ...style,
      }}
      onMouseEnter={(e: React.MouseEvent<HTMLElement>) => {
        if (!disabled && !isActive) e.currentTarget.style.background = 'var(--lucent-bg-muted)';
      }}
      onMouseLeave={(e: React.MouseEvent<HTMLElement>) => {
        if (!disabled && !isActive) e.currentTarget.style.background = 'transparent';
      }}
    >
      {icon != null && (
        <span style={{ display: 'flex', flexShrink: 0, color: 'inherit' }}>{icon}</span>
      )}
      {children}
    </Tag>
  );
}

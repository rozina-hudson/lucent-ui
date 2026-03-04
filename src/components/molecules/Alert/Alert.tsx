import type { CSSProperties, ReactNode } from 'react';
import { Text } from '../../atoms/Text/Text.js';

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children?: ReactNode;
  onDismiss?: () => void;
  icon?: ReactNode;
  style?: CSSProperties;
}

const variantStyles: Record<AlertVariant, { bg: string; border: string; iconColor: string; textColor: TextColor }> = {
  info:    { bg: 'var(--lucent-info-subtle)',    border: 'var(--lucent-info-default)',    iconColor: 'var(--lucent-info-text)',    textColor: 'info' },
  success: { bg: 'var(--lucent-success-subtle)', border: 'var(--lucent-success-default)', iconColor: 'var(--lucent-success-text)', textColor: 'success' },
  warning: { bg: 'var(--lucent-warning-subtle)', border: 'var(--lucent-warning-default)', iconColor: 'var(--lucent-warning-text)', textColor: 'warning' },
  danger:  { bg: 'var(--lucent-danger-subtle)',  border: 'var(--lucent-danger-default)',  iconColor: 'var(--lucent-danger-text)',  textColor: 'danger' },
};

type TextColor = 'info' | 'success' | 'warning' | 'danger';

const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 5.5V8.5M8 10.5V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const SuccessIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M5 8L7 10L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const WarningIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 2L14.5 13H1.5L8 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M8 6V9M8 11V11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const DangerIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M5.5 5.5L10.5 10.5M10.5 5.5L5.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const defaultIcons: Record<AlertVariant, ReactNode> = {
  info:    <InfoIcon />,
  success: <SuccessIcon />,
  warning: <WarningIcon />,
  danger:  <DangerIcon />,
};

const DismissIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export function Alert({
  variant = 'info',
  title,
  children,
  onDismiss,
  icon,
  style,
}: AlertProps) {
  const v = variantStyles[variant];
  const renderedIcon = icon ?? defaultIcons[variant];

  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--lucent-space-3)',
        padding: 'var(--lucent-space-3) var(--lucent-space-4)',
        background: v.bg,
        border: `1px solid ${v.border}`,
        borderRadius: 'var(--lucent-radius-md)',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      <span
        style={{
          flexShrink: 0,
          color: v.iconColor,
          display: 'flex',
          alignItems: 'center',
          paddingTop: 2,
        }}
      >
        {renderedIcon}
      </span>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--lucent-space-1)' }}>
        {title && (
          <Text as="span" size="sm" weight="semibold" color={v.textColor} lineHeight="tight">
            {title}
          </Text>
        )}
        {children && (
          <Text as="span" size="sm" color={v.textColor} lineHeight="base">
            {children}
          </Text>
        )}
      </div>

      {onDismiss && (
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onDismiss}
          style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 2,
            borderRadius: 'var(--lucent-radius-sm)',
            color: v.iconColor,
            opacity: 0.7,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.7'; }}
        >
          <DismissIcon />
        </button>
      )}
    </div>
  );
}

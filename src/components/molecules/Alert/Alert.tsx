import type { CSSProperties, ReactNode } from 'react';
import { Text } from '../../atoms/Text/Text.js';
import { CircleInfo } from '../../../icons/CircleInfo.js';
import { CircleCheck } from '../../../icons/CircleCheck.js';
import { AlertTriangle } from '../../../icons/AlertTriangle.js';
import { CircleX } from '../../../icons/CircleX.js';
import { X } from '../../../icons/X.js';

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

const iconBox = (node: ReactNode) => (
  <span style={{ display: 'inline-flex', width: 16, height: 16 }}>{node}</span>
);

const defaultIcons: Record<AlertVariant, ReactNode> = {
  info:    iconBox(<CircleInfo />),
  success: iconBox(<CircleCheck />),
  warning: iconBox(<AlertTriangle />),
  danger:  iconBox(<CircleX />),
};

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
          <span style={{ display: 'inline-flex', width: 14, height: 14 }}><X /></span>
        </button>
      )}
    </div>
  );
}

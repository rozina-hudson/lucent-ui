import type { CSSProperties, ReactNode } from 'react';
import { Text } from '../../atoms/Text/Text.js';

export interface EmptyStateProps {
  illustration?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  style?: CSSProperties;
}

export function EmptyState({
  illustration,
  title,
  description,
  action,
  style,
}: EmptyStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--lucent-space-4)',
        padding: 'var(--lucent-space-8)',
        textAlign: 'center',
        ...style,
      }}
    >
      {illustration != null && (
        <div
          style={{
            width: 64,
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--lucent-text-secondary)',
          }}
        >
          {illustration}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lucent-space-2)' }}>
        <Text as="h3" size="lg" weight="semibold" align="center" lineHeight="tight">
          {title}
        </Text>
        {description && (
          <Text size="sm" color="secondary" align="center" lineHeight="relaxed">
            {description}
          </Text>
        )}
      </div>
      {action != null && (
        <div>{action}</div>
      )}
    </div>
  );
}

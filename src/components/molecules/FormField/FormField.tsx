import type { CSSProperties, ReactNode } from 'react';
import { Text } from '../../atoms/Text/Text.js';

export interface FormFieldProps {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  helperText?: string;
  errorMessage?: string;
  children: ReactNode;
  style?: CSSProperties;
}

export function FormField({
  label,
  htmlFor,
  required = false,
  helperText,
  errorMessage,
  children,
  style,
}: FormFieldProps) {
  const subText = errorMessage ?? helperText;
  const subColor = errorMessage ? 'danger' : 'secondary';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lucent-space-2)', ...style }}>
      {label && (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--lucent-space-1)' }}>
          <Text as="label" size="sm" weight="medium" lineHeight="tight" {...(htmlFor !== undefined && { htmlFor })}>
            {label}
          </Text>
          {required && (
            <Text as="span" size="sm" color="danger" lineHeight="tight" aria-hidden="true">
              *
            </Text>
          )}
        </div>
      )}
      {children}
      {subText && (
        <Text size="xs" color={subColor} lineHeight="tight">
          {subText}
        </Text>
      )}
    </div>
  );
}

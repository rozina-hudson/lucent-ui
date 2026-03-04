import { forwardRef, type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantStyles: Record<ButtonVariant, CSSProperties> = {
  primary: {
    background: 'var(--lucent-accent-default)',
    color: 'var(--lucent-text-inverse)',
    border: '1px solid var(--lucent-accent-default)',
  },
  secondary: {
    background: 'var(--lucent-surface-default)',
    color: 'var(--lucent-text-primary)',
    border: '1px solid var(--lucent-border-default)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--lucent-text-primary)',
    border: '1px solid transparent',
  },
  danger: {
    background: 'var(--lucent-danger-default)',
    color: '#ffffff',
    border: '1px solid var(--lucent-danger-default)',
  },
};

const sizeStyles: Record<ButtonSize, CSSProperties> = {
  sm: { paddingLeft: 'var(--lucent-space-3)', paddingRight: 'var(--lucent-space-3)', paddingTop: 0, paddingBottom: 0, fontSize: 'var(--lucent-font-size-sm)', height: '32px' },
  md: { paddingLeft: 'var(--lucent-space-4)', paddingRight: 'var(--lucent-space-4)', paddingTop: 0, paddingBottom: 0, fontSize: 'var(--lucent-font-size-md)', height: '40px' },
  lg: { paddingLeft: 'var(--lucent-space-5)', paddingRight: 'var(--lucent-space-5)', paddingTop: 0, paddingBottom: 0, fontSize: 'var(--lucent-font-size-lg)', height: '48px' },
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, fullWidth = false, leftIcon, rightIcon, children, disabled, style, ...rest }, ref) => {
    const isDisabled = disabled ?? loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--lucent-space-2)',
          fontFamily: 'var(--lucent-font-family-base)',
          fontWeight: 'var(--lucent-font-weight-medium)',
          lineHeight: 1,
          borderRadius: 'var(--lucent-radius-md)',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          opacity: isDisabled ? 0.5 : 1,
          width: fullWidth ? '100%' : undefined,
          transition: 'background var(--lucent-duration-fast) var(--lucent-easing-default), opacity var(--lucent-duration-fast) var(--lucent-easing-default)',
          whiteSpace: 'nowrap',
          textDecoration: 'none',
          boxSizing: 'border-box',
          ...sizeStyles[size],
          ...variantStyles[variant],
          ...style,
        }}
        {...rest}
      >
        {leftIcon}
        {loading ? <ButtonSpinner /> : children}
        {!loading && rightIcon}
      </button>
    );
  },
);

Button.displayName = 'Button';

function ButtonSpinner() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden style={{ animation: 'lucent-spin 0.7s linear infinite' }}>
      <style>{`@keyframes lucent-spin { to { transform: rotate(360deg); } }`}</style>
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  );
}

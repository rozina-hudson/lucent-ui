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

// Hardcoded rem values matching the token scale — avoids CSS variable resolution timing issues
const sizeStyles: Record<ButtonSize, CSSProperties> = {
  sm: { height: '32px', paddingLeft: '12px', paddingRight: '12px', paddingTop: '0', paddingBottom: '0', fontSize: '13px', letterSpacing: '0.01em' },
  md: { height: '38px', paddingLeft: '16px', paddingRight: '16px', paddingTop: '0', paddingBottom: '0', fontSize: '14px', letterSpacing: '0.01em' },
  lg: { height: '46px', paddingLeft: '22px', paddingRight: '22px', paddingTop: '0', paddingBottom: '0', fontSize: '15px', letterSpacing: '0.01em' },
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
          gap: '6px',
          fontFamily: 'var(--lucent-font-family-base)',
          fontWeight: '500',
          lineHeight: 1,
          borderRadius: '6px',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          opacity: isDisabled ? 0.5 : 1,
          width: fullWidth ? '100%' : undefined,
          transition: 'background 100ms ease, border-color 100ms ease, opacity 100ms ease, box-shadow 100ms ease',
          whiteSpace: 'nowrap',
          textDecoration: 'none',
          boxSizing: 'border-box',
          outline: 'none',
          margin: 0,
          ...sizeStyles[size],
          ...variantStyles[variant],
          ...style,
        }}
        onMouseEnter={(e) => {
          if (!isDisabled) applyHover(e.currentTarget, variant);
          rest.onMouseEnter?.(e);
        }}
        onMouseLeave={(e) => {
          if (!isDisabled) removeHover(e.currentTarget, variant);
          rest.onMouseLeave?.(e);
        }}
        onMouseDown={(e) => {
          if (!isDisabled) e.currentTarget.style.transform = 'translateY(1px)';
          rest.onMouseDown?.(e);
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = '';
          rest.onMouseUp?.(e);
        }}
        onFocus={(e) => {
          e.currentTarget.style.boxShadow = '0 0 0 3px var(--lucent-accent-subtle)';
          rest.onFocus?.(e);
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = '';
          rest.onBlur?.(e);
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

function applyHover(el: HTMLButtonElement, variant: ButtonVariant) {
  if (variant === 'primary') {
    el.style.background = 'var(--lucent-accent-hover)';
    el.style.borderColor = 'var(--lucent-accent-hover)';
  } else if (variant === 'secondary') {
    el.style.background = 'var(--lucent-bg-subtle)';
  } else if (variant === 'ghost') {
    el.style.background = 'var(--lucent-bg-muted)';
  } else if (variant === 'danger') {
    el.style.background = 'var(--lucent-danger-hover)';
    el.style.borderColor = 'var(--lucent-danger-hover)';
  }
}

function removeHover(el: HTMLButtonElement, variant: ButtonVariant) {
  if (variant === 'primary') {
    el.style.background = 'var(--lucent-accent-default)';
    el.style.borderColor = 'var(--lucent-accent-default)';
  } else if (variant === 'secondary') {
    el.style.background = 'var(--lucent-surface-default)';
  } else if (variant === 'ghost') {
    el.style.background = 'transparent';
  } else if (variant === 'danger') {
    el.style.background = 'var(--lucent-danger-default)';
    el.style.borderColor = 'var(--lucent-danger-default)';
  }
}

function ButtonSpinner() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden style={{ animation: 'lucent-spin 0.7s linear infinite', flexShrink: 0 }}>
      <style>{`@keyframes lucent-spin { to { transform: rotate(360deg); } }`}</style>
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  );
}

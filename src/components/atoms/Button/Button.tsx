import { forwardRef, type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  /** When true, spaces content to the edges (justifyContent: space-between). Useful with fullWidth + rightIcon/chevron. */
  spread?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  /** Appends a chevron-down icon after the label (or rightIcon). Useful for dropdown triggers. */
  chevron?: boolean;
  /** Disables the built-in hover background/border overrides. Use when passing custom colours via style. */
  disableHoverStyles?: boolean;
}

const variantStyles: Record<ButtonVariant, CSSProperties> = {
  primary: {
    background: 'var(--lucent-accent-default)',
    color: 'var(--lucent-text-on-accent)',
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
  sm: { height: '32px', padding: '0 var(--lucent-space-3)', fontSize: 'var(--lucent-font-size-sm)' },
  md: { height: '38px', padding: '0 var(--lucent-space-4)', fontSize: 'var(--lucent-font-size-md)' },
  lg: { height: '46px', padding: '0 var(--lucent-space-5)', fontSize: 'var(--lucent-font-size-lg)' },
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, fullWidth = false, spread = false, leftIcon, rightIcon, chevron = false, disableHoverStyles = false, children, disabled, style, ...rest }, ref) => {
    const isDisabled = disabled ?? loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: spread ? 'space-between' : 'center',
          gap: 'var(--lucent-space-2)',
          fontFamily: 'var(--lucent-font-family-base)',
          fontWeight: 'var(--lucent-font-weight-medium)',
          lineHeight: 1,
          letterSpacing: '0.01em',
          borderRadius: 'var(--lucent-radius-lg)',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          width: fullWidth ? '100%' : undefined,
          transition: 'background var(--lucent-duration-fast) var(--lucent-easing-default), border-color var(--lucent-duration-fast) var(--lucent-easing-default), box-shadow var(--lucent-duration-fast) var(--lucent-easing-default), transform 80ms var(--lucent-easing-default)',
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
          outline: 'none',
          margin: 0,
          ...sizeStyles[size],
          ...variantStyles[variant],
          ...style,
          ...(isDisabled && {
            background: 'var(--lucent-bg-muted)',
            color: 'var(--lucent-text-disabled)',
            borderColor: 'transparent',
          }),
        }}
        onMouseEnter={(e) => {
          if (!isDisabled && !disableHoverStyles) applyHover(e.currentTarget, variant);
          rest.onMouseEnter?.(e);
        }}
        onMouseLeave={(e) => {
          if (!isDisabled && !disableHoverStyles) removeHover(e.currentTarget, variant);
          rest.onMouseLeave?.(e);
        }}
        onMouseDown={(e) => {
          if (!isDisabled) e.currentTarget.style.transform = 'scale(0.95)';
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
        {!loading && chevron && <ButtonChevron size={size} />}
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

const chevronSizePx: Record<ButtonSize, number> = { sm: 12, md: 14, lg: 16 };

function ButtonChevron({ size }: { size: ButtonSize }) {
  const px = chevronSizePx[size];
  return (
    <svg width={px} height={px} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ flexShrink: 0, marginLeft: -2 }}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function ButtonSpinner() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden style={{ animation: 'lucent-spin 0.7s linear infinite', flexShrink: 0 }}>
      <style>{`@keyframes lucent-spin { to { transform: rotate(360deg); } }`}</style>
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  );
}

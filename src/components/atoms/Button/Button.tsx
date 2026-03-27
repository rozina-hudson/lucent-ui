import { forwardRef, type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'danger-outline' | 'danger-ghost';
export type ButtonSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg';

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
  /** If false, the component renders without any border. Useful when you want a solid "flat" look. */
  bordered?: boolean;
}

const variantStyles: Record<ButtonVariant, CSSProperties> = {
  primary: {
    background: 'var(--lucent-accent-default)',
    color: 'var(--lucent-accent-fg)',
    border: '1px solid transparent',
  },
  secondary: {
    background: 'color-mix(in srgb, var(--lucent-accent-default) 16%, transparent)',
    color: 'var(--lucent-text-primary)',
    border: '1px solid transparent',
  },
  outline: {
    background: 'transparent',
    color: 'var(--lucent-text-primary)',
    border: '1px solid color-mix(in srgb, var(--lucent-accent-default) 35%, var(--lucent-border-default))',
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
  'danger-outline': {
    background: 'transparent',
    color: 'var(--lucent-danger-text)',
    border: '1px solid var(--lucent-danger-default)',
  },
  'danger-ghost': {
    background: 'transparent',
    color: 'var(--lucent-danger-text)',
    border: '1px solid transparent',
  },
};

const sizeStyles: Record<ButtonSize, CSSProperties> = {
  '2xs': { height: '22px', padding: '0 var(--lucent-space-2)', fontSize: 'var(--lucent-font-size-xs)', borderRadius: 'var(--lucent-radius-md)' },
  xs: { height: '26px', padding: '0 var(--lucent-space-3)', fontSize: 'var(--lucent-font-size-xs)' },
  sm: { height: 'calc(var(--lucent-space-8) * 0.5 + 18px)', padding: '0 var(--lucent-space-4)', fontSize: 'var(--lucent-font-size-sm)' },
  md: { height: 'calc(var(--lucent-space-10) * 0.5 + 22px)', padding: '0 var(--lucent-space-5)', fontSize: 'var(--lucent-font-size-md)' },
  lg: { height: 'calc(var(--lucent-space-12) * 0.5 + 26px)', padding: '0 var(--lucent-space-6)', fontSize: 'var(--lucent-font-size-lg)' },
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, fullWidth = false, spread = false, leftIcon, rightIcon, chevron = false, disableHoverStyles = false, bordered = true, children, disabled, style, ...rest }, ref) => {
    const isDisabled = disabled ?? loading;
    const isIconOnly = !children && !loading && (!!leftIcon || !!rightIcon);

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
          ...(isIconOnly && { padding: 0, aspectRatio: '1' }),
          ...variantStyles[variant],
          ...style,
          ...(isDisabled && {
            background: 'color-mix(in srgb, var(--lucent-text-primary) 6%, transparent)',
            color: 'var(--lucent-text-disabled)',
            borderColor: 'transparent',
          }),
          // hide border entirely when bordered prop is false
          ...(bordered === false && { border: 'none' }),
        }}
        onMouseEnter={(e) => {
          if (!isDisabled && !disableHoverStyles) applyHover(e.currentTarget, variant, bordered);
          rest.onMouseEnter?.(e);
        }}
        onMouseLeave={(e) => {
          if (!isDisabled && !disableHoverStyles) removeHover(e.currentTarget, variant, bordered);
          rest.onMouseLeave?.(e);
        }}
        onMouseDown={(e) => {
          if (!isDisabled) {
            const isDanger = variant === 'danger' || variant === 'danger-outline' || variant === 'danger-ghost';
            const ring = isDanger
              ? 'color-mix(in srgb, var(--lucent-danger-default) 40%, transparent)'
              : 'color-mix(in srgb, var(--lucent-accent-default) 40%, transparent)';
            e.currentTarget.style.transform = 'translateY(1px)';
            e.currentTarget.style.boxShadow = `0 0 0 4px ${ring}`;
            e.currentTarget.dataset.pressed = '1';
          }
          rest.onMouseDown?.(e);
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = '';
          e.currentTarget.style.boxShadow = '';
          delete e.currentTarget.dataset.pressed;
          rest.onMouseUp?.(e);
        }}
        onFocus={(e) => {
          if (!e.currentTarget.dataset.pressed) {
            e.currentTarget.style.boxShadow = '0 0 0 3px var(--lucent-accent-subtle)';
          }
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

const hoverShadow: Record<ButtonVariant, string> = {
  primary:          '0 4px 14px -2px color-mix(in srgb, var(--lucent-accent-default) 25%, transparent)',
  secondary:        '0 4px 14px -2px color-mix(in srgb, var(--lucent-accent-default) 20%, transparent)',
  outline:          '0 4px 14px -2px color-mix(in srgb, var(--lucent-accent-default) 20%, transparent)',
  ghost:            '0 4px 14px -2px color-mix(in srgb, var(--lucent-accent-default) 15%, transparent)',
  danger:           '0 4px 14px -2px color-mix(in srgb, var(--lucent-danger-default) 25%, transparent)',
  'danger-outline': '0 4px 14px -2px color-mix(in srgb, var(--lucent-danger-default) 20%, transparent)',
  'danger-ghost':   '0 4px 14px -2px color-mix(in srgb, var(--lucent-danger-default) 15%, transparent)',
};

function applyHover(el: HTMLButtonElement, variant: ButtonVariant, bordered?: boolean) {
  el.style.transform = 'translateY(-1px)';
  el.style.boxShadow = hoverShadow[variant];

  if (variant === 'primary') {
    el.style.background = 'var(--lucent-accent-hover)';
  } else if (variant === 'secondary') {
    el.style.background = 'color-mix(in srgb, var(--lucent-accent-default) 22%, transparent)';
  } else if (variant === 'outline') {
    el.style.background = 'color-mix(in srgb, var(--lucent-accent-default) 10%, transparent)';
  } else if (variant === 'ghost') {
    el.style.background = 'color-mix(in srgb, var(--lucent-accent-default) 8%, transparent)';
  } else if (variant === 'danger') {
    el.style.background = 'var(--lucent-danger-hover)';
    if (bordered !== false) el.style.borderColor = 'var(--lucent-danger-hover)';
  } else if (variant === 'danger-outline') {
    el.style.background = 'color-mix(in srgb, var(--lucent-danger-default) 10%, var(--lucent-surface))';
    if (bordered !== false) el.style.borderColor = 'var(--lucent-danger-hover)';
  } else if (variant === 'danger-ghost') {
    el.style.background = 'color-mix(in srgb, var(--lucent-danger-default) 8%, var(--lucent-surface))';
  }
}

function removeHover(el: HTMLButtonElement, variant: ButtonVariant, bordered?: boolean) {
  el.style.transform = '';
  el.style.boxShadow = '';

  if (variant === 'primary') {
    el.style.background = 'var(--lucent-accent-default)';
  } else if (variant === 'secondary') {
    el.style.background = 'color-mix(in srgb, var(--lucent-accent-default) 16%, transparent)';
  } else if (variant === 'outline') {
    el.style.background = 'transparent';
  } else if (variant === 'ghost') {
    el.style.background = 'transparent';
  } else if (variant === 'danger') {
    el.style.background = 'var(--lucent-danger-default)';
    if (bordered !== false) el.style.borderColor = 'var(--lucent-danger-default)';
  } else if (variant === 'danger-outline') {
    el.style.background = 'transparent';
    if (bordered !== false) el.style.borderColor = 'var(--lucent-danger-default)';
  } else if (variant === 'danger-ghost') {
    el.style.background = 'transparent';
  }
}

const chevronSizePx: Record<ButtonSize, number> = { '2xs': 8, xs: 10, sm: 12, md: 14, lg: 16 };

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

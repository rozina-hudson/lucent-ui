import { useState, type ReactNode, type CSSProperties } from 'react';

export type ChipVariant = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';
export type ChipSize = 'sm' | 'md' | 'lg';

export interface ChipProps {
  children?: ReactNode;
  variant?: ChipVariant;
  size?: ChipSize;
  /** Renders an × button. Fires when clicked. */
  onDismiss?: () => void;
  /** Makes the chip clickable (renders as button). */
  onClick?: () => void;
  /** Icon or element rendered before the label. */
  leftIcon?: ReactNode;
  /** Color swatch dot rendered before the label. */
  swatch?: string;
  /** Status dot rendered before the label (uses variant color). */
  dot?: boolean;
  /** Adds a pulsing ring animation to the status dot. Only applies when dot=true. */
  pulse?: boolean;
  /** Removes the border for a filled-only look. */
  borderless?: boolean;
  /** Transparent background with text color only. Overrides borderless. */
  ghost?: boolean;
  disabled?: boolean;
  style?: CSSProperties;
}

const variantStyles: Record<ChipVariant, {
  bg: string; color: string; border: string;
  hoverBg: string; hoverBorder: string;
}> = {
  neutral: {
    bg: 'var(--lucent-surface-secondary)',
    color: 'var(--lucent-text-secondary)',
    border: 'var(--lucent-border-default)',
    hoverBg: 'var(--lucent-surface-hover, #e5e7eb)',
    hoverBorder: 'var(--lucent-border-strong)',
  },
  accent: {
    bg: 'var(--lucent-accent-default)',
    color: 'var(--lucent-accent-fg)',
    border: 'var(--lucent-accent-default)',
    hoverBg: 'var(--lucent-accent-hover)',
    hoverBorder: 'var(--lucent-accent-hover)',
  },
  success: {
    bg: 'var(--lucent-success-subtle)',
    color: 'var(--lucent-success-text)',
    border: 'var(--lucent-success-subtle)',
    hoverBg: 'color-mix(in srgb, var(--lucent-success-default) 15%, var(--lucent-success-subtle))',
    hoverBorder: 'var(--lucent-success-default)',
  },
  warning: {
    bg: 'var(--lucent-warning-subtle)',
    color: 'var(--lucent-warning-text)',
    border: 'var(--lucent-warning-subtle)',
    hoverBg: 'color-mix(in srgb, var(--lucent-warning-default) 15%, var(--lucent-warning-subtle))',
    hoverBorder: 'var(--lucent-warning-default)',
  },
  danger: {
    bg: 'var(--lucent-danger-subtle)',
    color: 'var(--lucent-danger-text)',
    border: 'var(--lucent-danger-subtle)',
    hoverBg: 'color-mix(in srgb, var(--lucent-danger-default) 15%, var(--lucent-danger-subtle))',
    hoverBorder: 'var(--lucent-danger-default)',
  },
  info: {
    bg: 'var(--lucent-info-subtle)',
    color: 'var(--lucent-info-text)',
    border: 'var(--lucent-info-subtle)',
    hoverBg: 'color-mix(in srgb, var(--lucent-info-default) 15%, var(--lucent-info-subtle))',
    hoverBorder: 'var(--lucent-info-default)',
  },
};

const sizeStyles: Record<ChipSize, {
  fontSize: string; height: string; padding: string;
  paddingDismiss: string; iconSize: number; dotSize: number; gap: string;
}> = {
  sm: {
    fontSize: 'var(--lucent-font-size-xs)',
    height: 'calc(var(--lucent-space-5) * 0.5 + 10px)',
    padding: 'var(--lucent-space-1) var(--lucent-space-2)',
    paddingDismiss: 'var(--lucent-space-1) var(--lucent-space-1) var(--lucent-space-1) var(--lucent-space-2)',
    iconSize: 12, dotSize: 6, gap: 'var(--lucent-space-1)',
  },
  md: {
    fontSize: 'var(--lucent-font-size-sm)',
    height: 'calc(var(--lucent-space-6) * 0.5 + 12px)',
    padding: 'var(--lucent-space-1) var(--lucent-space-2)',
    paddingDismiss: 'var(--lucent-space-1) var(--lucent-space-1) var(--lucent-space-1) var(--lucent-space-2)',
    iconSize: 14, dotSize: 7, gap: 'var(--lucent-space-2)',
  },
  lg: {
    fontSize: 'var(--lucent-font-size-md)',
    height: 'calc(var(--lucent-space-8) * 0.5 + 14px)',
    padding: 'var(--lucent-space-1) var(--lucent-space-3)',
    paddingDismiss: 'var(--lucent-space-1) var(--lucent-space-2) var(--lucent-space-1) var(--lucent-space-3)',
    iconSize: 16, dotSize: 8, gap: 'var(--lucent-space-2)',
  },
};

const PULSE_STYLES = `
@keyframes lucent-chip-pulse {
  0%   { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(2.8); opacity: 0; }
}`;

export function Chip({
  children,
  variant = 'neutral',
  size = 'md',
  onDismiss,
  onClick,
  leftIcon,
  swatch,
  dot = false,
  pulse = false,
  borderless = false,
  ghost = false,
  disabled = false,
  style,
}: ChipProps) {
  const v = variantStyles[variant];
  const s = sizeStyles[size];
  const [hovered, setHovered] = useState(false);
  const showPulse = dot && pulse;
  const dotOnly = dot && !children;

  const isInteractive = !disabled && (onDismiss || onClick);

  const ghostHoverBg = `color-mix(in srgb, ${v.color} 8%, transparent)`;

  // Dot-only: compact circle just big enough for the dot + pulse overflow
  const dotOnlySize = s.dotSize * 3;

  const chipStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: dotOnly ? 'center' : undefined,
    gap: dotOnly ? undefined : s.gap,
    height: dotOnly ? dotOnlySize : s.height,
    width: dotOnly ? dotOnlySize : undefined,
    padding: dotOnly ? 0 : (onDismiss ? s.paddingDismiss : s.padding),
    fontSize: s.fontSize,
    fontFamily: 'var(--lucent-font-family-base)',
    fontWeight: 'var(--lucent-font-weight-medium)',
    lineHeight: 1,
    borderRadius: dotOnly ? 'var(--lucent-radius-full)' : 'var(--lucent-radius-lg)',
    background: ghost
      ? (hovered && isInteractive ? ghostHoverBg : 'transparent')
      : (hovered && isInteractive ? v.hoverBg : v.bg),
    color: v.color,
    border: ghost || borderless ? '1px solid transparent' : `1px solid ${hovered && isInteractive ? v.hoverBorder : v.border}`,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    opacity: disabled ? 0.5 : 1,
    transform: hovered && isInteractive ? 'translateY(-1px)' : 'none',
    boxShadow: hovered && isInteractive && !ghost ? `0 2px 4px ${v.hoverBorder}22` : 'none',
    transition: [
      'transform var(--lucent-duration-fast) var(--lucent-easing-default)',
      'box-shadow var(--lucent-duration-fast) var(--lucent-easing-default)',
      'border-color var(--lucent-duration-fast) var(--lucent-easing-default)',
      'background var(--lucent-duration-fast) var(--lucent-easing-default)',
    ].join(', '),
    cursor: isInteractive ? 'pointer' : 'default',
    // Reset button styles when onClick
    ...(onClick ? { outline: 'none' } : {}),
    ...style,
  };

  const content = (
    <>
      {showPulse && <style>{PULSE_STYLES}</style>}
      {/* Swatch dot */}
      {swatch && (
        <span style={{
          width: s.dotSize + 2,
          height: s.dotSize + 2,
          borderRadius: '50%',
          background: swatch,
          border: '1px solid rgba(0,0,0,0.1)',
          flexShrink: 0,
        }} />
      )}

      {/* Status dot */}
      {dot && !swatch && (
        <span style={{
          position: 'relative',
          width: s.dotSize,
          height: s.dotSize,
          flexShrink: 0,
        }}>
          <span style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'currentColor',
          }} />
          {showPulse && (
            <span style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: 'currentColor',
              animation: 'lucent-chip-pulse 1.5s ease-out infinite',
            }} />
          )}
        </span>
      )}

      {/* Left icon */}
      {leftIcon && !swatch && !dot && (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: s.iconSize,
          height: s.iconSize,
          flexShrink: 0,
        }}>
          {leftIcon}
        </span>
      )}

      {children}

      {/* Dismiss button */}
      {onDismiss && (
        <button
          type="button"
          onClick={disabled ? undefined : (e) => { e.stopPropagation(); onDismiss(); }}
          disabled={disabled}
          aria-label="Dismiss"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: s.iconSize + 2,
            height: s.iconSize + 2,
            padding: 0,
            border: 'none',
            borderRadius: 'var(--lucent-radius-lg)',
            background: 'transparent',
            color: 'inherit',
            cursor: disabled ? 'not-allowed' : 'pointer',
            flexShrink: 0,
            lineHeight: 1,
          }}
        >
          <svg width={s.iconSize - 2} height={s.iconSize - 2} viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
            <path d="M2 2L8 8M8 2L2 8" />
          </svg>
        </button>
      )}
    </>
  );

  const hoverHandlers = {
    onMouseEnter: () => { if (!disabled) setHovered(true); },
    onMouseLeave: () => setHovered(false),
  };

  // Render as <button> when onClick is provided
  if (onClick) {
    return (
      <button
        type="button"
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        style={chipStyle}
        {...hoverHandlers}
      >
        {content}
      </button>
    );
  }

  return (
    <span style={chipStyle} {...hoverHandlers}>
      {content}
    </span>
  );
}

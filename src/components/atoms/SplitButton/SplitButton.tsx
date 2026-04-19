import { useState, type CSSProperties, type ReactNode } from 'react';
import { Menu, MenuItem, type MenuPlacement, type MenuSize } from '../../molecules/Menu/index.js';
import { ChevronDown } from '../../../icons/ChevronDown.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SplitButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'danger-outline' | 'danger-ghost';
export type SplitButtonSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg';

export interface SplitButtonMenuItem {
  label: string;
  onSelect: () => void;
  disabled?: boolean;
  danger?: boolean;
  icon?: ReactNode;
}

export interface SplitButtonProps {
  /** Primary button label. */
  children: ReactNode;
  /** Handler for the primary action (left half). */
  onClick: () => void;
  /** Items shown in the dropdown menu. */
  menuItems: SplitButtonMenuItem[];
  /** Visual variant applied to both halves. */
  variant?: SplitButtonVariant;
  /** Size applied to both halves. */
  size?: SplitButtonSize;
  /** If false, removes the border on both halves. */
  bordered?: boolean;
  /** Dropdown placement relative to the chevron trigger. */
  menuPlacement?: MenuPlacement;
  /** Disables both halves. */
  disabled?: boolean;
  /** Shows a spinner in the primary half and disables both. */
  loading?: boolean;
  /** Icon rendered before the label in the primary half. */
  leftIcon?: ReactNode;
  /** Style overrides for the wrapper. */
  style?: CSSProperties;
}

// ─── Variant styles (mirrors Button) ─────────────────────────────────────────

const variantStyles: Record<SplitButtonVariant, CSSProperties> = {
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

// ─── Size styles ─────────────────────────────────────────────────────────────

interface SplitSizeStyle {
  height: string;
  paddingOuter: string;
  paddingInner: string;
  fontSize: string;
  borderRadius?: string;
}

const sizeStyles: Record<SplitButtonSize, SplitSizeStyle> = {
  '2xs': { height: '22px', paddingOuter: 'var(--lucent-space-2)', paddingInner: 'var(--lucent-space-1)', fontSize: 'var(--lucent-font-size-xs)', borderRadius: 'var(--lucent-radius-md)' },
  xs: { height: '26px', paddingOuter: 'var(--lucent-space-3)', paddingInner: 'var(--lucent-space-1)', fontSize: 'var(--lucent-font-size-xs)' },
  sm: { height: 'calc(var(--lucent-space-8) * 0.5 + 18px)', paddingOuter: 'var(--lucent-space-4)', paddingInner: 'var(--lucent-space-2)', fontSize: 'var(--lucent-font-size-sm)' },
  md: { height: 'calc(var(--lucent-space-10) * 0.5 + 22px)', paddingOuter: 'var(--lucent-space-5)', paddingInner: 'var(--lucent-space-3)', fontSize: 'var(--lucent-font-size-md)' },
  lg: { height: 'calc(var(--lucent-space-12) * 0.5 + 26px)', paddingOuter: 'var(--lucent-space-6)', paddingInner: 'var(--lucent-space-3)', fontSize: 'var(--lucent-font-size-lg)' },
};

const chevronSizePx: Record<SplitButtonSize, number> = { '2xs': 8, xs: 10, sm: 12, md: 14, lg: 16 };

const chevronBtnWidth: Record<SplitButtonSize, string> = {
  '2xs': '24px',
  xs: '30px',
  sm: '34px',
  md: '36px',
  lg: '42px',
};

const menuSizeMap: Record<SplitButtonSize, MenuSize> = {
  '2xs': 'sm',
  xs: 'sm',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
};

// ─── Hover helpers ────────────────────────────────────────────────────────────

const hoverBg: Record<SplitButtonVariant, string> = {
  primary: 'var(--lucent-accent-hover)',
  secondary: 'color-mix(in srgb, var(--lucent-accent-default) 22%, transparent)',
  outline: 'color-mix(in srgb, var(--lucent-accent-default) 10%, transparent)',
  ghost: 'color-mix(in srgb, var(--lucent-accent-default) 8%, transparent)',
  danger: 'var(--lucent-danger-hover)',
  'danger-outline': 'color-mix(in srgb, var(--lucent-danger-default) 10%, transparent)',
  'danger-ghost': 'color-mix(in srgb, var(--lucent-danger-default) 8%, transparent)',
};

const hoverShadow: Record<SplitButtonVariant, string> = {
  primary: '0 4px 14px -2px color-mix(in srgb, var(--lucent-accent-default) 25%, transparent)',
  secondary: '0 4px 14px -2px color-mix(in srgb, var(--lucent-accent-default) 20%, transparent)',
  outline: '0 4px 14px -2px color-mix(in srgb, var(--lucent-accent-default) 20%, transparent)',
  ghost: '0 4px 14px -2px color-mix(in srgb, var(--lucent-accent-default) 15%, transparent)',
  danger: '0 4px 14px -2px color-mix(in srgb, var(--lucent-danger-default) 25%, transparent)',
  'danger-outline': '0 4px 14px -2px color-mix(in srgb, var(--lucent-danger-default) 20%, transparent)',
  'danger-ghost': '0 4px 14px -2px color-mix(in srgb, var(--lucent-danger-default) 15%, transparent)',
};

// ─── Hover/press appliers (per-half, like Button) ────────────────────────────

function applyHover(el: HTMLButtonElement, variant: SplitButtonVariant, bordered?: boolean) {
  el.style.transform = 'translateY(-1px)';
  el.style.boxShadow = hoverShadow[variant];
  el.style.background = hoverBg[variant];

  if (variant === 'danger' && bordered !== false) {
    el.style.borderColor = 'var(--lucent-danger-hover)';
  } else if (variant === 'danger-outline' && bordered !== false) {
    el.style.borderColor = 'var(--lucent-danger-hover)';
  }
}

function removeHover(el: HTMLButtonElement, variant: SplitButtonVariant, bordered?: boolean) {
  el.style.transform = '';
  el.style.boxShadow = '';
  el.style.background = variantStyles[variant].background as string;

  if (variant === 'danger' && bordered !== false) {
    el.style.borderColor = 'var(--lucent-danger-default)';
  } else if (variant === 'danger-outline' && bordered !== false) {
    el.style.borderColor = 'var(--lucent-danger-default)';
  }
}

function applyPress(el: HTMLButtonElement, variant: SplitButtonVariant) {
  const isDanger = variant === 'danger' || variant === 'danger-outline' || variant === 'danger-ghost';
  const ring = isDanger
    ? 'color-mix(in srgb, var(--lucent-danger-default) 40%, transparent)'
    : 'color-mix(in srgb, var(--lucent-accent-default) 40%, transparent)';
  el.style.transform = 'translateY(1px)';
  el.style.boxShadow = `0 0 0 4px ${ring}`;
  el.dataset.pressed = '1';
}

function removePress(el: HTMLButtonElement) {
  el.style.transform = '';
  el.style.boxShadow = '';
  delete el.dataset.pressed;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function SplitButton({
  children,
  onClick,
  menuItems,
  variant = 'primary',
  size = 'md',
  bordered = true,
  menuPlacement = 'bottom-end',
  disabled,
  loading = false,
  leftIcon,
  style,
}: SplitButtonProps) {
  const isDisabled = disabled ?? loading;
  const [menuOpen, setMenuOpen] = useState(false);

  const sizeS = sizeStyles[size];
  const radius = sizeS.borderRadius ?? 'var(--lucent-radius-lg)';
  const px = chevronSizePx[size];

  const disabledOverrides: CSSProperties = isDisabled ? {
    background: 'color-mix(in srgb, var(--lucent-text-primary) 6%, transparent)',
    color: 'var(--lucent-text-disabled)',
    borderColor: 'transparent',
  } : {};

  // Shared base for both halves — each is a fully self-contained button
  const btnBase: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--lucent-space-2)',
    fontFamily: 'var(--lucent-font-family-base)',
    fontWeight: 'var(--lucent-font-weight-medium)',
    lineHeight: 1,
    letterSpacing: '0.01em',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    outline: 'none',
    margin: 0,
    boxSizing: 'border-box',
    whiteSpace: 'nowrap',
    transition: 'background var(--lucent-duration-fast) var(--lucent-easing-default), border-color var(--lucent-duration-fast) var(--lucent-easing-default), box-shadow var(--lucent-duration-fast) var(--lucent-easing-default), transform 80ms var(--lucent-easing-default)',
    height: sizeS.height,
    fontSize: sizeS.fontSize,
    ...variantStyles[variant],
    ...(bordered === false && { border: 'none' }),
    ...disabledOverrides,
  };

  // Inner corners get a subtle radius — one step below the outer radius
  const innerRadius = radius === 'var(--lucent-radius-md)' ? 'var(--lucent-radius-sm)' : 'var(--lucent-radius-sm)';
  const primaryRadius = `${radius} ${innerRadius} ${innerRadius} ${radius}`;
  const chevronRadius = `${innerRadius} ${radius} ${radius} ${innerRadius}`;

  return (
    <div
      role="group"
      aria-label={typeof children === 'string' ? children : 'Split button'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'calc(var(--lucent-space-1) / 2)',
        ...style,
      }}
    >
      {/* ── Primary button ── */}
      <button
        type="button"
        disabled={isDisabled}
        aria-busy={loading}
        onClick={onClick}
        onMouseEnter={(e) => { if (!isDisabled) applyHover(e.currentTarget, variant, bordered); }}
        onMouseLeave={(e) => { if (!isDisabled) removeHover(e.currentTarget, variant, bordered); }}
        onMouseDown={(e) => { if (!isDisabled) applyPress(e.currentTarget, variant); }}
        onMouseUp={(e) => { removePress(e.currentTarget); }}
        onFocus={(e) => {
          if (!e.currentTarget.dataset.pressed) {
            e.currentTarget.style.boxShadow = '0 0 0 3px var(--lucent-accent-subtle)';
          }
        }}
        onBlur={(e) => { e.currentTarget.style.boxShadow = ''; }}
        style={{
          ...btnBase,
          borderRadius: primaryRadius,
          padding: variant === 'ghost' || variant === 'danger-ghost'
            ? `0 ${sizeS.paddingInner} 0 ${sizeS.paddingOuter}`
            : `0 ${sizeS.paddingOuter}`,
        }}
      >
        {leftIcon}
        {loading ? <SplitButtonSpinner /> : children}
      </button>

      {/* ── Chevron trigger wrapped by Menu ── */}
      <Menu
        open={menuOpen}
        onOpenChange={setMenuOpen}
        placement={menuPlacement}
        size={menuSizeMap[size]}
        trigger={
          <button
            type="button"
            disabled={isDisabled}
            aria-label="More actions"
            onMouseEnter={(e) => { if (!isDisabled) applyHover(e.currentTarget, variant, bordered); }}
            onMouseLeave={(e) => { if (!isDisabled) removeHover(e.currentTarget, variant, bordered); }}
            onMouseDown={(e) => { if (!isDisabled) applyPress(e.currentTarget, variant); }}
            onMouseUp={(e) => { removePress(e.currentTarget); }}
            onFocus={(e) => {
              if (!e.currentTarget.dataset.pressed) {
                e.currentTarget.style.boxShadow = '0 0 0 3px var(--lucent-accent-subtle)';
              }
            }}
            onBlur={(e) => { e.currentTarget.style.boxShadow = ''; }}
            style={{
              ...btnBase,
              borderRadius: chevronRadius,
              padding: 0,
              width: chevronBtnWidth[size],
            }}
          >
            <span aria-hidden style={{ display: 'inline-flex', width: px, height: px, flexShrink: 0, transition: 'transform var(--lucent-duration-fast) var(--lucent-easing-default)', ...(menuOpen && { transform: 'rotate(180deg)' }) }}>
              <ChevronDown />
            </span>
          </button>
        }
      >
        {menuItems.map((item, i) => (
          <MenuItem
            key={i}
            onSelect={item.onSelect}
            {...(item.disabled !== undefined && { disabled: item.disabled })}
            {...(item.danger !== undefined && { danger: item.danger })}
            {...(item.icon !== undefined && { icon: item.icon })}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

SplitButton.displayName = 'SplitButton';

// ─── Spinner (same pattern as Button) ────────────────────────────────────────

function SplitButtonSpinner() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" aria-hidden style={{ animation: 'lucent-spin 0.7s linear infinite', flexShrink: 0 }}>
      <style>{`@keyframes lucent-spin { to { transform: rotate(360deg); } }`}</style>
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  );
}

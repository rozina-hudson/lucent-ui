import { createContext, useContext, useState } from 'react';
import type { CSSProperties, MouseEventHandler, ReactNode } from 'react';

export type CardVariant = 'ghost' | 'outline' | 'filled' | 'elevated' | 'combo';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';
export type CardShadow = 'none' | 'sm' | 'md' | 'lg';
export type CardRadius = 'none' | 'sm' | 'md' | 'lg';
export type CardStatus = 'success' | 'warning' | 'danger' | 'info';

export interface CardProps {
  /** Elevation variant — controls background, border, and default shadow. */
  variant?: CardVariant;
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  padding?: CardPadding;
  /** Overrides the variant's default shadow when set explicitly. */
  shadow?: CardShadow;
  radius?: CardRadius;
  style?: CSSProperties;

  /** Makes the card clickable. Renders as <button>. */
  onClick?: MouseEventHandler;
  /** Makes the card a link. Renders as <a>. */
  href?: string;
  /** Passed to <a> when href is set. */
  target?: string;
  /** Passed to <a> when href is set. */
  rel?: string;
  /** Disables interactive behavior. */
  disabled?: boolean;

  /** Colored left-edge accent bar indicating status. */
  status?: CardStatus;

  /** Accent inset ring indicating selection. */
  selected?: boolean;

  /** Enables hover/press visual feedback without making the card a button or link. */
  hoverable?: boolean;

  /** Full-bleed content rendered at the top (before header). */
  media?: ReactNode;
}

export interface CardBleedProps {
  children: ReactNode;
  style?: CSSProperties;
}

export const CardPaddingContext = createContext<{ px: string; py: string }>({ px: '0', py: '0' });

const paddingMap: Record<CardPadding, { py: string; px: string }> = {
  none: { py: '0',                        px: '0' },
  sm:   { py: 'var(--lucent-space-2)',     px: 'var(--lucent-space-3)' },
  md:   { py: 'var(--lucent-space-4)',     px: 'var(--lucent-space-5)' },
  lg:   { py: 'var(--lucent-space-6)',     px: 'var(--lucent-space-8)' },
};

const shadowMap: Record<CardShadow, string> = {
  none: 'var(--lucent-shadow-none)',
  sm:   'var(--lucent-shadow-sm)',
  md:   'var(--lucent-shadow-md)',
  lg:   'var(--lucent-shadow-lg)',
};

const radiusMap: Record<CardRadius, string> = {
  none: 'var(--lucent-radius-none)',
  sm:   'var(--lucent-radius-sm)',
  md:   'var(--lucent-radius-md)',
  lg:   'var(--lucent-radius-lg)',
};

const statusColorMap: Record<CardStatus, string> = {
  success: 'var(--lucent-success-default)',
  warning: 'var(--lucent-warning-default)',
  danger:  'var(--lucent-danger-default)',
  info:    'var(--lucent-info-default)',
};

interface VariantConfig {
  background: string;
  border: string;
  shadowDefault: CardShadow;
  dividers: boolean;
}

const variantConfig: Record<CardVariant, VariantConfig> = {
  ghost: {
    background: 'transparent',
    border: 'none',
    shadowDefault: 'none',
    dividers: true,
  },
  outline: {
    background: 'transparent',
    border: '1px solid var(--lucent-border-default)',
    shadowDefault: 'none',
    dividers: true,
  },
  filled: {
    background: 'color-mix(in srgb, var(--lucent-text-primary) 5%, transparent)',
    border: 'none',
    shadowDefault: 'none',
    dividers: true,
  },
  elevated: {
    background: 'var(--lucent-surface)',
    border: '1px solid var(--lucent-border-default)',
    shadowDefault: 'md',
    dividers: true,
  },
  combo: {
    background: 'color-mix(in srgb, var(--lucent-text-primary) 5%, transparent)',
    border: 'none',
    shadowDefault: 'none',
    dividers: false,
  },
};

// ── Helpers ──────────────────────────────────────────────────────────────────

const TRANSITION = [
  'transform 80ms var(--lucent-easing-default)',
  'box-shadow var(--lucent-duration-fast) var(--lucent-easing-default)',
  'border-color var(--lucent-duration-fast) var(--lucent-easing-default)',
  'background var(--lucent-duration-fast) var(--lucent-easing-default)',
].join(', ');

const HOVER_GLOW = '0 4px 14px -2px var(--lucent-accent-subtle)';
const HOVER_GLOW_NEUTRAL = '0 4px 14px -2px color-mix(in srgb, var(--lucent-text-primary) 12%, transparent)';
const FOCUS_RING = '0 0 0 3px var(--lucent-accent-subtle)';
const PRESS_RING =
  '0 0 0 2px var(--lucent-surface), 0 0 0 4px var(--lucent-accent-default)';
const SELECTED_RING = '0 0 0 3px var(--lucent-accent-subtle)';

function combineShadows(...parts: (string | undefined)[]): string | undefined {
  const filtered = parts.filter(
    (s): s is string => s != null && s !== 'none' && s !== 'var(--lucent-shadow-none)',
  );
  return filtered.length > 0 ? filtered.join(', ') : undefined;
}

function getSelectedBg(config: VariantConfig, selected: boolean, disabled: boolean): string {
  if (!selected || disabled) return config.background;
  return 'var(--lucent-accent-subtle)';
}

// ── Card ─────────────────────────────────────────────────────────────────────

export function Card({
  variant = 'outline',
  header,
  footer,
  children,
  padding = 'md',
  shadow,
  radius = 'lg',
  style,
  onClick,
  href,
  target,
  rel,
  disabled,
  status,
  selected,
  hoverable,
  media,
}: CardProps) {
  const config = variantConfig[variant];
  const isCombo = variant === 'combo';
  const effectiveShadow = shadow ?? (isCombo ? 'md' : config.shadowDefault);
  const { py, px } = paddingMap[padding];
  const pad = `${py} ${px}`;
  const borderRadius = radiusMap[radius];

  // Interactive state
  const isLink = href != null;
  const isInteractive = onClick != null || isLink;
  const hasHoverEffects = isInteractive || (hoverable ?? false);
  const isDisabled = (disabled ?? false) && isInteractive;
  const Tag = (isLink ? 'a' : isInteractive ? 'button' : 'div') as React.ElementType;

  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Selected state
  const isSelected = (selected ?? false) && !isDisabled;
  const selectedRing = isSelected ? SELECTED_RING : undefined;
  const bg = getSelectedBg(config, selected ?? false, isDisabled);

  // Status accent — inset shadow so it follows border-radius (same technique as NavMenu inverse)
  const statusShadow = status != null
    ? `inset 3px 0 0 ${statusColorMap[status]}`
    : undefined;

  // Shadow composition: variant shadow + selected ring + interactive state + status accent
  let rootShadow: string | undefined;
  if (isCombo) {
    // Combo: outer wrapper only gets selected ring (elevation shadow is on the body)
    rootShadow = combineShadows(selectedRing, statusShadow);
  } else if (hasHoverEffects && !isDisabled) {
    if (isPressed) {
      rootShadow = combineShadows(PRESS_RING, selectedRing, statusShadow);
    } else if (isFocused) {
      rootShadow = combineShadows(FOCUS_RING, selectedRing, statusShadow);
    } else if (isHovered) {
      const glow = isInteractive ? HOVER_GLOW : HOVER_GLOW_NEUTRAL;
      rootShadow = combineShadows(glow, shadowMap[effectiveShadow], selectedRing, statusShadow);
    } else {
      rootShadow = combineShadows(shadowMap[effectiveShadow], selectedRing, statusShadow);
    }
  } else {
    rootShadow = combineShadows(shadowMap[effectiveShadow], selectedRing, statusShadow);
  }

  // Root style
  const rootStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    background: bg,
    border: config.border,
    borderRadius,
    // Only clip overflow when media is present (to round image corners).
    // Default to visible so nested child shadows (e.g. elevated Card inside combo) aren't cut off.
    overflow: media != null && !(isSelected || (hasHoverEffects && isFocused)) ? 'hidden' : 'visible',
    boxSizing: 'border-box',
    position: 'relative',
    ...(rootShadow !== undefined && { boxShadow: rootShadow }),
    // Hover/press transform
    ...(hasHoverEffects && !isDisabled && isPressed && { transform: 'translateY(1px)' }),
    ...(hasHoverEffects && !isDisabled && isHovered && !isPressed && { transform: 'translateY(-1px)' }),
    // Hover/interactive base styles
    ...(hasHoverEffects && {
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      transition: TRANSITION,
    }),
    // Button UA reset
    ...(isInteractive && !isLink && {
      padding: 0,
      font: 'inherit',
      textAlign: 'inherit' as const,
      width: '100%',
      background: bg,
    }),
    // Link reset
    ...(isLink && {
      textDecoration: 'none',
      color: 'inherit',
    }),
    // Disabled
    ...(isDisabled && {
      opacity: 0.6,
      pointerEvents: 'none' as const,
    }),
    ...style,
  };

  // Hover/interactive event handlers
  const handlers = (hasHoverEffects && !isDisabled)
    ? {
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => { setIsHovered(false); setIsPressed(false); },
        onMouseDown: () => setIsPressed(true),
        onMouseUp: () => setIsPressed(false),
        onFocus: () => setIsFocused(true),
        onBlur: () => { setIsFocused(false); setIsPressed(false); },
      }
    : {};

  return (
    <Tag
      style={rootStyle}
      {...handlers}
      {...(isLink && {
        href: isDisabled ? undefined : href,
        ...(target !== undefined && { target }),
        ...(rel !== undefined && { rel }),
      })}
      {...(!isLink && isInteractive && {
        type: 'button' as const,
        ...(isDisabled && { disabled: true }),
      })}
      {...(onClick !== undefined && !isDisabled && { onClick })}
      {...(isInteractive && selected !== undefined && { 'aria-pressed': selected })}
      {...(isLink && isDisabled && { 'aria-disabled': true })}
    >
      {/* Media slot — full-bleed, no padding */}
      {media != null && (
        <div style={{ lineHeight: 0, overflow: 'hidden', borderRadius: `${borderRadius} ${borderRadius} 0 0` }}>{media}</div>
      )}

      {/* Status accent bar — rendered via inset box-shadow on root (see rootShadow) */}

      {/* Header */}
      {header != null && (
        <div
          style={{
            padding: pad,
            ...(config.dividers
              ? { borderBottom: '1px solid var(--lucent-border-default)' }
              : {}),
          }}
        >
          {header}
        </div>
      )}

      {/* Body */}
      <CardPaddingContext.Provider value={{ px, py }}>
        <div
          style={{
            padding: pad,
            flex: 1,
            ...(isCombo
              ? {
                  background: 'var(--lucent-surface)',
                  border: '1px solid var(--lucent-border-default)',
                  borderRadius,
                  boxShadow: shadowMap[effectiveShadow],
                  marginLeft: `calc(${px} / 3)`,
                  marginRight: `calc(${px} / 3)`,
                  // When header/footer is absent, mirror the horizontal inset vertically
                  // so the elevated body stays framed by the transparent chrome on all sides.
                  ...(header == null && { marginTop: `calc(${py} / 3)` }),
                  ...(footer == null && { marginBottom: `calc(${py} / 3)` }),
                }
              : {}),
          }}
        >
          {children}
        </div>
      </CardPaddingContext.Provider>

      {/* Footer */}
      {footer != null && (
        <div
          style={{
            padding: pad,
            ...(config.dividers
              ? { borderTop: '1px solid var(--lucent-border-default)' }
              : {}),
          }}
        >
          {footer}
        </div>
      )}
    </Tag>
  );
}

// ── CardBleed ────────────────────────────────────────────────────────────────

export function CardBleed({ children, style }: CardBleedProps) {
  const { px: p } = useContext(CardPaddingContext);

  return (
    <div
      style={{
        marginLeft: `calc(-1 * ${p})`,
        marginRight: `calc(-1 * ${p})`,
        paddingLeft: p,
        paddingRight: p,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

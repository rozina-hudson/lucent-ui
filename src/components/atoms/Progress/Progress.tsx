import type { CSSProperties, ReactNode } from 'react';

export type ProgressVariant = 'accent' | 'success' | 'warning' | 'danger';
export type ProgressSize = 'sm' | 'md' | 'lg';

export interface ProgressProps {
  value: number;
  max?: number;
  variant?: ProgressVariant;
  size?: ProgressSize;
  warnAt?: number;
  dangerAt?: number;
  label?: boolean | ReactNode;
  style?: CSSProperties;
}

const sizeStyles: Record<ProgressSize, { height: number; radius: string }> = {
  sm: { height: 4, radius: 'var(--lucent-radius-sm)' },
  md: { height: 8, radius: 'var(--lucent-radius-md)' },
  lg: { height: 12, radius: 'var(--lucent-radius-md)' },
};

const variantColors: Record<ProgressVariant, string> = {
  accent: 'var(--lucent-accent-default)',
  success: 'var(--lucent-success-default)',
  warning: 'var(--lucent-warning-default)',
  danger: 'var(--lucent-danger-default)',
};

function resolveVariant(
  value: number,
  max: number,
  variant: ProgressVariant | undefined,
  warnAt: number | undefined,
  dangerAt: number | undefined,
): ProgressVariant {
  if (warnAt !== undefined && dangerAt !== undefined) {
    if (warnAt <= dangerAt) {
      // Ascending: e.g. CPU usage — high is bad
      if (value >= dangerAt) return 'danger';
      if (value >= warnAt) return 'warning';
      return 'success';
    }
    // Descending: e.g. battery — low is bad
    if (value <= dangerAt) return 'danger';
    if (value <= warnAt) return 'warning';
    return 'success';
  }

  if (warnAt !== undefined) {
    const ascending = warnAt <= max / 2 ? false : true;
    if (ascending) {
      if (value >= warnAt) return 'warning';
      return variant ?? 'accent';
    }
    if (value <= warnAt) return 'warning';
    return variant ?? 'accent';
  }

  if (dangerAt !== undefined) {
    const ascending = dangerAt <= max / 2 ? false : true;
    if (ascending) {
      if (value >= dangerAt) return 'danger';
      return variant ?? 'accent';
    }
    if (value <= dangerAt) return 'danger';
    return variant ?? 'accent';
  }

  return variant ?? 'accent';
}

export function Progress({
  value,
  max = 100,
  variant,
  size = 'md',
  warnAt,
  dangerAt,
  label,
  style,
}: ProgressProps) {
  const clamped = Math.max(0, Math.min(value, max));
  const pct = max > 0 ? (clamped / max) * 100 : 0;
  const resolved = resolveVariant(clamped, max, variant, warnAt, dangerAt);
  const s = sizeStyles[size];
  const fill = variantColors[resolved];

  const labelContent =
    label === true
      ? `${Math.round(pct)}%`
      : label || null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--lucent-space-3)',
        fontFamily: 'var(--lucent-font-family-base)',
        ...style,
      }}
    >
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={max}
        style={{
          flex: 1,
          height: s.height,
          borderRadius: s.radius,
          background: 'color-mix(in srgb, var(--lucent-text-primary) 8%, transparent)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            borderRadius: s.radius,
            background: fill,
            transition: `width var(--lucent-duration-base) var(--lucent-easing-default), background var(--lucent-duration-base) var(--lucent-easing-default)`,
          }}
        />
      </div>
      {labelContent != null && (
        <span
          style={{
            fontSize: 'var(--lucent-font-size-sm)',
            fontWeight: 'var(--lucent-font-weight-medium)',
            color: 'var(--lucent-text-secondary)',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          {labelContent}
        </span>
      )}
    </div>
  );
}

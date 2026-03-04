import type { CSSProperties } from 'react';

export type SkeletonVariant = 'text' | 'circle' | 'rectangle';

export interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  lines?: number;
  animate?: boolean;
  radius?: string;
  style?: CSSProperties;
}

const defaultHeights: Record<SkeletonVariant, string | number> = {
  text:      '1em',
  circle:    40,
  rectangle: 40,
};

const defaultRadii: Record<SkeletonVariant, string> = {
  text:      'var(--lucent-radius-sm)',
  circle:    'var(--lucent-radius-full)',
  rectangle: 'var(--lucent-radius-md)',
};

function SkeletonBlock({
  width,
  height,
  radius,
  animate,
  style,
}: {
  width: string | number;
  height: string | number;
  radius: string;
  animate: boolean;
  style?: CSSProperties;
}) {
  return (
    <span
      style={{
        display: 'block',
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius: radius,
        background: animate
          ? 'linear-gradient(90deg, var(--lucent-bg-muted) 25%, var(--lucent-bg-subtle) 50%, var(--lucent-bg-muted) 75%)'
          : 'var(--lucent-bg-muted)',
        backgroundSize: animate ? '200% 100%' : undefined,
        animation: animate ? 'lucent-skeleton-shimmer 1.6s ease-in-out infinite' : undefined,
        flexShrink: 0,
        ...style,
      }}
    />
  );
}

export function Skeleton({
  variant = 'rectangle',
  width = '100%',
  height,
  lines = 1,
  animate = true,
  radius,
  style,
}: SkeletonProps) {
  const resolvedHeight = height ?? defaultHeights[variant];
  const resolvedRadius = radius ?? defaultRadii[variant];

  const keyframes = animate ? (
    <style>{`
      @keyframes lucent-skeleton-shimmer {
        0%   { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `}</style>
  ) : null;

  if (variant === 'text' && lines > 1) {
    return (
      <>
        {keyframes}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--lucent-space-2)', ...style }}>
          {Array.from({ length: lines }).map((_, i) => (
            <SkeletonBlock
              key={i}
              width={i === lines - 1 ? '70%' : width}
              height={resolvedHeight}
              radius={resolvedRadius}
              animate={animate}
            />
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      {keyframes}
      <SkeletonBlock
        width={variant === 'circle' ? (height ?? 40) : width}
        height={resolvedHeight}
        radius={resolvedRadius}
        animate={animate}
        {...(style !== undefined && { style })}
      />
    </>
  );
}

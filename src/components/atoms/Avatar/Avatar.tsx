import type { ImgHTMLAttributes } from 'react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  src?: string;
  alt: string;
  size?: AvatarSize;
  initials?: string;
}

const sizePx: Record<AvatarSize, number> = {
  xs: 24, sm: 32, md: 40, lg: 56, xl: 80,
};

const fontSizes: Record<AvatarSize, string> = {
  xs: 'var(--lucent-font-size-xs)',
  sm: 'var(--lucent-font-size-xs)',
  md: 'var(--lucent-font-size-sm)',
  lg: 'var(--lucent-font-size-lg)',
  xl: 'var(--lucent-font-size-xl)',
};

function getInitials(alt: string, initials?: string): string {
  if (initials) return initials.slice(0, 2).toUpperCase();
  const words = alt.trim().split(/\s+/);
  if (words.length === 1) return (words[0]?.[0] ?? '').toUpperCase();
  return ((words[0]?.[0] ?? '') + (words[words.length - 1]?.[0] ?? '')).toUpperCase();
}

export function Avatar({ src, alt, size = 'md', initials, style, ...rest }: AvatarProps) {
  const px = sizePx[size];
  const label = getInitials(alt, initials);

  const base: React.CSSProperties = {
    width: px,
    height: px,
    borderRadius: 'var(--lucent-radius-full)',
    flexShrink: 0,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    boxSizing: 'border-box',
    userSelect: 'none',
    ...style,
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        width={px}
        height={px}
        style={{ ...base, objectFit: 'cover' }}
        {...rest}
      />
    );
  }

  return (
    <span
      role="img"
      aria-label={alt}
      style={{
        ...base,
        background: 'var(--lucent-accent-default)',
        color: 'var(--lucent-text-on-accent)',
        fontSize: fontSizes[size],
        fontWeight: 'var(--lucent-font-weight-semibold)',
        fontFamily: 'var(--lucent-font-family-base)',
      }}
    >
      {label}
    </span>
  );
}

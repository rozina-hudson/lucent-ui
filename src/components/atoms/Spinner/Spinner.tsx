export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg';

export interface SpinnerProps {
  size?: SpinnerSize;
  label?: string;
  color?: string;
}

const sizePx: Record<SpinnerSize, number> = {
  xs: 12, sm: 16, md: 24, lg: 36,
};

const strokeWidth: Record<SpinnerSize, number> = {
  xs: 2.5, sm: 2.5, md: 2, lg: 2,
};

export function Spinner({ size = 'md', label = 'Loading…', color }: SpinnerProps) {
  const px = sizePx[size];
  const sw = strokeWidth[size];

  return (
    <span role="status" aria-label={label} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg
        width={px}
        height={px}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
        style={{ animation: 'lucent-spin 0.7s linear infinite', color: color ?? 'currentColor' }}
      >
        <style>{`@keyframes lucent-spin { to { transform: rotate(360deg); } }`}</style>
        <circle cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={sw} strokeOpacity={0.2} />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke="currentColor"
          strokeWidth={sw}
          strokeLinecap="round"
        />
      </svg>
      <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }}>
        {label}
      </span>
    </span>
  );
}

export type DividerOrientation = 'horizontal' | 'vertical';

export interface DividerProps {
  orientation?: DividerOrientation;
  label?: string;
  spacing?: string;
}

export function Divider({ orientation = 'horizontal', label, spacing = 'var(--lucent-space-4)' }: DividerProps) {
  if (orientation === 'vertical') {
    return (
      <span
        role="separator"
        aria-orientation="vertical"
        style={{
          display: 'inline-block',
          width: '1px',
          alignSelf: 'stretch',
          background: 'var(--lucent-border-default)',
          margin: `0 ${spacing}`,
          flexShrink: 0,
        }}
      />
    );
  }

  if (label) {
    return (
      <div
        role="separator"
        aria-label={label}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--lucent-space-3)',
          margin: `${spacing} 0`,
        }}
      >
        <span style={{ flex: 1, height: '1px', background: 'var(--lucent-border-default)' }} />
        <span style={{
          fontSize: 'var(--lucent-font-size-xs)',
          fontFamily: 'var(--lucent-font-family-base)',
          color: 'var(--lucent-text-secondary)',
          whiteSpace: 'nowrap',
          letterSpacing: 'var(--lucent-letter-spacing-wide)',
          textTransform: 'uppercase',
        }}>
          {label}
        </span>
        <span style={{ flex: 1, height: '1px', background: 'var(--lucent-border-default)' }} />
      </div>
    );
  }

  return (
    <hr
      role="separator"
      style={{
        border: 'none',
        borderTop: '1px solid var(--lucent-border-default)',
        margin: `${spacing} 0`,
        width: '100%',
      }}
    />
  );
}

export const chartColors = {
  accent: 'var(--lucent-accent-default)',
  success: 'var(--lucent-success-default)',
  warning: 'var(--lucent-warning-default)',
  danger: 'var(--lucent-danger-default)',
  info: 'var(--lucent-info-default)',
} as const;

export type ChartColorVariant = keyof typeof chartColors;

/** Default palette for multi-series charts. */
export const seriesPalette = [
  'var(--lucent-accent-default)',
  'var(--lucent-success-default)',
  'var(--lucent-info-default)',
  'var(--lucent-warning-default)',
  'var(--lucent-danger-default)',
] as const;

export function resolveColor(color: ChartColorVariant | string | undefined, fallback: ChartColorVariant = 'accent'): string {
  if (!color) return chartColors[fallback];
  return (chartColors as Record<string, string>)[color] ?? color;
}

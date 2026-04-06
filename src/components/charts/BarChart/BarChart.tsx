import { useState, type CSSProperties } from 'react';
import { resolveColor, type ChartColorVariant } from '../_shared/index.js';
import { scaleLinear, niceTickValues } from '../_shared/index.js';
import { Tooltip } from '../../atoms/Tooltip/index.js';

export interface BarChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface BarChartProps {
  data: BarChartDataPoint[];
  width?: number | string;
  height?: number;
  /** Bar color variant or CSS color. Per-point color overrides this. */
  color?: ChartColorVariant | string;
  /** Show horizontal grid lines. */
  gridLines?: boolean;
  /** Show value labels above bars. */
  showValues?: boolean;
  /** Custom value formatter for y-axis and value labels. */
  formatValue?: (value: number) => string;
  /** Gap between bars as fraction of slot width (0–1). */
  barGap?: number;
  /** Corner radius on bar tops. */
  barRadius?: number;
  ariaLabel?: string;
  style?: CSSProperties;
}

const VB_W = 300;
const VB_H = 200;
const PAD_L = 40;
const PAD_R = 8;
const PAD_T = 16;
const PAD_B = 24;

function roundedTopRect(x: number, y: number, w: number, h: number, r: number): string {
  const cr = Math.min(r, w / 2, h);
  return [
    `M${x},${y + h}`,
    `L${x},${y + cr}`,
    `Q${x},${y} ${x + cr},${y}`,
    `L${x + w - cr},${y}`,
    `Q${x + w},${y} ${x + w},${y + cr}`,
    `L${x + w},${y + h}`,
    'Z',
  ].join(' ');
}

/** Convert viewBox coordinate to percentage of the container. */
function pct(v: number, total: number) { return (v / total) * 100; }

const labelStyle: CSSProperties = {
  position: 'absolute',
  fontFamily: 'var(--lucent-font-family-base)',
  fontSize: 'var(--lucent-font-size-xs)',
  color: 'var(--lucent-text-secondary)',
  whiteSpace: 'nowrap',
  pointerEvents: 'none',
};

export function BarChart({
  data,
  width = '100%',
  height = 200,
  color,
  gridLines = true,
  showValues = false,
  formatValue,
  barGap = 0.3,
  barRadius = 2,
  ariaLabel = 'Bar chart',
  style,
}: BarChartProps) {
  const [hover, setHover] = useState<{ index: number; x: number; y: number } | null>(null);

  if (data.length === 0) return null;

  const resolvedColor = resolveColor(color);
  const plotW = VB_W - PAD_L - PAD_R;
  const plotBottom = VB_H - PAD_B;

  const maxVal = Math.max(...data.map((d) => d.value), 0);
  const ticks = niceTickValues(0, maxVal, 5);
  const yMax = ticks[ticks.length - 1] ?? maxVal;
  const yScale = scaleLinear([0, yMax], [plotBottom, PAD_T]);

  const slotW = plotW / data.length;
  const barW = slotW * (1 - barGap);
  const barOffset = (slotW - barW) / 2;

  const fmt = formatValue ?? ((v: number) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)));

  const handleEnter = (i: number) => {
    const d = data[i]!;
    const cx = PAD_L + i * slotW + slotW / 2;
    const cy = yScale(d.value);
    setHover({ index: i, x: pct(cx, VB_W), y: pct(cy, VB_H) });
  };

  return (
    <div style={{ position: 'relative', width, height, ...style }}>
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        role="img"
        aria-label={ariaLabel}
        style={{ display: 'block' }}
      >
        {/* Grid lines */}
        {ticks.map((tick) => {
          const y = yScale(tick);
          return gridLines ? (
            <line
              key={tick}
              x1={PAD_L} y1={y} x2={VB_W - PAD_R} y2={y}
              stroke="var(--lucent-border-subtle, #e5e7eb)"
              strokeWidth={0.5}
              strokeDasharray="3 3"
            />
          ) : null;
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const x = PAD_L + i * slotW + barOffset;
          const barH = Math.max(0, plotBottom - yScale(d.value));
          const y = plotBottom - barH;
          const fill = d.color ?? resolvedColor;
          const isActive = hover?.index === i;
          const dimmed = hover !== null && !isActive;

          return (
            <g
              key={i}
              onMouseEnter={() => handleEnter(i)}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: 'pointer' }}
            >
              <rect
                x={PAD_L + i * slotW} y={PAD_T}
                width={slotW} height={plotBottom - PAD_T}
                fill="transparent"
              />
              <path
                d={roundedTopRect(x, y, barW, barH, barRadius)}
                fill={fill}
                opacity={dimmed ? 0.35 : 1}
                style={{ transition: 'opacity 150ms' }}
              />
            </g>
          );
        })}

        {/* Baseline */}
        <line
          x1={PAD_L} y1={plotBottom} x2={VB_W - PAD_R} y2={plotBottom}
          stroke="var(--lucent-border-default, #d1d5db)"
          strokeWidth={0.5}
        />
      </svg>

      {/* Y-axis labels (DOM) */}
      {ticks.map((tick) => (
        <span key={tick} style={{
          ...labelStyle,
          right: `${pct(VB_W - PAD_L + 6, VB_W)}%`,
          top: `${pct(yScale(tick), VB_H)}%`,
          transform: 'translateY(-50%)',
          textAlign: 'right',
        }}>
          {fmt(tick)}
        </span>
      ))}

      {/* X-axis labels + value labels (DOM) */}
      {data.map((d, i) => {
        const cx = pct(PAD_L + i * slotW + slotW / 2, VB_W);
        const isActive = hover?.index === i;
        const dimmed = hover !== null && !isActive;
        const barTopY = pct(yScale(d.value), VB_H);

        return (
          <span key={i} style={{ display: 'contents' }}>
            {/* X label */}
            <span style={{
              ...labelStyle,
              left: `${cx}%`,
              top: `${pct(plotBottom + 4, VB_H)}%`,
              transform: 'translateX(-50%)',
              fontWeight: isActive ? 600 : 400,
            }}>
              {d.label}
            </span>
            {/* Value label */}
            {showValues && (
              <span style={{
                ...labelStyle,
                left: `${cx}%`,
                top: `${barTopY}%`,
                transform: 'translate(-50%, -100%) translateY(-4px)',
                opacity: dimmed ? 0.35 : 1,
                transition: 'opacity 150ms',
              }}>
                {fmt(d.value)}
              </span>
            )}
          </span>
        );
      })}

      {/* Tooltip */}
      {hover && (
        <span style={{ position: 'absolute', left: `${hover.x}%`, top: `${hover.y}%`, pointerEvents: 'none' }}>
          <span style={{ position: 'absolute', bottom: 0 }}>
            <Tooltip
              content={<><span style={{ fontWeight: 600 }}>{data[hover.index]!.label}</span>{' '}{fmt(data[hover.index]!.value)}</>}
              open
              placement="top"
            >
              <span />
            </Tooltip>
          </span>
        </span>
      )}
    </div>
  );
}

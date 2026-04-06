import { useState, type CSSProperties } from 'react';
import { resolveColor, seriesPalette, type ChartColorVariant } from '../_shared/index.js';
import {
  scaleLinear, niceTickValues,
  buildLinePath, buildAreaPath,
  buildSmoothLinePath, buildSmoothAreaPath,
} from '../_shared/index.js';
import { Tooltip } from '../../atoms/Tooltip/index.js';

export interface AreaChartDataPoint {
  label: string;
  value: number;
}

export interface AreaChartSeries {
  id: string;
  name: string;
  data: AreaChartDataPoint[];
  color?: string;
}

export interface AreaChartProps {
  /** Single-series shorthand. */
  data?: AreaChartDataPoint[];
  /** Multi-series data. */
  series?: AreaChartSeries[];
  width?: number | string;
  height?: number;
  /** Color for single-series mode. */
  color?: ChartColorVariant | string;
  gridLines?: boolean;
  /** Show dots at data points. */
  showDots?: boolean;
  dotRadius?: number;
  /** Use smooth curves. */
  smooth?: boolean;
  /** Area fill opacity (0–1). */
  fillOpacity?: number;
  /** Custom y-axis value formatter. */
  formatValue?: (value: number) => string;
  /** Max number of x-axis labels to display. */
  xLabelCount?: number;
  ariaLabel?: string;
  style?: CSSProperties;
}

const VB_W = 400;
const VB_H = 200;
const PAD_L = 40;
const PAD_R = 12;
const PAD_T = 12;
const PAD_B = 24;

export function AreaChart({
  data,
  series,
  width = '100%',
  height = 200,
  color,
  gridLines = true,
  showDots = false,
  dotRadius = 3,
  smooth = true,
  fillOpacity = 0.15,
  formatValue,
  xLabelCount,
  ariaLabel = 'Area chart',
  style,
}: AreaChartProps) {
  const [hover, setHover] = useState<{ index: number; x: number; y: number } | null>(null);

  // Normalise to series array
  const allSeries: AreaChartSeries[] = series
    ?? (data ? [{ id: '_default', name: '', data, color: resolveColor(color) }] : []);

  const firstSeries = allSeries[0];
  if (!firstSeries || firstSeries.data.length === 0) return null;

  const labels = firstSeries.data.map((d) => d.label);
  const allValues = allSeries.flatMap((s) => s.data.map((d) => d.value));
  const maxVal = Math.max(...allValues, 0);

  const plotW = VB_W - PAD_L - PAD_R;
  const plotBottom = VB_H - PAD_B;

  const ticks = niceTickValues(0, maxVal, 5);
  const yMax = ticks[ticks.length - 1] ?? maxVal;
  const yScale = scaleLinear([0, yMax], [plotBottom, PAD_T]);
  const xStep = labels.length > 1 ? plotW / (labels.length - 1) : 0;

  const fmt = formatValue ?? ((v: number) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)));

  // X-axis label sampling
  const maxLabels = xLabelCount ?? Math.min(labels.length, 7);
  const labelStep = labels.length <= maxLabels ? 1 : Math.ceil(labels.length / maxLabels);

  const buildLine = smooth ? buildSmoothLinePath : buildLinePath;
  const buildArea = smooth ? buildSmoothAreaPath : buildAreaPath;

  // All series points (pre-computed for overlays)
  const allSeriesPoints = allSeries.map((s) =>
    s.data.map((d, i) => ({ x: PAD_L + i * xStep, y: yScale(d.value) })),
  );

  const slotHalf = xStep / 2;

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const vx = ((e.clientX - rect.left) / rect.width) * VB_W;
    const plotX = vx - PAD_L;
    if (plotX < -slotHalf || plotX > plotW + slotHalf) {
      setHover(null);
      return;
    }
    const idx = xStep > 0 ? Math.round(plotX / xStep) : 0;
    const clamped = Math.max(0, Math.min(idx, labels.length - 1));

    const crosshairVX = PAD_L + clamped * xStep;
    const minY = Math.min(...allSeriesPoints.map((pts) => pts[clamped]?.y ?? PAD_T));
    setHover({ index: clamped, x: (crosshairVX / VB_W) * 100, y: (minY / VB_H) * 100 });
  };

  const tooltipContent = hover && (
    <div>
      <div style={{ fontWeight: 600, marginBottom: allSeries.length > 1 ? 2 : 0 }}>
        {labels[hover.index]}
      </div>
      {allSeries.map((s, si) => {
        const val = s.data[hover.index]?.value;
        if (val === undefined) return null;
        const seriesColor = s.color ?? seriesPalette[si % seriesPalette.length];
        return (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {allSeries.length > 1 && (
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: seriesColor, flexShrink: 0 }} />
            )}
            <span>{s.name ? `${s.name}: ` : ''}{fmt(val)}</span>
          </div>
        );
      })}
    </div>
  );

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
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHover(null)}
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

        {/* Baseline */}
        <line
          x1={PAD_L} y1={plotBottom} x2={VB_W - PAD_R} y2={plotBottom}
          stroke="var(--lucent-border-default, #d1d5db)"
          strokeWidth={0.5}
        />

        {/* Series */}
        {allSeries.map((s, si) => {
          const seriesColor = s.color ?? seriesPalette[si % seriesPalette.length];
          const pts = allSeriesPoints[si]!;
          const linePath = buildLine(pts);
          const aPath = buildArea(pts, plotBottom);

          return (
            <g key={s.id}>
              <path d={aPath} fill={seriesColor} opacity={fillOpacity} stroke="none" />
              <path
                d={linePath}
                fill="none"
                stroke={seriesColor}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          );
        })}

      </svg>

      {/* Static dots (DOM) */}
      {showDots && allSeries.map((s, si) => {
        const seriesColor = s.color ?? seriesPalette[si % seriesPalette.length];
        const pts = allSeriesPoints[si]!;
        return pts.map((p, i) => (
          <span key={`${s.id}-${i}`} style={{
            position: 'absolute',
            left: `${(p.x / VB_W) * 100}%`,
            top: `${(p.y / VB_H) * 100}%`,
            width: dotRadius * 2,
            height: dotRadius * 2,
            borderRadius: '50%',
            background: seriesColor,
            border: '1.5px solid var(--lucent-surface, #fff)',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }} />
        ));
      })}

      {/* Hover crosshair + dots (DOM) */}
      {hover && (
        <>
          <span style={{
            position: 'absolute',
            left: `${hover.x}%`,
            top: `${(PAD_T / VB_H) * 100}%`,
            width: 1,
            height: `${((plotBottom - PAD_T) / VB_H) * 100}%`,
            background: 'var(--lucent-border-default)',
            opacity: 0.5,
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
          }} />
          {allSeries.map((s, si) => {
            const pt = allSeriesPoints[si]?.[hover.index];
            if (!pt) return null;
            const seriesColor = s.color ?? seriesPalette[si % seriesPalette.length];
            return (
              <span key={s.id} style={{
                position: 'absolute',
                left: `${(pt.x / VB_W) * 100}%`,
                top: `${(pt.y / VB_H) * 100}%`,
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: seriesColor,
                border: '2px solid var(--lucent-surface, #fff)',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
              }} />
            );
          })}
        </>
      )}

      {/* Y-axis labels (DOM) */}
      {ticks.map((tick) => (
        <span key={tick} style={{
          position: 'absolute',
          right: `${((VB_W - PAD_L + 6) / VB_W) * 100}%`,
          top: `${(yScale(tick) / VB_H) * 100}%`,
          transform: 'translateY(-50%)',
          textAlign: 'right',
          fontFamily: 'var(--lucent-font-family-base)',
          fontSize: 'var(--lucent-font-size-xs)',
          color: 'var(--lucent-text-secondary)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}>
          {fmt(tick)}
        </span>
      ))}

      {/* X-axis labels (DOM) */}
      {labels.map((label, i) => {
        if (i % labelStep !== 0) return null;
        const isActive = hover?.index === i;
        return (
          <span key={i} style={{
            position: 'absolute',
            left: `${((PAD_L + i * xStep) / VB_W) * 100}%`,
            top: `${((plotBottom + 4) / VB_H) * 100}%`,
            transform: 'translateX(-50%)',
            fontFamily: 'var(--lucent-font-family-base)',
            fontSize: 'var(--lucent-font-size-xs)',
            color: 'var(--lucent-text-secondary)',
            fontWeight: isActive ? 600 : 400,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}>
            {label}
          </span>
        );
      })}

      {hover && (
        <span style={{ position: 'absolute', left: `${hover.x}%`, top: `${hover.y}%`, pointerEvents: 'none' }}>
          <span style={{ position: 'absolute', bottom: 0 }}>
            <Tooltip content={tooltipContent} open placement="top">
              <span />
            </Tooltip>
          </span>
        </span>
      )}
    </div>
  );
}

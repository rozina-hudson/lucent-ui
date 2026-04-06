import { useState, type CSSProperties, type ReactNode } from 'react';
import { seriesPalette } from '../_shared/index.js';
import { arcPath, polarToCartesian } from '../_shared/index.js';
import { Tooltip } from '../../atoms/Tooltip/index.js';

export interface DonutChartSegment {
  label: string;
  /** Absolute value (chart computes proportions). */
  value: number;
  color?: string;
}

export interface DonutChartProps {
  data: DonutChartSegment[];
  /** Overall pixel size (square). */
  size?: number;
  /** Ring thickness as fraction of radius (0–1). */
  thickness?: number;
  /** Gap between segments in degrees. */
  segmentGap?: number;
  /** Content to display in the center of the ring. */
  centerLabel?: ReactNode;
  /** Starting angle in degrees (0 = 12 o'clock). */
  startAngle?: number;
  ariaLabel?: string;
  style?: CSSProperties;
}

const VB = 100;
const CX = 50;
const CY = 50;
const OUTER_R = 45;

export function DonutChart({
  data,
  size = 160,
  thickness = 0.35,
  segmentGap = 2,
  centerLabel,
  startAngle = 0,
  ariaLabel = 'Donut chart',
  style,
}: DonutChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (data.length === 0) return null;

  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) return null;

  const innerR = OUTER_R * (1 - thickness);
  const totalGap = segmentGap * data.length;
  const availableDeg = 360 - totalGap;

  let angle = startAngle;
  const segments = data.map((d, i) => {
    const span = (d.value / total) * availableDeg;
    const segStart = angle;
    const segEnd = angle + span;
    angle = segEnd + segmentGap;
    return {
      ...d,
      segStart,
      segEnd,
      color: d.color ?? seriesPalette[i % seriesPalette.length],
    };
  });

  // Center label positioning (inner circle bounding box)
  const labelSize = innerR * 2 * 0.7;
  const labelOffset = (VB - labelSize) / 2;

  const activeSeg = activeIndex !== null ? segments[activeIndex] : undefined;
  let tooltipPos: { x: number; y: number } | undefined;
  let tooltipContent: ReactNode = null;
  if (activeSeg) {
    const midAngle = (activeSeg.segStart + activeSeg.segEnd) / 2;
    tooltipPos = polarToCartesian(CX, CY, OUTER_R + 8, midAngle);
    const pct = ((activeSeg.value / total) * 100).toFixed(1);
    tooltipContent = (
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: activeSeg.color, flexShrink: 0 }} />
        <span><span style={{ fontWeight: 600 }}>{activeSeg.label}</span> {activeSeg.value} ({pct}%)</span>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: size, height: size, ...style }}>
      <svg
        viewBox={`0 0 ${VB} ${VB}`}
        width="100%"
        height="100%"
        role="img"
        aria-label={ariaLabel}
        style={{ display: 'block' }}
      >
        {segments.map((seg, i) => {
          const isActive = activeIndex === i;
          const dimmed = activeIndex !== null && !isActive;
          // Nudge the active segment outward along its midpoint angle
          const midAngle = (seg.segStart + seg.segEnd) / 2;
          const rad = ((midAngle - 90) * Math.PI) / 180;
          const nudge = isActive ? 3 : 0;
          const tx = Math.cos(rad) * nudge;
          const ty = Math.sin(rad) * nudge;

          return (
            <path
              key={i}
              d={arcPath(CX, CY, OUTER_R, innerR, seg.segStart, seg.segEnd)}
              fill={seg.color}
              transform={`translate(${tx}, ${ty})`}
              opacity={dimmed ? 0.4 : 1}
              style={{ transition: 'transform 150ms, opacity 150ms', cursor: 'pointer' }}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(null)}
            />
          );
        })}

        {centerLabel != null && (
          <foreignObject x={labelOffset} y={labelOffset} width={labelSize} height={labelSize}>
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                fontFamily: 'var(--lucent-font-family-base)',
                color: 'var(--lucent-text-primary)',
              }}
            >
              {centerLabel}
            </div>
          </foreignObject>
        )}
      </svg>
      {tooltipPos && (
        <span style={{
          position: 'absolute',
          left: `${tooltipPos.x}%`,
          top: `${tooltipPos.y}%`,
          pointerEvents: 'none',
        }}>
          <Tooltip content={tooltipContent} open placement="top">
            <span />
          </Tooltip>
        </span>
      )}
    </div>
  );
}

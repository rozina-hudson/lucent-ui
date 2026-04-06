import { useState, type CSSProperties } from 'react';
import { resolveColor, type ChartColorVariant } from '../_shared/index.js';
import { scaleLinear, buildSmoothLinePath, buildSmoothAreaPath, buildLinePath, buildAreaPath } from '../_shared/index.js';
import { Tooltip } from '../../atoms/Tooltip/index.js';

export interface SparkLineProps {
  /** Array of numeric values representing the trend. */
  data: number[];
  /** Pixel width. Defaults to '100%'. */
  width?: number | string;
  /** Pixel height. Defaults to 32. */
  height?: number;
  /** Color of the line. Accepts a variant name or any CSS color string. */
  color?: ChartColorVariant | string;
  /** Show a translucent area fill below the line. */
  filled?: boolean;
  /** Line stroke width in SVG units. */
  strokeWidth?: number;
  /** Use smooth curves (monotone-x). Defaults to true. */
  smooth?: boolean;
  /** Custom tooltip formatter. */
  formatTooltip?: (value: number, index: number) => string;
  /** Accessible label for the chart SVG. */
  ariaLabel?: string;
  style?: CSSProperties;
}

const INTERNAL_HEIGHT = 100;
const PADDING_Y = 8;

export function SparkLine({
  data,
  width = '100%',
  height = 32,
  color,
  filled = false,
  strokeWidth = 1.5,
  smooth = true,
  formatTooltip,
  ariaLabel = 'Sparkline chart',
  style,
}: SparkLineProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (data.length < 2) return null;

  const resolvedColor = resolveColor(color);
  const viewBoxWidth = data.length - 1;
  const yMin = Math.min(...data);
  const yMax = Math.max(...data);
  const yScale = scaleLinear([yMin, yMax], [INTERNAL_HEIGHT - PADDING_Y, PADDING_Y]);

  const points = data.map((v, i) => ({ x: i, y: yScale(v) }));
  const linePath = smooth ? buildSmoothLinePath(points) : buildLinePath(points);
  const areaPath = filled
    ? (smooth ? buildSmoothAreaPath(points, INTERNAL_HEIGHT) : buildAreaPath(points, INTERNAL_HEIGHT))
    : null;

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const idx = Math.round((relX / rect.width) * (data.length - 1));
    setActiveIndex(Math.max(0, Math.min(idx, data.length - 1)));
  };

  const activePt = activeIndex !== null ? points[activeIndex] : undefined;
  const activeVal = activeIndex !== null ? data[activeIndex] : undefined;

  const isEdge = activeIndex === 0 || activeIndex === data.length - 1;

  return (
    <div style={{ position: 'relative', width, height, ...style }}>
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${INTERNAL_HEIGHT}`}
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        role="img"
        aria-label={ariaLabel}
        style={{ display: 'block', overflow: 'visible' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setActiveIndex(null)}
      >
        {areaPath && (
          <path
            d={areaPath}
            fill={`color-mix(in srgb, ${resolvedColor} 15%, transparent)`}
            stroke="none"
          />
        )}
        <path
          d={linePath}
          fill="none"
          stroke={resolvedColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {/* Crosshair line — DOM element so it can transition smoothly */}
      {activePt && (
        <span style={{
          position: 'absolute',
          left: `${(activePt.x / viewBoxWidth) * 100}%`,
          top: 0,
          width: 1,
          height: '100%',
          background: 'var(--lucent-text-secondary)',
          opacity: 0.3,
          transform: 'translateX(-50%)',
          transition: 'left 150ms ease-out',
          pointerEvents: 'none',
        }} />
      )}
      {/* Dot */}
      {activePt && (
        <span style={{
          position: 'absolute',
          left: `${(activePt.x / viewBoxWidth) * 100}%`,
          top: `${(activePt.y / INTERNAL_HEIGHT) * 100}%`,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: resolvedColor,
          border: '1.5px solid var(--lucent-surface, #fff)',
          transform: 'translate(-50%, -50%)',
          transition: 'left 150ms ease-out, top 150ms ease-out',
          pointerEvents: 'none',
        }} />
      )}
      {/* Tooltip — hidden at first/last points to avoid clipping */}
      {activePt && activeVal !== undefined && !isEdge && (
        <span style={{
          position: 'absolute',
          left: `${(activePt.x / viewBoxWidth) * 100}%`,
          top: `${(activePt.y / INTERNAL_HEIGHT) * 100}%`,
          transition: 'left 150ms ease-out, top 150ms ease-out',
          pointerEvents: 'none',
        }}>
          <span style={{ position: 'absolute', bottom: -2 }}>
            <Tooltip
              content={formatTooltip ? formatTooltip(activeVal, activeIndex!) : activeVal}
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

/** Returns a linear mapping function from domain → range. */
export function scaleLinear(
  domain: [number, number],
  range: [number, number],
): (value: number) => number {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  const span = d1 - d0;
  if (span === 0) return () => (r0 + r1) / 2;
  return (value: number) => r0 + ((value - d0) / span) * (r1 - r0);
}

/** Generate human-friendly tick values. */
export function niceTickValues(min: number, max: number, count: number): number[] {
  if (min === max) return [min];
  const rawStep = (max - min) / Math.max(count - 1, 1);
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const residual = rawStep / magnitude;
  const niceStep =
    residual <= 1.5 ? magnitude
    : residual <= 3 ? 2 * magnitude
    : residual <= 7 ? 5 * magnitude
    : 10 * magnitude;

  const niceMin = Math.floor(min / niceStep) * niceStep;
  const niceMax = Math.ceil(max / niceStep) * niceStep;
  const ticks: number[] = [];
  for (let v = niceMin; v <= niceMax + niceStep * 0.01; v += niceStep) {
    ticks.push(Math.round(v * 1e10) / 1e10);
  }
  return ticks;
}

/** Build a polyline SVG path. */
export function buildLinePath(points: Array<{ x: number; y: number }>): string {
  if (points.length === 0) return '';
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
}

/** Build a closed area SVG path (line path closed to baseline). */
export function buildAreaPath(points: Array<{ x: number; y: number }>, baselineY: number): string {
  if (points.length === 0) return '';
  const line = buildLinePath(points);
  const last = points[points.length - 1]!;
  const first = points[0]!;
  return `${line} L${last.x},${baselineY} L${first.x},${baselineY} Z`;
}

/** Build a smooth monotone-x cubic bezier path (Fritsch–Carlson). */
export function buildSmoothLinePath(points: Array<{ x: number; y: number }>): string {
  const n = points.length;
  if (n === 0) return '';
  if (n === 1) return `M${points[0]!.x},${points[0]!.y}`;
  if (n === 2) return buildLinePath(points);

  // Compute slopes
  const slopes: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    const dx = points[i + 1]!.x - points[i]!.x;
    slopes.push(dx === 0 ? 0 : (points[i + 1]!.y - points[i]!.y) / dx);
  }

  // Tangents via Fritsch–Carlson
  const tangents: number[] = new Array<number>(n).fill(0);
  tangents[0] = slopes[0]!;
  tangents[n - 1] = slopes[n - 2]!;
  for (let i = 1; i < n - 1; i++) {
    if (slopes[i - 1]! * slopes[i]! <= 0) {
      tangents[i] = 0;
    } else {
      tangents[i] = (slopes[i - 1]! + slopes[i]!) / 2;
    }
  }

  // Clamp tangents for monotonicity
  for (let i = 0; i < n - 1; i++) {
    if (slopes[i] === 0) {
      tangents[i] = 0;
      tangents[i + 1] = 0;
    } else {
      const alpha = tangents[i]! / slopes[i]!;
      const beta = tangents[i + 1]! / slopes[i]!;
      const s = alpha * alpha + beta * beta;
      if (s > 9) {
        const t = 3 / Math.sqrt(s);
        tangents[i] = t * alpha * slopes[i]!;
        tangents[i + 1] = t * beta * slopes[i]!;
      }
    }
  }

  let d = `M${points[0]!.x},${points[0]!.y}`;
  for (let i = 0; i < n - 1; i++) {
    const dx = (points[i + 1]!.x - points[i]!.x) / 3;
    const cp1x = points[i]!.x + dx;
    const cp1y = points[i]!.y + dx * tangents[i]!;
    const cp2x = points[i + 1]!.x - dx;
    const cp2y = points[i + 1]!.y - dx * tangents[i + 1]!;
    d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${points[i + 1]!.x},${points[i + 1]!.y}`;
  }
  return d;
}

/** Build a smooth closed area path. */
export function buildSmoothAreaPath(points: Array<{ x: number; y: number }>, baselineY: number): string {
  if (points.length === 0) return '';
  const line = buildSmoothLinePath(points);
  const last = points[points.length - 1]!;
  const first = points[0]!;
  return `${line} L${last.x},${baselineY} L${first.x},${baselineY} Z`;
}

/** Convert viewBox coordinates to pixel coordinates relative to the SVG element (xMidYMid meet). */
export function vbToPixel(
  svg: SVGSVGElement,
  vx: number, vy: number,
  vbW: number, vbH: number,
): { x: number; y: number } {
  const { width: w, height: h } = svg.getBoundingClientRect();
  const sx = w / vbW;
  const sy = h / vbH;
  const s = Math.min(sx, sy);
  return {
    x: (w - vbW * s) / 2 + vx * s,
    y: (h - vbH * s) / 2 + vy * s,
  };
}

/** Convert polar coordinates to Cartesian. */
export function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number): { x: number; y: number } {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/** Build an SVG arc path segment. */
export function arcPath(
  cx: number, cy: number,
  outerR: number, innerR: number,
  startAngle: number, endAngle: number,
): string {
  const outerStart = polarToCartesian(cx, cy, outerR, startAngle);
  const outerEnd = polarToCartesian(cx, cy, outerR, endAngle);
  const innerStart = polarToCartesian(cx, cy, innerR, startAngle);
  const innerEnd = polarToCartesian(cx, cy, innerR, endAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return [
    `M${outerStart.x},${outerStart.y}`,
    `A${outerR},${outerR} 0 ${largeArc} 1 ${outerEnd.x},${outerEnd.y}`,
    `L${innerEnd.x},${innerEnd.y}`,
    `A${innerR},${innerR} 0 ${largeArc} 0 ${innerStart.x},${innerStart.y}`,
    'Z',
  ].join(' ');
}

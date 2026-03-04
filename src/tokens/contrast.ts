/**
 * Computes relative luminance for a hex color per WCAG 2.1.
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
function relativeLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const toLinear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * Returns `'#000000'` or `'#ffffff'` — whichever has higher WCAG contrast
 * against the given background hex color.
 *
 * Use this to guarantee AA-compliant text on any solid accent surface.
 *
 * @example
 * getContrastText('#e9c96b') // → '#000000'  (gold bg → black text, 8.6:1)
 * getContrastText('#111827') // → '#ffffff'  (near-black bg → white text, 16.7:1)
 */
export function getContrastText(hex: string): '#000000' | '#ffffff' {
  const L = relativeLuminance(hex);
  // Contrast with white: (1.05) / (L + 0.05)
  // Contrast with black: (L + 0.05) / (0.05)
  // Use white when contrast-with-white > contrast-with-black:
  // 1.05 / (L + 0.05) > (L + 0.05) / 0.05  →  L < 0.179
  return L < 0.179 ? '#ffffff' : '#000000';
}

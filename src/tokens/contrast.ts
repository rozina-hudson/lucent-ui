/**
 * Contrast utilities for lucent-ui.
 *
 * Primary: APCA (Accessible Perceptual Contrast Algorithm) for text-on-accent
 * decisions. Handles saturated blues/purples correctly where WCAG 2.1 fails.
 *
 * Secondary: WCAG 2.1 contrast ratio for compliance reporting.
 */

/* ------------------------------------------------------------------ */
/*  WCAG 2.1 (kept for compliance / diagnostics)                      */
/* ------------------------------------------------------------------ */

function relativeLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const toLinear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/** WCAG 2.1 contrast ratio (1–21) between two hex colors. */
export function getContrastRatio(hex1: string, hex2: string): number {
  const L1 = relativeLuminance(hex1);
  const L2 = relativeLuminance(hex2);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

/* ------------------------------------------------------------------ */
/*  APCA — Accessible Perceptual Contrast Algorithm                   */
/*  Based on APCA-W3 0.0.98G-4g (SAPC/APCA by Andrew Somers)         */
/*  https://github.com/Myndex/SAPC-APCA                              */
/* ------------------------------------------------------------------ */

// sRGB coefficients tuned for perceptual lightness (not luminance)
const sRco = 0.2126729;
const sGco = 0.7151522;
const sBco = 0.0721750;

// Exponents for perceptual lightness curve
const normBG = 0.56;
const normTXT = 0.57;
const revBG = 0.65;
const revTXT = 0.62;

// Clamp & scale
const blkThrs = 0.022;
const blkClmp = 1.414;
const scaleBoW = 1.14;
const scaleWoB = 1.14;
const loBoWoffset = 0.027;
const loWoBoffset = 0.027;

function sRGBtoY(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  // Peceptual linearization (piecewise sRGB decode)
  const rL = Math.pow(r, 2.4);
  const gL = Math.pow(g, 2.4);
  const bL = Math.pow(b, 2.4);
  let y = sRco * rL + sGco * gL + sBco * bL;
  // Soft clamp for near-black
  if (y < 0) y = 0;
  return y < blkThrs ? y + Math.pow(blkThrs - y, blkClmp) : y;
}

/**
 * APCA lightness contrast (Lc).
 * Returns a value roughly in the range -108 to +106.
 * Positive = dark text on light bg (BoW polarity).
 * Negative = light text on dark bg (WoB polarity).
 *
 * |Lc| >= 60 is considered fluent readability for body text (16px).
 * |Lc| >= 45 is minimum for large/bold text.
 */
export function apcaContrast(bgHex: string, fgHex: string): number {
  const Ybg = sRGBtoY(bgHex);
  const Ytxt = sRGBtoY(fgHex);

  let outputContrast: number;

  // BoW polarity (dark text on light bg)
  if (Ybg > Ytxt) {
    const SAPC = (Math.pow(Ybg, normBG) - Math.pow(Ytxt, normTXT)) * scaleBoW;
    outputContrast = SAPC < loBoWoffset ? 0.0 : SAPC - loBoWoffset;
  } else {
    // WoB polarity (light text on dark bg)
    const SAPC = (Math.pow(Ybg, revBG) - Math.pow(Ytxt, revTXT)) * scaleWoB;
    outputContrast = SAPC > -loWoBoffset ? 0.0 : SAPC + loWoBoffset;
  }

  return outputContrast * 100;
}

/**
 * Returns `'#000000'` or `'#ffffff'` — whichever is more readable on the
 * given background, using APCA perceptual contrast.
 *
 * APCA correctly handles saturated blues/purples where WCAG 2.1 fails.
 *
 * @example
 * getContrastText('#0ea5e9') // → '#ffffff'  (sky blue → white, APCA says white is more readable)
 * getContrastText('#e9c96b') // → '#000000'  (gold → black)
 * getContrastText('#111827') // → '#ffffff'  (near-black → white)
 */
export function getContrastText(hex: string): '#000000' | '#ffffff' {
  const lcWhite = Math.abs(apcaContrast(hex, '#ffffff'));
  const lcBlack = Math.abs(apcaContrast(hex, '#000000'));
  return lcWhite >= lcBlack ? '#ffffff' : '#000000';
}

/**
 * Nudges `bgHex` darker or lighter (preserving hue/saturation) until the
 * APCA contrast between bg and fg meets `targetLc` (default 60 for body text).
 *
 * Returns the adjusted hex, or the original if already meeting the target.
 */
export function ensureContrast(bgHex: string, fgHex: string, targetLc = 60): string {
  if (Math.abs(apcaContrast(bgHex, fgHex)) >= targetLc) return bgHex;

  // Parse to HSL to adjust lightness
  const r = parseInt(bgHex.slice(1, 3), 16) / 255;
  const g = parseInt(bgHex.slice(3, 5), 16) / 255;
  const b = parseInt(bgHex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  let l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }

  // If fg is white, darken bg; if fg is black, lighten bg
  const fgIsLight = relativeLuminance(fgHex) > 0.5;
  const step = fgIsLight ? -0.005 : 0.005;

  for (let i = 0; i < 100; i++) {
    l = Math.min(1, Math.max(0, l + step));
    const adjusted = hslToHex(h, s, l);
    if (Math.abs(apcaContrast(adjusted, fgHex)) >= targetLc) return adjusted;
  }

  return bgHex;
}

function hslToHex(h: number, s: number, l: number): string {
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  let rv: number, gv: number, bv: number;
  if (s === 0) {
    rv = gv = bv = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    rv = hue2rgb(p, q, h + 1 / 3);
    gv = hue2rgb(p, q, h);
    bv = hue2rgb(p, q, h - 1 / 3);
  }

  const toHex = (c: number) => Math.round(c * 255).toString(16).padStart(2, '0');
  return `#${toHex(rv)}${toHex(gv)}${toHex(bv)}`;
}

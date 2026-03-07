// simple color helpers used by LucentProvider to generate derived tokens

// convert hex #rrggbb to {r,g,b}
function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

// convert {r,g,b} to hex
function rgbToHex({ r, g, b }: { r: number; g: number; b: number }): string {
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// convert hex to HSL (h in degrees, s/l between 0‑1)
export function hexToHsl(hex: string): [number, number, number] {
  const { r, g, b } = hexToRgb(hex);
  const rr = r / 255;
  const gg = g / 255;
  const bb = b / 255;
  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rr:
        h = (gg - bb) / d + (gg < bb ? 6 : 0);
        break;
      case gg:
        h = (bb - rr) / d + 2;
        break;
      case bb:
        h = (rr - gg) / d + 4;
        break;
    }
    h /= 6;
  }
  return [h * 360, s, l];
}

// convert HSL back to hex
export function hslToHex(h: number, s: number, l: number): string {
  h = (h % 360 + 360) % 360; // ensure positive
  s = Math.min(1, Math.max(0, s));
  l = Math.min(1, Math.max(0, l));

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;
  if (h < 60) {
    r = c;
    g = x;
  } else if (h < 120) {
    r = x;
    g = c;
  } else if (h < 180) {
    g = c;
    b = x;
  } else if (h < 240) {
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }
  return rgbToHex({ r: Math.round((r + m) * 255), g: Math.round((g + m) * 255), b: Math.round((b + m) * 255) });
}

// shift lightness by a delta (-1 to 1). positive -> lighter, negative -> darker.
export function adjustLightness(hex: string, delta: number): string {
  const [h, s, l] = hexToHsl(hex);
  return hslToHex(h, s, Math.min(1, Math.max(0, l + delta)));
}

// mix two hex colors; weight is fraction of first color (0..1)
export function mix(hex1: string, hex2: string, weight: number): string {
  const c1 = hexToRgb(hex1);
  const c2 = hexToRgb(hex2);
  const r = Math.round(c1.r * weight + c2.r * (1 - weight));
  const g = Math.round(c1.g * weight + c2.g * (1 - weight));
  const b = Math.round(c1.b * weight + c2.b * (1 - weight));
  return rgbToHex({ r, g, b });
}

// calculate relative luminance of a color (0-1, where 0 is black, 1 is white)
function getLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const linearize = (c: number) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const rr = linearize(r);
  const gg = linearize(g);
  const bb = linearize(b);
  return 0.2126 * rr + 0.7152 * gg + 0.0722 * bb;
}

// given a border color picked in one theme, generate the corresponding color for the other theme
// preserves hue/saturation but inverts lightness with a lightness boost for dark theme readability
export function getThemeComplementBorderColor(baseColor: string): string {
  const [h, s, l] = hexToHsl(baseColor);
  // invert lightness and boost it slightly to ensure dark theme borders aren't too dark
  const invertedL = Math.min(1, (1 - l) + 0.15);
  return hslToHex(h, s, invertedL);
}

// derive subtle and strong border variants from a default color
export function deriveBorderVariants(baseColor: string): {
  subtle: string;
  strong: string;
} {
  const [h, s, l] = hexToHsl(baseColor);
  return {
    subtle: hslToHex(h, s, Math.max(0, l - 0.15)), // slightly darker
    strong: hslToHex(h, s, Math.min(1, l + 0.15)), // slightly lighter
  };
}

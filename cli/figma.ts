// ─── Figma Variables API types ────────────────────────────────────────────────

export interface FigmaColor {
  r: number; // 0–1
  g: number;
  b: number;
  a: number;
}

export interface FigmaVariableAlias {
  type: 'VARIABLE_ALIAS';
  id: string;
}

export type FigmaVariableValue =
  | FigmaColor
  | number
  | string
  | boolean
  | FigmaVariableAlias;

export interface FigmaVariable {
  id: string;
  name: string;
  resolvedType: 'COLOR' | 'FLOAT' | 'STRING' | 'BOOLEAN';
  valuesByMode: Record<string, FigmaVariableValue>;
  variableCollectionId: string;
}

export interface FigmaVariableCollection {
  id: string;
  name: string;
  modes: Array<{ modeId: string; name: string }>;
  defaultModeId: string;
}

export interface FigmaVariablesResponse {
  status: number;
  error: boolean;
  meta: {
    variables: Record<string, FigmaVariable>;
    variableCollections: Record<string, FigmaVariableCollection>;
  };
}

// ─── API client ───────────────────────────────────────────────────────────────

export async function fetchFigmaVariables(
  figmaToken: string,
  fileKey: string,
): Promise<FigmaVariablesResponse> {
  const url = `https://api.figma.com/v1/files/${fileKey}/variables/local`;

  const res = await fetch(url, {
    headers: {
      'X-Figma-Token': figmaToken,
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(
      `Figma API error ${res.status}: ${res.statusText}${body ? `\n${body}` : ''}`,
    );
  }

  return res.json() as Promise<FigmaVariablesResponse>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Convert Figma RGBA (0–1 channels) to a CSS hex string. */
export function figmaColorToHex(color: FigmaColor): string {
  const toHex = (n: number) =>
    Math.round(Math.min(1, Math.max(0, n)) * 255)
      .toString(16)
      .padStart(2, '0');

  const rgb = `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;

  // Include alpha channel only when not fully opaque
  if (color.a < 0.9999) {
    return `${rgb}${toHex(color.a)}`;
  }
  return rgb;
}

/** True if value is a FigmaColor object (has r/g/b/a number fields). */
export function isFigmaColor(v: FigmaVariableValue): v is FigmaColor {
  return (
    typeof v === 'object' &&
    v !== null &&
    'r' in v &&
    typeof (v as FigmaColor).r === 'number'
  );
}

/** True if value is a VARIABLE_ALIAS reference. */
export function isAlias(v: FigmaVariableValue): v is FigmaVariableAlias {
  return (
    typeof v === 'object' &&
    v !== null &&
    (v as FigmaVariableAlias).type === 'VARIABLE_ALIAS'
  );
}

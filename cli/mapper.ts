import type { LucentTokens } from '../src/tokens/types.js';
import {
  type FigmaVariablesResponse,
  type FigmaVariable,
  type FigmaVariableValue,
  figmaColorToHex,
  isFigmaColor,
  isAlias,
} from './figma.js';

// ─── Token key registry ───────────────────────────────────────────────────────

/**
 * Every valid key in LucentTokens — used to validate candidate names produced
 * by the name normaliser before writing them into the output manifest.
 */
const LUCENT_TOKEN_KEYS = new Set<keyof LucentTokens>([
  // SemanticColorTokens
  'bgBase', 'bgSubtle', 'bgMuted', 'bgOverlay',
  'surfaceDefault', 'surfaceRaised', 'surfaceOverlay',
  'borderDefault', 'borderSubtle', 'borderStrong',
  'textPrimary', 'textSecondary', 'textDisabled', 'textInverse', 'textOnAccent',
  'accentDefault', 'accentHover', 'accentActive', 'accentSubtle',
  'successDefault', 'successSubtle', 'successText',
  'warningDefault', 'warningSubtle', 'warningText',
  'dangerDefault', 'dangerHover', 'dangerSubtle', 'dangerText',
  'infoDefault', 'infoSubtle', 'infoText',
  'focusRing',
  // TypographyTokens
  'fontFamilyBase', 'fontFamilyMono', 'fontFamilyDisplay',
  'fontSizeXs', 'fontSizeSm', 'fontSizeMd', 'fontSizeLg',
  'fontSizeXl', 'fontSize2xl', 'fontSize3xl',
  'fontWeightRegular', 'fontWeightMedium', 'fontWeightSemibold', 'fontWeightBold',
  'lineHeightTight', 'lineHeightBase', 'lineHeightRelaxed',
  'letterSpacingTight', 'letterSpacingBase', 'letterSpacingWide',
  // SpacingTokens
  'space0', 'space1', 'space2', 'space3', 'space4', 'space5',
  'space6', 'space8', 'space10', 'space12', 'space16', 'space20', 'space24',
  // RadiusTokens
  'radiusNone', 'radiusSm', 'radiusMd', 'radiusLg', 'radiusXl', 'radiusFull',
  // ShadowTokens
  'shadowNone', 'shadowSm', 'shadowMd', 'shadowLg', 'shadowXl',
  // MotionTokens
  'durationFast', 'durationBase', 'durationSlow',
  'easingDefault', 'easingEmphasized', 'easingDecelerate',
]);

// ─── Name normalisation ───────────────────────────────────────────────────────

/**
 * Top-level Figma collection category prefixes that carry no semantic meaning
 * in the Lucent token schema and should be dropped before camelCasing.
 */
const CATEGORY_PREFIXES = new Set([
  'color', 'colour', 'typography', 'type', 'spacing', 'space',
  'radius', 'shadow', 'motion', 'animation',
]);

/**
 * Convert a Figma variable name (slash-separated path, may include hyphens)
 * into a camelCase candidate token key.
 *
 * Examples:
 *   "color/bg/base"            → "bgBase"
 *   "color/text/primary"       → "textPrimary"
 *   "typography/font-size/xl"  → "fontSizeXl"
 *   "spacing/space-4"          → "space4"
 *   "radius/radius-md"         → "radiusMd"
 *   "accentDefault"            → "accentDefault"   (no change needed)
 */
export function normalizeName(figmaName: string): string {
  // Split path segments on /
  const segments = figmaName.split('/').map(s => s.trim()).filter(Boolean);

  // Drop a leading category prefix if present
  if (segments.length > 1 && CATEGORY_PREFIXES.has(segments[0].toLowerCase())) {
    segments.shift();
  }

  // Further split each segment on hyphens
  const parts = segments.flatMap(s => s.split('-').filter(Boolean));

  if (parts.length === 0) return figmaName;

  // camelCase: lowercase first part, title-case the rest
  return parts
    .map((p, i) => i === 0 ? p.toLowerCase() : p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join('');
}

// ─── Alias resolution ─────────────────────────────────────────────────────────

/**
 * Resolve a variable value for a given mode, following VARIABLE_ALIAS chains.
 * Returns `undefined` if the chain cannot be resolved (dangling alias, missing
 * mode, non-string/non-color resolved type).
 */
function resolveValue(
  variable: FigmaVariable,
  modeId: string,
  allVariables: Record<string, FigmaVariable>,
  visited = new Set<string>(),
): FigmaVariableValue | undefined {
  if (visited.has(variable.id)) return undefined; // circular alias guard
  visited.add(variable.id);

  const value = variable.valuesByMode[modeId];
  if (value === undefined) return undefined;

  if (isAlias(value)) {
    const target = allVariables[value.id];
    if (!target) return undefined;
    // Aliases preserve their own modeId in the target collection — use the
    // same modeId; if absent the target may use its defaultModeId but we
    // can't determine that here without the collections map, so fall back to
    // returning undefined rather than guessing.
    return resolveValue(target, modeId, allVariables, visited);
  }

  return value;
}

// ─── Value → CSS string ───────────────────────────────────────────────────────

function toCssValue(value: FigmaVariableValue, resolvedType: FigmaVariable['resolvedType']): string | undefined {
  if (resolvedType === 'COLOR' && isFigmaColor(value)) {
    return figmaColorToHex(value);
  }
  if (resolvedType === 'FLOAT' && typeof value === 'number') {
    // Figma stores spacing/radius in px without units; emit as "Npx"
    return `${value}px`;
  }
  if (resolvedType === 'STRING' && typeof value === 'string') {
    return value;
  }
  return undefined;
}

// ─── Main mapper ──────────────────────────────────────────────────────────────

export interface MapResult {
  /** Token overrides that matched known Lucent token keys */
  tokens: Partial<LucentTokens>;
  /** Variables that were processed but didn't map to a known token key */
  unmapped: Array<{ figmaName: string; candidateKey: string; value: string }>;
}

/**
 * Map a Figma Variables API response for a single named mode (e.g. "light" or
 * "dark") into a `Partial<LucentTokens>` token override object.
 *
 * @param response  Full response from `fetchFigmaVariables`
 * @param modeName  Case-insensitive mode name to extract (e.g. "Light", "dark")
 */
export function mapFigmaToTokens(
  response: FigmaVariablesResponse,
  modeName: string,
): MapResult {
  const { variables, variableCollections } = response.meta;

  // Find the modeId matching the requested name across all collections
  const targetModeName = modeName.toLowerCase();
  const modeIdByCollection = new Map<string, string>();

  for (const collection of Object.values(variableCollections)) {
    const match = collection.modes.find(m => m.name.toLowerCase() === targetModeName);
    if (match) {
      modeIdByCollection.set(collection.id, match.modeId);
    }
  }

  if (modeIdByCollection.size === 0) {
    const available = Object.values(variableCollections)
      .flatMap(c => c.modes.map(m => m.name))
      .filter((v, i, a) => a.indexOf(v) === i)
      .join(', ');
    throw new Error(
      `No mode named "${modeName}" found in Figma file.\nAvailable modes: ${available || '(none)'}`,
    );
  }

  const tokens: Partial<LucentTokens> = {};
  const unmapped: MapResult['unmapped'] = [];

  for (const variable of Object.values(variables)) {
    // Skip booleans — no LucentTokens field uses boolean values
    if (variable.resolvedType === 'BOOLEAN') continue;

    const modeId = modeIdByCollection.get(variable.variableCollectionId);
    if (modeId === undefined) continue;

    const raw = resolveValue(variable, modeId, variables);
    if (raw === undefined) continue;

    const cssValue = toCssValue(raw, variable.resolvedType);
    if (cssValue === undefined) continue;

    const candidate = normalizeName(variable.name);

    if (LUCENT_TOKEN_KEYS.has(candidate as keyof LucentTokens)) {
      (tokens as Record<string, string>)[candidate] = cssValue;
    } else {
      unmapped.push({ figmaName: variable.name, candidateKey: candidate, value: cssValue });
    }
  }

  return { tokens, unmapped };
}

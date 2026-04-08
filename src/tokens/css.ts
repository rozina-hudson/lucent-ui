import type { LucentTokens } from './types.js';

// Converts a camelCase token key to a CSS custom property name.
// e.g. "bgBase" → "--lucent-bg-base", "space3" → "--lucent-space-3"
export function tokenToCssVar(key: string): string {
  return (
    '--lucent-' +
    key
      .replace(/([A-Z])/g, (match) => `-${match.toLowerCase()}`)
      .replace(/([a-z])(\d)/g, (_, a, b) => `${a}-${b}`)
  );
}

/**
 * Strips characters that could break out of a CSS property value context.
 * Prevents injection of extra declarations, rules, or selectors via token values.
 */
function sanitizeCssValue(value: string): string {
  return value.replace(/[{}<>;@\\]/g, '');
}

/**
 * Generates a CSS string of custom properties from a token set.
 * Inject the result into a <style> tag or a CSS-in-JS solution.
 *
 * Token values are sanitized to prevent CSS injection — characters that
 * could break out of a property value context (`{};<>@\`) are stripped.
 *
 * @example
 * const css = makeLibraryCSS(lightTokens);
 * document.getElementById('lucent-tokens').textContent = css;
 */
export function makeLibraryCSS(
  tokens: LucentTokens,
  selector = ':root',
): string {
  const vars = Object.entries(tokens)
    .map(([key, value]) => `  ${tokenToCssVar(key)}: ${sanitizeCssValue(value)};`)
    .join('\n');

  return `${selector} {\n${vars}\n}`;
}

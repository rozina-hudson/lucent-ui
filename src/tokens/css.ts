import type { LucentTokens } from './types.js';

// Converts a camelCase token key to a CSS custom property name.
// e.g. "bgBase" → "--lucent-bg-base", "space3" → "--lucent-space-3"
function tokenToCssVar(key: string): string {
  return (
    '--lucent-' +
    key
      .replace(/([A-Z])/g, (match) => `-${match.toLowerCase()}`)
      .replace(/([a-z])(\d)/g, (_, a, b) => `${a}-${b}`)
  );
}

/**
 * Generates a CSS string of custom properties from a token set.
 * Inject the result into a <style> tag or a CSS-in-JS solution.
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
    .map(([key, value]) => `  ${tokenToCssVar(key)}: ${value};`)
    .join('\n');

  return `${selector} {\n${vars}\n}`;
}

import type { LucentTokens } from '../tokens/types.js';

export function serializeOverrides(overrides: Partial<LucentTokens>): string {
  const entries = Object.entries(overrides);
  if (entries.length === 0) return '{}';

  const lines = entries
    .map(([key, value]) => `  ${key}: '${value}'`)
    .join(',\n');

  return `{\n${lines}\n}`;
}

export function serializeAsProvider(overrides: Partial<LucentTokens>): string {
  if (Object.keys(overrides).length === 0) {
    return '<LucentProvider>\n  {children}\n</LucentProvider>';
  }

  const lines = Object.entries(overrides)
    .map(([key, value]) => `    ${key}: '${value}'`)
    .join(',\n');

  return `<LucentProvider tokens={{\n${lines}\n}}>
  {children}
</LucentProvider>`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

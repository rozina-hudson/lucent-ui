import { describe, test, expect } from 'vitest';
import { validateManifest } from './validate.js';

// Auto-discover all component manifests
const manifestModules = import.meta.glob('../components/**/*.manifest.ts', { eager: true });

const manifests = Object.entries(manifestModules).map(([path, mod]) => {
  const m = mod as Record<string, unknown>;
  const manifest = m['COMPONENT_MANIFEST'];
  return { path, manifest };
});

describe('Component manifests', () => {
  test('at least one manifest was discovered', () => {
    expect(manifests.length).toBeGreaterThan(0);
  });

  for (const { path, manifest } of manifests) {
    const label = path.replace('../components/', '').replace('.manifest.ts', '');

    test(`${label} — exports COMPONENT_MANIFEST`, () => {
      expect(manifest).toBeDefined();
    });

    test(`${label} — passes schema validation`, () => {
      const result = validateManifest(manifest);
      if (!result.valid) {
        const messages = result.errors.map(e => `  ${e.field}: ${e.message}`).join('\n');
        throw new Error(`Invalid manifest:\n${messages}`);
      }
      expect(result.valid).toBe(true);
    });
  }
});

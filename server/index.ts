#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { ALL_MANIFESTS } from './registry.js';
import type { ComponentManifest } from '../src/manifest/types.js';
import { PALETTES, SHAPES, DENSITIES, SHADOWS, COMBINED, generatePresetConfig } from './presets.js';

// ─── Auth stub ───────────────────────────────────────────────────────────────
// LUCENT_API_KEY is reserved for the future paid tier.
// When set, the server acknowledges it but does not yet enforce it.
const apiKey = process.env['LUCENT_API_KEY'];
if (apiKey) {
  process.stderr.write('[lucent-mcp] Auth mode active (LUCENT_API_KEY is set).\n');
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function findManifest(nameOrId: string): ComponentManifest | undefined {
  const q = nameOrId.trim().toLowerCase();
  return ALL_MANIFESTS.find(
    (m) => m.id.toLowerCase() === q || m.name.toLowerCase() === q,
  );
}

function scoreManifest(m: ComponentManifest, query: string): number {
  const q = query.toLowerCase();
  let score = 0;
  if (m.name.toLowerCase().includes(q)) score += 10;
  if (m.id.toLowerCase().includes(q)) score += 8;
  if (m.tier.toLowerCase().includes(q)) score += 5;
  if (m.description.toLowerCase().includes(q)) score += 4;
  if (m.designIntent.toLowerCase().includes(q)) score += 3;
  for (const p of m.props) {
    if (p.name.toLowerCase().includes(q)) score += 2;
    if (p.description.toLowerCase().includes(q)) score += 1;
  }
  return score;
}

// ─── MCP Server ───────────────────────────────────────────────────────────────

const server = new McpServer({
  name: 'lucent-mcp',
  version: '0.1.0',
});

// Tool: list_components
server.tool(
  'list_components',
  'Lists all available Lucent UI components with their name, tier (atom/molecule), and one-line description.',
  {},
  async () => {
    const components = ALL_MANIFESTS.map((m) => ({
      id: m.id,
      name: m.name,
      tier: m.tier,
      description: m.description,
    }));
    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({ components }, null, 2),
        },
      ],
    };
  },
);

// Tool: get_component_manifest
server.tool(
  'get_component_manifest',
  'Returns the full manifest JSON for a Lucent UI component, including props, usage examples, design intent, and accessibility notes.',
  { componentName: z.string().describe('Component name or id, e.g. "Button" or "form-field"') },
  async ({ componentName }) => {
    const manifest = findManifest(componentName);
    if (!manifest) {
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              error: `Component "${componentName}" not found.`,
              available: ALL_MANIFESTS.map((m) => m.name),
            }),
          },
        ],
        isError: true,
      };
    }
    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(manifest, null, 2),
        },
      ],
    };
  },
);

// Tool: search_components
server.tool(
  'search_components',
  'Searches Lucent UI components by description or concept. Returns matching components ranked by relevance.',
  { query: z.string().describe('Natural language or keyword query, e.g. "loading indicator" or "form validation"') },
  async ({ query }) => {
    const results = ALL_MANIFESTS
      .map((m) => ({ manifest: m, score: scoreManifest(m, query) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ manifest, score }) => ({
        id: manifest.id,
        name: manifest.name,
        tier: manifest.tier,
        description: manifest.description,
        score,
      }));

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({ query, results }, null, 2),
        },
      ],
    };
  },
);

// Tool: list_presets
server.tool(
  'list_presets',
  'Lists all available Lucent UI design presets. Returns combined presets (modern, enterprise, playful) and individual dimensions (palettes, shapes, densities, shadows) that can be mixed and matched.',
  {},
  async () => {
    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({
            combined: COMBINED,
            palettes: PALETTES,
            shapes: SHAPES,
            densities: DENSITIES,
            shadows: SHADOWS,
          }, null, 2),
        },
      ],
    };
  },
);

// Tool: get_preset_config
server.tool(
  'get_preset_config',
  'Returns the LucentProvider configuration code for a given preset selection. Pass a combined preset name OR individual dimension names to get a ready-to-use config file and provider snippet.',
  {
    preset: z.string().optional().describe('Combined preset name: "modern", "enterprise", or "playful"'),
    palette: z.string().optional().describe('Palette name: "default", "brand", "indigo", "emerald", "rose", or "ocean"'),
    shape: z.string().optional().describe('Shape name: "sharp", "rounded", or "pill"'),
    density: z.string().optional().describe('Density name: "compact", "default", or "spacious"'),
    shadow: z.string().optional().describe('Shadow name: "flat", "subtle", or "elevated"'),
  },
  async ({ preset, palette, shape, density, shadow }) => {
    const result = generatePresetConfig({ preset, palette, shape, density, shadow });

    if ('error' in result) {
      return {
        content: [{ type: 'text' as const, text: JSON.stringify({ error: result.error }) }],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({
            configFile: result.configFile,
            providerSnippet: result.providerSnippet,
          }, null, 2),
        },
      ],
    };
  },
);

// ─── Start ────────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);

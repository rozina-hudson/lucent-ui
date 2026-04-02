#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { ALL_MANIFESTS } from './registry.js';
import { ALL_PATTERNS } from './pattern-registry.js';
import { PALETTES, SHAPES, DENSITIES, SHADOWS, COMBINED, generatePresetConfig } from './presets.js';
import { DESIGN_RULES, DESIGN_RULES_SUMMARY } from './design-rules.js';
// ─── Auth stub ───────────────────────────────────────────────────────────────
// LUCENT_API_KEY is reserved for the future paid tier.
// When set, the server acknowledges it but does not yet enforce it.
const apiKey = process.env['LUCENT_API_KEY'];
if (apiKey) {
    process.stderr.write('[lucent-mcp] Auth mode active (LUCENT_API_KEY is set).\n');
}
// ─── Helpers ─────────────────────────────────────────────────────────────────
function findManifest(nameOrId) {
    const q = nameOrId.trim().toLowerCase();
    return ALL_MANIFESTS.find((m) => m.id.toLowerCase() === q || m.name.toLowerCase() === q);
}
function scoreManifest(m, query) {
    const q = query.toLowerCase();
    let score = 0;
    if (m.name.toLowerCase().includes(q))
        score += 10;
    if (m.id.toLowerCase().includes(q))
        score += 8;
    if (m.tier.toLowerCase().includes(q))
        score += 5;
    if (m.description.toLowerCase().includes(q))
        score += 4;
    if (m.designIntent.toLowerCase().includes(q))
        score += 3;
    for (const p of m.props) {
        if (p.name.toLowerCase().includes(q))
            score += 2;
        if (p.description.toLowerCase().includes(q))
            score += 1;
    }
    return score;
}
function findPattern(nameOrId) {
    const q = nameOrId.trim().toLowerCase();
    return ALL_PATTERNS.find((r) => r.id.toLowerCase() === q || r.name.toLowerCase() === q);
}
function scorePattern(r, query) {
    const q = query.toLowerCase();
    let score = 0;
    if (r.name.toLowerCase().includes(q))
        score += 10;
    if (r.id.toLowerCase().includes(q))
        score += 8;
    if (r.category.toLowerCase().includes(q))
        score += 5;
    if (r.description.toLowerCase().includes(q))
        score += 4;
    if (r.designNotes.toLowerCase().includes(q))
        score += 3;
    for (const c of r.components) {
        if (c.toLowerCase().includes(q))
            score += 2;
    }
    return score;
}
// ─── MCP Server ───────────────────────────────────────────────────────────────
const server = new McpServer({
    name: 'lucent-mcp',
    version: '0.1.0',
}, {
    instructions: DESIGN_RULES_SUMMARY,
});
// Tool: list_components
server.tool('list_components', 'Lists all available Lucent UI components with their name, tier (atom/molecule), and one-line description.', {}, async () => {
    const components = ALL_MANIFESTS.map((m) => ({
        id: m.id,
        name: m.name,
        tier: m.tier,
        description: m.description,
    }));
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify({ components }, null, 2),
            },
        ],
    };
});
// Tool: get_component_manifest
server.tool('get_component_manifest', 'Returns the full manifest JSON for a Lucent UI component, including props, usage examples, design intent, and accessibility notes.', { componentName: z.string().describe('Component name or id, e.g. "Button" or "form-field"') }, async ({ componentName }) => {
    const manifest = findManifest(componentName);
    if (!manifest) {
        return {
            content: [
                {
                    type: 'text',
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
                type: 'text',
                text: JSON.stringify(manifest, null, 2),
            },
        ],
    };
});
// Tool: search_components
server.tool('search_components', 'Searches Lucent UI components and composition patterns by description or concept. Returns matching components and patterns ranked by relevance.', { query: z.string().describe('Natural language or keyword query, e.g. "loading indicator", "form validation", or "profile card"') }, async ({ query }) => {
    const componentResults = ALL_MANIFESTS
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
    const patternResults = ALL_PATTERNS
        .map((r) => ({ pattern: r, score: scorePattern(r, query) }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .map(({ pattern, score }) => ({
        id: pattern.id,
        name: pattern.name,
        category: pattern.category,
        description: pattern.description,
        score,
    }));
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify({ query, components: componentResults, patterns: patternResults }, null, 2),
            },
        ],
    };
});
// Tool: get_composition_pattern
server.tool('get_composition_pattern', 'Returns a full composition pattern with structure tree, working JSX code, variants, and design notes. Query by pattern name/id or by category to get all patterns in that category.', {
    name: z.string().optional().describe('Pattern name or id, e.g. "Profile Card" or "settings-panel"'),
    category: z.string().optional().describe('Pattern category: "card", "form", "nav", "dashboard", "settings", or "action"'),
}, async ({ name, category }) => {
    if (name) {
        const pattern = findPattern(name);
        if (!pattern) {
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            error: `Pattern "${name}" not found.`,
                            available: ALL_PATTERNS.map((r) => ({ id: r.id, name: r.name, category: r.category })),
                        }),
                    },
                ],
                isError: true,
            };
        }
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(pattern, null, 2),
                },
            ],
        };
    }
    if (category) {
        const cat = category.trim().toLowerCase();
        const patterns = ALL_PATTERNS.filter((r) => r.category === cat);
        if (patterns.length === 0) {
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            error: `No patterns found in category "${category}".`,
                            availableCategories: [...new Set(ALL_PATTERNS.map((r) => r.category))],
                        }),
                    },
                ],
                isError: true,
            };
        }
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({ category: cat, patterns }, null, 2),
                },
            ],
        };
    }
    // No filter — return all patterns
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify({
                    patterns: ALL_PATTERNS.map((r) => ({
                        id: r.id,
                        name: r.name,
                        category: r.category,
                        description: r.description,
                        components: r.components,
                    })),
                }, null, 2),
            },
        ],
    };
});
// Tool: list_presets
server.tool('list_presets', 'Lists all available Lucent UI design presets. Returns combined presets (modern, enterprise, playful) and individual dimensions (palettes, shapes, densities, shadows) that can be mixed and matched.', {}, async () => {
    return {
        content: [
            {
                type: 'text',
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
});
// Tool: get_preset_config
server.tool('get_preset_config', 'Returns the LucentProvider configuration code for a given preset selection. Pass a combined preset name OR individual dimension names to get a ready-to-use config file and provider snippet.', {
    preset: z.string().optional().describe('Combined preset name: "modern", "enterprise", or "playful"'),
    palette: z.string().optional().describe('Palette name: "default", "brand", "indigo", "emerald", "rose", or "ocean"'),
    shape: z.string().optional().describe('Shape name: "sharp", "rounded", or "pill"'),
    density: z.string().optional().describe('Density name: "compact", "default", or "spacious"'),
    shadow: z.string().optional().describe('Shadow name: "flat", "subtle", or "elevated"'),
}, async ({ preset, palette, shape, density, shadow }) => {
    const result = generatePresetConfig({ preset, palette, shape, density, shadow });
    if ('error' in result) {
        return {
            content: [{ type: 'text', text: JSON.stringify({ error: result.error }) }],
            isError: true,
        };
    }
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify({
                    configFile: result.configFile,
                    providerSnippet: result.providerSnippet,
                }, null, 2),
            },
        ],
    };
});
// Tool: get_design_rules
server.tool('get_design_rules', 'Returns Lucent UI design rules for spacing, typography, button pairing, layout patterns, color usage, and density. These rules ensure AI-generated layouts are aesthetically consistent. Query a specific section or get all rules.', {
    section: z
        .string()
        .optional()
        .describe('Optional section id: "spacing", "typography", "buttons", "layout", "color", or "density". Omit to get all rules.'),
}, async ({ section }) => {
    if (section) {
        const s = section.trim().toLowerCase();
        const rule = DESIGN_RULES.find((r) => r.id === s);
        if (!rule) {
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            error: `Section "${section}" not found.`,
                            availableSections: DESIGN_RULES.map((r) => ({
                                id: r.id,
                                title: r.title,
                            })),
                        }),
                    },
                ],
                isError: true,
            };
        }
        return {
            content: [
                {
                    type: 'text',
                    text: `## ${rule.title}\n\n${rule.body}`,
                },
            ],
        };
    }
    return {
        content: [
            {
                type: 'text',
                text: DESIGN_RULES_SUMMARY,
            },
        ],
    };
});
// ─── Start ────────────────────────────────────────────────────────────────────
const transport = new StdioServerTransport();
await server.connect(transport);

#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { ALL_MANIFESTS } from './registry.js';
import { ALL_RECIPES } from './recipe-registry.js';
import { PALETTES, SHAPES, DENSITIES, SHADOWS, COMBINED, generatePresetConfig } from './presets.js';
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
function findRecipe(nameOrId) {
    const q = nameOrId.trim().toLowerCase();
    return ALL_RECIPES.find((r) => r.id.toLowerCase() === q || r.name.toLowerCase() === q);
}
function scoreRecipe(r, query) {
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
server.tool('search_components', 'Searches Lucent UI components and composition recipes by description or concept. Returns matching components and recipes ranked by relevance.', { query: z.string().describe('Natural language or keyword query, e.g. "loading indicator", "form validation", or "profile card"') }, async ({ query }) => {
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
    const recipeResults = ALL_RECIPES
        .map((r) => ({ recipe: r, score: scoreRecipe(r, query) }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .map(({ recipe, score }) => ({
        id: recipe.id,
        name: recipe.name,
        category: recipe.category,
        description: recipe.description,
        score,
    }));
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify({ query, components: componentResults, recipes: recipeResults }, null, 2),
            },
        ],
    };
});
// Tool: get_composition_recipe
server.tool('get_composition_recipe', 'Returns a full composition recipe with structure tree, working JSX code, variants, and design notes. Query by recipe name/id or by category to get all recipes in that category.', {
    name: z.string().optional().describe('Recipe name or id, e.g. "Profile Card" or "settings-panel"'),
    category: z.string().optional().describe('Recipe category: "card", "form", "nav", "dashboard", "settings", or "action"'),
}, async ({ name, category }) => {
    if (name) {
        const recipe = findRecipe(name);
        if (!recipe) {
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            error: `Recipe "${name}" not found.`,
                            available: ALL_RECIPES.map((r) => ({ id: r.id, name: r.name, category: r.category })),
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
                    text: JSON.stringify(recipe, null, 2),
                },
            ],
        };
    }
    if (category) {
        const cat = category.trim().toLowerCase();
        const recipes = ALL_RECIPES.filter((r) => r.category === cat);
        if (recipes.length === 0) {
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            error: `No recipes found in category "${category}".`,
                            availableCategories: [...new Set(ALL_RECIPES.map((r) => r.category))],
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
                    text: JSON.stringify({ category: cat, recipes }, null, 2),
                },
            ],
        };
    }
    // No filter — return all recipes
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify({
                    recipes: ALL_RECIPES.map((r) => ({
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
// ─── Start ────────────────────────────────────────────────────────────────────
const transport = new StdioServerTransport();
await server.connect(transport);

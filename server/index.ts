#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerTools, DESIGN_RULES_SUMMARY } from './tools.js';

// ─── Auth stub ───────────────────────────────────────────────────────────────
// LUCENT_API_KEY is reserved for the future paid tier.
// When set, the server acknowledges it but does not yet enforce it.
const apiKey = process.env['LUCENT_API_KEY'];
if (apiKey) {
  process.stderr.write('[lucent-mcp] Auth mode active (LUCENT_API_KEY is set).\n');
}

// ─── MCP Server ───────────────────────────────────────────────────────────────

const server = new McpServer(
  {
    name: 'lucent-mcp',
    version: '0.1.0',
  },
  {
    instructions: DESIGN_RULES_SUMMARY,
  },
);

registerTools(server);

// ─── Start ────────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);

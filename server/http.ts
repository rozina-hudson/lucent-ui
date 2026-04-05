#!/usr/bin/env node
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import type { Transport } from '@modelcontextprotocol/sdk/shared/transport.js';
import { registerTools, DESIGN_RULES_SUMMARY } from './tools.js';

const PORT = Number(process.env['PORT'] ?? 3000);
const HOST = process.env['HOST'] ?? '127.0.0.1';
const API_KEY = process.env['LUCENT_API_KEY'];
const MCP_PATH = process.env['LUCENT_MCP_PATH'] ?? '/mcp';

function log(msg: string): void {
  process.stderr.write(`[lucent-mcp-http] ${msg}\n`);
}

// Build a fresh McpServer + tool registrations per request (stateless mode).
function createServerInstance(): McpServer {
  const server = new McpServer(
    { name: 'lucent-mcp', version: '0.1.0' },
    { instructions: DESIGN_RULES_SUMMARY },
  );
  registerTools(server);
  return server;
}

function readJsonBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (!raw) return resolve(undefined);
      try {
        resolve(JSON.parse(raw));
      } catch (err) {
        reject(err instanceof Error ? err : new Error(String(err)));
      }
    });
    req.on('error', reject);
  });
}

function writeJson(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

function jsonRpcError(
  res: ServerResponse,
  status: number,
  code: number,
  message: string,
): void {
  writeJson(res, status, {
    jsonrpc: '2.0',
    error: { code, message },
    id: null,
  });
}

function checkAuth(req: IncomingMessage): boolean {
  if (!API_KEY) return true; // Auth disabled when env var is not set
  const header = req.headers['authorization'];
  if (typeof header !== 'string') return false;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match !== null && match[1] === API_KEY;
}

function setCorsHeaders(res: ServerResponse): void {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, DELETE, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Mcp-Session-Id',
  );
}

const httpServer = createServer(async (req, res) => {
  setCorsHeaders(res);

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Max-Age': '86400' });
    res.end();
    return;
  }

  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);

  // Health check — unauthenticated, useful for uptime probes
  if (url.pathname === '/health' && req.method === 'GET') {
    writeJson(res, 200, { status: 'ok' });
    return;
  }

  if (url.pathname !== MCP_PATH) {
    writeJson(res, 404, { error: 'Not found' });
    return;
  }

  if (!checkAuth(req)) {
    res.setHeader('WWW-Authenticate', 'Bearer');
    writeJson(res, 401, { error: 'Unauthorized' });
    return;
  }

  // Only POST is supported in stateless mode (no server-initiated streams).
  if (req.method !== 'POST') {
    jsonRpcError(res, 405, -32000, 'Method not allowed.');
    return;
  }

  try {
    const body = await readJsonBody(req);
    const server = createServerInstance();
    const transport = new StreamableHTTPServerTransport({}); // stateless
    // SDK types widen onclose/onerror with `| undefined`, which trips
    // exactOptionalPropertyTypes against the stricter Transport interface.
    await server.connect(transport as unknown as Transport);
    res.on('close', () => {
      void transport.close();
      void server.close();
    });
    await transport.handleRequest(req, res, body);
  } catch (err) {
    log(`error handling request: ${(err as Error).message}`);
    if (!res.headersSent) {
      jsonRpcError(res, 500, -32603, 'Internal server error');
    }
  }
});

httpServer.listen(PORT, HOST, () => {
  log(`listening on http://${HOST}:${PORT}${MCP_PATH}`);
  if (!API_KEY) {
    log('WARNING: LUCENT_API_KEY is not set — the server is unauthenticated.');
  }
  if (HOST === '0.0.0.0' || HOST === '::') {
    log(`WARNING: bound to ${HOST}. Set LUCENT_API_KEY before exposing publicly.`);
  }
});

function shutdown(): void {
  log('shutting down...');
  httpServer.close(() => process.exit(0));
  // Force-exit if graceful close hangs
  setTimeout(() => process.exit(1), 5000).unref();
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

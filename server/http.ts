#!/usr/bin/env node
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import type { Transport } from '@modelcontextprotocol/sdk/shared/transport.js';
import { registerTools, DESIGN_RULES_SUMMARY } from './tools.js';
import { getRecentCalls, subscribeToCalls, type StoredCall } from './logger.js';
import { openKeyStore, runWithAuth, type AuthContext } from './auth.js';

/** Compact summary of recent traffic for the dashboard's stat tiles and charts. */
interface UsageAggregates {
  total: number;
  perTool: Record<string, number>;
  uniqueKeys: number;
  lastMinute: number;
  errors: number;
  avgDurationMs: number | null;
}

function computeAggregates(calls: StoredCall[]): UsageAggregates {
  const perTool: Record<string, number> = {};
  const keySet = new Set<string>();
  let errors = 0;
  let totalDuration = 0;
  let lastMinute = 0;
  const oneMinuteAgo = Date.now() - 60_000;

  for (const call of calls) {
    perTool[call.tool] = (perTool[call.tool] ?? 0) + 1;
    if (call.key !== undefined) keySet.add(call.key);
    if (!call.ok) errors += 1;
    totalDuration += call.durationMs;
    if (Date.parse(call.t) >= oneMinuteAgo) lastMinute += 1;
  }

  return {
    total: calls.length,
    perTool,
    uniqueKeys: keySet.size,
    lastMinute,
    errors,
    avgDurationMs: calls.length > 0 ? Math.round(totalDuration / calls.length) : null,
  };
}

const PORT = Number(process.env['PORT'] ?? 3000);
const HOST = process.env['HOST'] ?? '127.0.0.1';
const LEGACY_KEY = process.env['LUCENT_API_KEY'];
const MCP_PATH = process.env['LUCENT_MCP_PATH'] ?? '/mcp';
const KEY_DB_PATH = process.env['LUCENT_KEY_DB'] ?? './data/keys.db';

const keyStore = openKeyStore(KEY_DB_PATH);

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

function extractBearer(req: IncomingMessage): string | null {
  const header = req.headers['authorization'];
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match !== null && match[1] !== undefined ? match[1] : null;
}

function authenticate(req: IncomingMessage): AuthContext | null {
  const bearer = extractBearer(req);
  if (bearer === null) return null;
  return keyStore.authenticate(bearer);
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

  // Usage snapshot — recent calls + aggregates for the dashboard.
  if (url.pathname === '/usage' && req.method === 'GET') {
    if (authenticate(req) === null) {
      res.setHeader('WWW-Authenticate', 'Bearer');
      writeJson(res, 401, { error: 'Unauthorized' });
      return;
    }
    const calls = getRecentCalls();
    writeJson(res, 200, {
      calls,
      aggregates: computeAggregates(calls),
    });
    return;
  }

  // Usage live stream — SSE, pushes each new tool call as it happens.
  if (url.pathname === '/usage/stream' && req.method === 'GET') {
    if (authenticate(req) === null) {
      res.setHeader('WWW-Authenticate', 'Bearer');
      writeJson(res, 401, { error: 'Unauthorized' });
      return;
    }
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no', // disable proxy buffering (nginx, some CDNs)
    });
    // Prime the connection so clients know we're live.
    res.write(': connected\n\n');
    const unsubscribe = subscribeToCalls((entry) => {
      res.write(`data: ${JSON.stringify(entry)}\n\n`);
    });
    // Keep-alive heartbeat every 25s so idle connections aren't dropped.
    const heartbeat = setInterval(() => {
      res.write(': heartbeat\n\n');
    }, 25_000);
    req.on('close', () => {
      clearInterval(heartbeat);
      unsubscribe();
    });
    return;
  }

  if (url.pathname !== MCP_PATH) {
    writeJson(res, 404, { error: 'Not found' });
    return;
  }

  const authCtx = authenticate(req);
  if (authCtx === null) {
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
    // Propagate the authenticated identity to tool handlers + the logger.
    await runWithAuth(authCtx, () => transport.handleRequest(req, res, body));
  } catch (err) {
    log(`error handling request: ${(err as Error).message}`);
    if (!res.headersSent) {
      jsonRpcError(res, 500, -32603, 'Internal server error');
    }
  }
});

httpServer.listen(PORT, HOST, () => {
  log(`listening on http://${HOST}:${PORT}${MCP_PATH}`);
  log(`key store: ${KEY_DB_PATH}`);
  if (LEGACY_KEY !== undefined) {
    log('note: LUCENT_API_KEY (legacy) is set and will be accepted as a fallback. Unset it once a DB key is minted.');
  }
  if (HOST === '0.0.0.0' || HOST === '::') {
    log(`WARNING: bound to ${HOST}. Ensure at least one DB key is minted before exposing publicly.`);
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

import { getAuthContext } from './auth.js';

/**
 * Structured logging + in-memory ring buffer for MCP tool calls.
 *
 * One JSON line per call is written to stderr (greppable, parseable by log
 * shippers), and the same entry is pushed to an in-memory ring buffer used
 * by the `/usage` and `/usage/stream` HTTP endpoints.
 *
 * Set `LUCENT_MCP_QUIET=1` to silence stderr — the ring buffer still fills,
 * so the usage dashboard keeps working.
 *
 * When called inside an authenticated HTTP request, the caller's key hash
 * prefix and label are included so usage can be attributed per user.
 */

const QUIET = process.env['LUCENT_MCP_QUIET'] === '1';
const BUFFER_SIZE = 500;

export interface ToolCallLogEntry {
  tool: string;
  params: unknown;
  durationMs: number;
  ok: boolean;
  error?: string;
}

/** An entry as stored in the ring buffer (with timestamp + key/user attribution). */
export interface StoredCall extends ToolCallLogEntry {
  t: string;
  /** First 8 hex chars of sha256(key) — safe for logs. */
  key?: string;
  /** Human-readable label from the key record ("alice@example.com"). */
  user?: string;
}

// ─── Ring buffer + subscribers ───────────────────────────────────────────────

const recentCalls: StoredCall[] = [];
type Subscriber = (entry: StoredCall) => void;
const subscribers = new Set<Subscriber>();

/** Snapshot of the ring buffer, newest first. */
export function getRecentCalls(): StoredCall[] {
  return recentCalls.slice().reverse();
}

/**
 * Subscribe to new tool calls as they happen. Returns an unsubscribe function.
 * Used by the `/usage/stream` SSE endpoint to push live updates.
 */
export function subscribeToCalls(fn: Subscriber): () => void {
  subscribers.add(fn);
  return () => {
    subscribers.delete(fn);
  };
}

// ─── Logging ─────────────────────────────────────────────────────────────────

export function logToolCall(entry: ToolCallLogEntry): void {
  const auth = getAuthContext();
  const stored: StoredCall = {
    t: new Date().toISOString(),
    tool: entry.tool,
    params: entry.params,
    durationMs: entry.durationMs,
    ok: entry.ok,
    ...(entry.error !== undefined && { error: entry.error }),
    ...(auth !== undefined && { key: auth.keyHashPrefix, user: auth.label }),
  };

  // 1. Push to ring buffer (always, even in QUIET mode — dashboards still work).
  recentCalls.push(stored);
  if (recentCalls.length > BUFFER_SIZE) recentCalls.shift();

  // 2. Notify subscribers (SSE streams).
  for (const sub of subscribers) {
    try {
      sub(stored);
    } catch {
      // Never let a broken subscriber break the tool call path.
    }
  }

  // 3. Write to stderr unless QUIET.
  if (!QUIET) {
    process.stderr.write(JSON.stringify(stored) + '\n');
  }
}

// ─── Tool handler wrapper ────────────────────────────────────────────────────

// Tool handlers have heterogeneous argument shapes (some take an object, some
// take nothing). A generic constraint with `any[]` here is the cleanest way to
// preserve inference at call sites without leaking `any` into consumers.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ToolHandler = (...args: any[]) => Promise<{ content: unknown; isError?: boolean }>;

/**
 * Wraps a tool handler with timing + structured logging. The returned function
 * has the same signature as the input, so it can be passed directly to
 * `server.tool(...)` without any call-site changes.
 */
export function withLogging<H extends ToolHandler>(name: string, handler: H): H {
  const wrapped = async (...args: Parameters<H>) => {
    const start = Date.now();
    const params = args[0] ?? {};
    try {
      const result = await handler(...args);
      logToolCall({
        tool: name,
        params,
        durationMs: Date.now() - start,
        ok: !result.isError,
      });
      return result;
    } catch (err) {
      logToolCall({
        tool: name,
        params,
        durationMs: Date.now() - start,
        ok: false,
        error: err instanceof Error ? err.message : String(err),
      });
      throw err;
    }
  };
  return wrapped as H;
}

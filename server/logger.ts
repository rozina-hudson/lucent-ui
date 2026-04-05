import { createHash } from 'node:crypto';

/**
 * Structured logging for MCP tool calls.
 *
 * One JSON line per call is written to stderr (greppable, parseable by log
 * shippers). Set `LUCENT_MCP_QUIET=1` to disable all logging.
 *
 * When `LUCENT_API_KEY` is set, a short hash prefix of the key is included
 * in log entries for usage analytics. The raw key is never logged.
 */

const QUIET = process.env['LUCENT_MCP_QUIET'] === '1';

/**
 * Returns the first 8 hex chars of sha256(key). Short enough to stay readable
 * in logs, safe to leak (pre-image resistant), and unique enough to distinguish
 * customers once multi-key auth lands (see issue #15).
 */
function hashKeyPrefix(key: string): string {
  return createHash('sha256').update(key).digest('hex').slice(0, 8);
}

export interface ToolCallLogEntry {
  tool: string;
  params: unknown;
  durationMs: number;
  ok: boolean;
  error?: string;
}

export function logToolCall(entry: ToolCallLogEntry): void {
  if (QUIET) return;
  const apiKey = process.env['LUCENT_API_KEY'];
  const line = JSON.stringify({
    t: new Date().toISOString(),
    tool: entry.tool,
    params: entry.params,
    durationMs: entry.durationMs,
    ok: entry.ok,
    ...(entry.error !== undefined && { error: entry.error }),
    ...(apiKey !== undefined && { key: hashKeyPrefix(apiKey) }),
  });
  process.stderr.write(line + '\n');
}

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

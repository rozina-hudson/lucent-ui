import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLucent } from '../src/index.js';
import { Stack } from '../src/components/atoms/Stack/index.js';
import { Row } from '../src/components/atoms/Row/index.js';
import { Text } from '../src/components/atoms/Text/index.js';
import { Card } from '../src/components/molecules/Card/index.js';
import { Input } from '../src/components/atoms/Input/index.js';
import { Button } from '../src/components/atoms/Button/index.js';
import { Chip } from '../src/components/atoms/Chip/index.js';
import { Badge } from '../src/components/atoms/Badge/index.js';
import { DataTable } from '../src/components/molecules/DataTable/index.js';
import { EmptyState } from '../src/components/molecules/EmptyState/index.js';
import { Alert } from '../src/components/molecules/Alert/index.js';
import { FormField } from '../src/components/molecules/FormField/index.js';

// ─── Types ────────────────────────────────────────────────────────────────────

interface StoredCall {
  t: string;
  tool: string;
  params: unknown;
  durationMs: number;
  ok: boolean;
  error?: string;
  key?: string;
}

interface UsageAggregates {
  total: number;
  perTool: Record<string, number>;
  uniqueKeys: number;
  lastMinute: number;
  errors: number;
  avgDurationMs: number | null;
}

interface UsageSnapshot {
  calls: StoredCall[];
  aggregates: UsageAggregates;
}

type ConnectionState = 'idle' | 'connecting' | 'connected' | 'error';

// ─── Constants ────────────────────────────────────────────────────────────────

const LS_KEY = 'lucent-dashboard-api-key';
const LS_URL = 'lucent-dashboard-server-url';
const DEFAULT_URL = 'http://127.0.0.1:3000';
const MAX_ROWS = 500;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function recomputeAggregates(calls: StoredCall[]): UsageAggregates {
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

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString(undefined, { hour12: false });
}

function formatParams(params: unknown): string {
  if (params === null || params === undefined) return '—';
  if (typeof params === 'object' && Object.keys(params as object).length === 0) return '—';
  try {
    const str = JSON.stringify(params);
    return str.length > 80 ? str.slice(0, 77) + '…' : str;
  } catch {
    return String(params);
  }
}

/**
 * Opens an SSE stream via fetch + ReadableStream so we can pass the auth key
 * in an Authorization header (which EventSource doesn't support).
 */
async function streamUsage(
  url: string,
  key: string,
  signal: AbortSignal,
  onCall: (entry: StoredCall) => void,
  onError: (msg: string) => void,
): Promise<void> {
  try {
    const res = await fetch(`${url}/usage/stream`, {
      headers: { Authorization: `Bearer ${key}` },
      signal,
    });
    if (!res.ok) {
      onError(`Stream failed: HTTP ${res.status}`);
      return;
    }
    if (!res.body) {
      onError('Stream has no body');
      return;
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      // SSE events are delimited by blank lines (\n\n).
      const events = buffer.split('\n\n');
      buffer = events.pop() ?? '';
      for (const event of events) {
        // Skip comments (lines starting with ":") and parse data: lines.
        for (const line of event.split('\n')) {
          if (line.startsWith('data: ')) {
            try {
              const parsed = JSON.parse(line.slice(6)) as StoredCall;
              onCall(parsed);
            } catch {
              // Ignore malformed events — shouldn't happen in practice.
            }
          }
        }
      }
    }
  } catch (err) {
    if ((err as Error).name !== 'AbortError') {
      onError((err as Error).message);
    }
  }
}

// ─── Connect form ─────────────────────────────────────────────────────────────

function ConnectForm({
  initialUrl,
  onConnect,
  errorMsg,
}: {
  initialUrl: string;
  onConnect: (url: string, key: string) => void;
  errorMsg: string | null;
}) {
  const [url, setUrl] = useState(initialUrl);
  const [key, setKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim()) onConnect(url.trim() || DEFAULT_URL, key.trim());
  };

  return (
    <Card variant="outline" padding="lg" style={{ maxWidth: 520, margin: '80px auto' }}>
      <form onSubmit={handleSubmit}>
        <Stack gap="5">
          <Stack gap="2">
            <Text as="h2" size="xl" weight="bold">Connect to your MCP server</Text>
            <Text size="sm" color="secondary">
              Paste the URL and API key of your running <code>lucent-mcp-http</code> server.
              Credentials are stored in <code>localStorage</code> on this machine only.
            </Text>
          </Stack>

          {errorMsg !== null && <Alert variant="danger" title="Connection failed">{errorMsg}</Alert>}

          <FormField label="Server URL" helperText="e.g. http://127.0.0.1:3000 or https://mcp.lucentui.ai">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={DEFAULT_URL}
              autoFocus
            />
          </FormField>

          <FormField label="API key" helperText="The value of LUCENT_API_KEY on the server">
            <Input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="paste your key…"
            />
          </FormField>

          <Row gap="3" justify="end">
            <Button type="submit" variant="primary" disabled={!key.trim()}>
              Connect
            </Button>
          </Row>
        </Stack>
      </form>
    </Card>
  );
}

// ─── Stat tile ────────────────────────────────────────────────────────────────

function StatTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: 'default' | 'danger' | 'accent';
}) {
  const { tokens } = useLucent();
  const color =
    tone === 'danger'
      ? tokens.dangerText
      : tone === 'accent'
        ? tokens.accentDefault
        : tokens.textPrimary;

  return (
    <Card variant="outline" padding="md" style={{ flex: 1, minWidth: 160 }}>
      <Stack gap="1">
        <Text
          size="xs"
          color="secondary"
          style={{
            textTransform: 'uppercase',
            letterSpacing: tokens.letterSpacingWide,
            fontFamily: tokens.fontFamilyMono,
          }}
        >
          {label}
        </Text>
        <Text
          as="span"
          size="3xl"
          weight="bold"
          family="display"
          style={{ color, lineHeight: 1 }}
        >
          {value}
        </Text>
      </Stack>
    </Card>
  );
}

// ─── Tool bar chart ───────────────────────────────────────────────────────────

function ToolBarChart({ perTool }: { perTool: Record<string, number> }) {
  const { tokens } = useLucent();
  const entries = Object.entries(perTool).sort((a, b) => b[1] - a[1]);
  const max = Math.max(1, ...entries.map(([, c]) => c));

  if (entries.length === 0) {
    return (
      <Text size="sm" color="secondary">
        No calls yet. Fire a request at your MCP server and it will appear here.
      </Text>
    );
  }

  return (
    <Stack gap="3">
      {entries.map(([tool, count]) => {
        const pct = (count / max) * 100;
        return (
          <Stack key={tool} gap="1">
            <Row gap="3" justify="between" align="center">
              <Text
                size="sm"
                weight="medium"
                style={{ fontFamily: tokens.fontFamilyMono }}
              >
                {tool}
              </Text>
              <Text size="sm" color="secondary">{count}</Text>
            </Row>
            <div
              style={{
                height: 8,
                borderRadius: 4,
                background: `color-mix(in srgb, ${tokens.textPrimary} 8%, transparent)`,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${pct}%`,
                  background: tokens.accentDefault,
                  transition: 'width 300ms ease-out',
                }}
              />
            </div>
          </Stack>
        );
      })}
    </Stack>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────

export function UsageDashboard() {
  const { tokens } = useLucent();

  const [apiKey, setApiKey] = useState<string | null>(() => {
    try {
      return localStorage.getItem(LS_KEY);
    } catch {
      return null;
    }
  });
  const [serverUrl, setServerUrl] = useState<string>(() => {
    try {
      return localStorage.getItem(LS_URL) ?? DEFAULT_URL;
    } catch {
      return DEFAULT_URL;
    }
  });

  const [calls, setCalls] = useState<StoredCall[]>([]);
  const [connection, setConnection] = useState<ConnectionState>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const aggregates = useMemo(() => recomputeAggregates(calls), [calls]);

  const handleConnect = useCallback((url: string, key: string) => {
    try {
      localStorage.setItem(LS_KEY, key);
      localStorage.setItem(LS_URL, url);
    } catch {
      // localStorage unavailable — still connect for this session
    }
    setServerUrl(url);
    setApiKey(key);
    setErrorMsg(null);
  }, []);

  const handleDisconnect = useCallback(() => {
    try {
      localStorage.removeItem(LS_KEY);
    } catch {
      // ignore
    }
    abortRef.current?.abort();
    setApiKey(null);
    setCalls([]);
    setConnection('idle');
    setErrorMsg(null);
  }, []);

  // Fetch snapshot + open SSE stream whenever we have a key.
  useEffect(() => {
    if (apiKey === null) return;

    const controller = new AbortController();
    abortRef.current = controller;
    setConnection('connecting');
    setErrorMsg(null);

    (async () => {
      // 1. Initial snapshot.
      try {
        const res = await fetch(`${serverUrl}/usage`, {
          headers: { Authorization: `Bearer ${apiKey}` },
          signal: controller.signal,
        });
        if (!res.ok) {
          setErrorMsg(
            res.status === 401
              ? 'Unauthorized — the API key is wrong.'
              : `Snapshot failed: HTTP ${res.status}`,
          );
          setConnection('error');
          return;
        }
        const snapshot = (await res.json()) as UsageSnapshot;
        setCalls(snapshot.calls);
        setConnection('connected');
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setErrorMsg(
            `Could not reach ${serverUrl}. Is the server running? (${(err as Error).message})`,
          );
          setConnection('error');
        }
        return;
      }

      // 2. Live stream.
      await streamUsage(
        serverUrl,
        apiKey,
        controller.signal,
        (entry) => {
          setCalls((prev) => [entry, ...prev].slice(0, MAX_ROWS));
        },
        (msg) => {
          setErrorMsg(`Stream interrupted: ${msg}`);
          setConnection('error');
        },
      );
    })();

    return () => {
      controller.abort();
    };
  }, [apiKey, serverUrl]);

  // ── Onboarding form ────────────────────────────────────────────────────────
  if (apiKey === null || connection === 'error') {
    return (
      <div style={{ padding: tokens.space6 }}>
        <ConnectForm
          initialUrl={serverUrl}
          onConnect={(url, key) => {
            handleDisconnect();
            handleConnect(url, key);
          }}
          errorMsg={errorMsg}
        />
      </div>
    );
  }

  // ── Connected dashboard ────────────────────────────────────────────────────
  const connectionChip = (() => {
    if (connection === 'connecting') {
      return <Chip variant="neutral">Connecting…</Chip>;
    }
    if (connection === 'connected') {
      return <Chip variant="success">● Live</Chip>;
    }
    return <Chip variant="neutral">Idle</Chip>;
  })();

  const tableColumns = [
    {
      key: 'time',
      header: 'Time',
      render: (row: StoredCall) => (
        <span style={{ fontFamily: tokens.fontFamilyMono, fontSize: tokens.fontSizeXs }}>
          {formatTime(row.t)}
        </span>
      ),
    },
    {
      key: 'tool',
      header: 'Tool',
      sortable: true,
      render: (row: StoredCall) => (
        <span style={{ fontFamily: tokens.fontFamilyMono, fontSize: tokens.fontSizeSm }}>
          {row.tool}
        </span>
      ),
    },
    {
      key: 'params',
      header: 'Params',
      render: (row: StoredCall) => (
        <span
          style={{
            fontFamily: tokens.fontFamilyMono,
            fontSize: tokens.fontSizeXs,
            color: tokens.textSecondary,
          }}
        >
          {formatParams(row.params)}
        </span>
      ),
    },
    {
      key: 'durationMs',
      header: 'Duration',
      sortable: true,
      render: (row: StoredCall) => (
        <span style={{ fontSize: tokens.fontSizeSm, color: tokens.textSecondary }}>
          {row.durationMs}ms
        </span>
      ),
    },
    {
      key: 'ok',
      header: 'Status',
      render: (row: StoredCall) =>
        row.ok ? (
          <Badge variant="success">ok</Badge>
        ) : (
          <Badge variant="danger">fail</Badge>
        ),
    },
    {
      key: 'key',
      header: 'Caller',
      render: (row: StoredCall) => (
        <span
          style={{
            fontFamily: tokens.fontFamilyMono,
            fontSize: tokens.fontSizeXs,
            color: tokens.textSecondary,
          }}
        >
          {row.key ?? '—'}
        </span>
      ),
    },
  ];

  return (
    <div style={{ padding: tokens.space6 }}>
      <Stack gap="6">
        {/* Header */}
        <Row gap="4" justify="between" align="center" wrap>
          <Stack gap="1">
            <Text as="h1" size="2xl" weight="bold">MCP usage</Text>
            <Text size="sm" color="secondary">
              Live view of tool calls hitting your <code>lucent-mcp-http</code> server at{' '}
              <code>{serverUrl}</code>
            </Text>
          </Stack>
          <Row gap="3" align="center">
            {connectionChip}
            <Button variant="outline" size="sm" onClick={handleDisconnect}>
              Disconnect
            </Button>
          </Row>
        </Row>

        {errorMsg !== null && <Alert variant="warning" title="Heads up">{errorMsg}</Alert>}

        {/* Stat tiles */}
        <Row gap="4" wrap>
          <StatTile label="Total (buffer)" value={aggregates.total.toString()} />
          <StatTile label="Last minute" value={aggregates.lastMinute.toString()} tone="accent" />
          <StatTile label="Unique keys" value={aggregates.uniqueKeys.toString()} />
          <StatTile label="Errors" value={aggregates.errors.toString()} tone={aggregates.errors > 0 ? 'danger' : 'default'} />
          <StatTile
            label="Avg duration"
            value={aggregates.avgDurationMs === null ? '—' : `${aggregates.avgDurationMs}ms`}
          />
        </Row>

        {/* Tool usage + recent calls */}
        <Row gap="5" wrap align="start">
          <Card variant="outline" padding="md" style={{ flex: 1, minWidth: 320 }}>
            <Stack gap="4">
              <Text as="h2" size="md" weight="semibold">Tool usage</Text>
              <ToolBarChart perTool={aggregates.perTool} />
            </Stack>
          </Card>

          <Card variant="outline" padding="md" style={{ flex: 2, minWidth: 480 }}>
            <Stack gap="4">
              <Row gap="3" justify="between" align="center">
                <Text as="h2" size="md" weight="semibold">Recent calls</Text>
                <Text size="xs" color="secondary">
                  Newest first, up to {MAX_ROWS}
                </Text>
              </Row>
              {calls.length === 0 ? (
                <EmptyState
                  title="Waiting for traffic"
                  description="No tool calls yet. Fire a request at your MCP server and it'll appear here in real time."
                />
              ) : (
                <DataTable
                  columns={tableColumns}
                  rows={calls}
                  pageSize={15}
                  style={{ width: '100%' }}
                />
              )}
            </Stack>
          </Card>
        </Row>
      </Stack>
    </div>
  );
}

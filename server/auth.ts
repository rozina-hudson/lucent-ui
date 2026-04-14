import { AsyncLocalStorage } from 'node:async_hooks';
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { dirname } from 'node:path';
import { mkdirSync } from 'node:fs';
import Database from 'better-sqlite3';

/**
 * Per-user API key auth backed by SQLite.
 *
 * Keys are stored as sha256 hashes — the plaintext is shown once at mint time
 * and never again. Bearer tokens presented on requests are hashed and looked
 * up; matching rows have their `last_used_at` bumped so the admin CLI can tell
 * who's actually active.
 *
 * A legacy `LUCENT_API_KEY` env var is still honored when set, to keep the
 * first deploy working before the first DB key is minted. Unset it after
 * cutover — see docs/MCP_HOSTING.md.
 */

const KEY_PREFIX = 'lucent_beta_';

export interface ApiKeyRecord {
  id: number;
  label: string;
  tokenHash: string;
  createdAt: string;
  revokedAt: string | null;
  lastUsedAt: string | null;
}

export interface AuthContext {
  /** DB row id, or "legacy" when authenticated via the env var fallback. */
  userId: string;
  /** Human-readable label ("rozina-admin") or "legacy" for env-var auth. */
  label: string;
  /** First 8 hex chars of sha256(key) — safe for logs. */
  keyHashPrefix: string;
}

const authContext = new AsyncLocalStorage<AuthContext>();

export function getAuthContext(): AuthContext | undefined {
  return authContext.getStore();
}

export function runWithAuth<T>(ctx: AuthContext, fn: () => T): T {
  return authContext.run(ctx, fn);
}

export function generateKey(): string {
  return `${KEY_PREFIX}${randomBytes(16).toString('hex')}`;
}

export function hashKey(plaintext: string): string {
  return createHash('sha256').update(plaintext).digest('hex');
}

function hashPrefix(fullHash: string): string {
  return fullHash.slice(0, 8);
}

/**
 * Constant-time compare of two equal-length strings. Used for the legacy env
 * var fallback so we don't leak timing info about the shared key.
 */
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export interface KeyStore {
  mint(label: string): { plaintext: string; record: ApiKeyRecord };
  list(): ApiKeyRecord[];
  revoke(labelOrPrefix: string): ApiKeyRecord | null;
  /** Returns the auth context if the bearer matches a live key, else null. */
  authenticate(bearer: string): AuthContext | null;
  close(): void;
}

interface DbRow {
  id: number;
  label: string;
  token_hash: string;
  created_at: string;
  revoked_at: string | null;
  last_used_at: string | null;
}

function rowToRecord(row: DbRow): ApiKeyRecord {
  return {
    id: row.id,
    label: row.label,
    tokenHash: row.token_hash,
    createdAt: row.created_at,
    revokedAt: row.revoked_at,
    lastUsedAt: row.last_used_at,
  };
}

export function openKeyStore(dbPath: string): KeyStore {
  if (dbPath !== ':memory:') {
    mkdirSync(dirname(dbPath), { recursive: true });
  }

  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.exec(`
    CREATE TABLE IF NOT EXISTS keys (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      label TEXT NOT NULL,
      token_hash TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      revoked_at TEXT,
      last_used_at TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_keys_token_hash ON keys(token_hash);
  `);

  const insert = db.prepare(
    'INSERT INTO keys (label, token_hash) VALUES (?, ?) RETURNING *',
  );
  const selectAll = db.prepare('SELECT * FROM keys ORDER BY id DESC');
  const selectByHash = db.prepare('SELECT * FROM keys WHERE token_hash = ?');
  const selectByLabelOrHashPrefix = db.prepare(
    'SELECT * FROM keys WHERE label = ? OR token_hash LIKE ? LIMIT 2',
  );
  const bumpUsed = db.prepare(
    "UPDATE keys SET last_used_at = datetime('now') WHERE id = ?",
  );
  const revoke = db.prepare(
    "UPDATE keys SET revoked_at = datetime('now') WHERE id = ? RETURNING *",
  );

  return {
    mint(label) {
      if (!label.trim()) throw new Error('label must not be empty');
      const plaintext = generateKey();
      const row = insert.get(label.trim(), hashKey(plaintext)) as DbRow;
      return { plaintext, record: rowToRecord(row) };
    },

    list() {
      return (selectAll.all() as DbRow[]).map(rowToRecord);
    },

    revoke(labelOrPrefix) {
      const rows = selectByLabelOrHashPrefix.all(
        labelOrPrefix,
        `${labelOrPrefix}%`,
      ) as DbRow[];
      const live = rows.filter((r) => r.revoked_at === null);
      if (live.length === 0) return null;
      if (live.length > 1) {
        throw new Error(
          `"${labelOrPrefix}" matches ${live.length} live keys — use a longer prefix or the exact label`,
        );
      }
      const first = live[0];
      if (first === undefined) return null;
      const updated = revoke.get(first.id) as DbRow;
      return rowToRecord(updated);
    },

    authenticate(bearer) {
      const legacy = process.env['LUCENT_API_KEY'];
      if (legacy !== undefined && legacy.length > 0 && safeEqual(bearer, legacy)) {
        return {
          userId: 'legacy',
          label: 'legacy',
          keyHashPrefix: hashPrefix(hashKey(bearer)),
        };
      }

      if (!bearer.startsWith(KEY_PREFIX)) return null;
      const hash = hashKey(bearer);
      const row = selectByHash.get(hash) as DbRow | undefined;
      if (row === undefined) return null;
      if (row.revoked_at !== null) return null;
      bumpUsed.run(row.id);
      return {
        userId: String(row.id),
        label: row.label,
        keyHashPrefix: hashPrefix(hash),
      };
    },

    close() {
      db.close();
    },
  };
}

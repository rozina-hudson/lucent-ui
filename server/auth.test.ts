import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  getAuthContext,
  hashKey,
  openKeyStore,
  runWithAuth,
  type KeyStore,
} from './auth.js';

describe('KeyStore', () => {
  let store: KeyStore;
  const originalEnv = process.env['LUCENT_API_KEY'];

  beforeEach(() => {
    store = openKeyStore(':memory:');
    delete process.env['LUCENT_API_KEY'];
  });

  afterEach(() => {
    store.close();
    if (originalEnv === undefined) delete process.env['LUCENT_API_KEY'];
    else process.env['LUCENT_API_KEY'] = originalEnv;
  });

  it('mints a key with the lucent_beta_ prefix and unique hash', () => {
    const { plaintext, record } = store.mint('alice@example.com');
    expect(plaintext).toMatch(/^lucent_beta_[0-9a-f]{32}$/);
    expect(record.label).toBe('alice@example.com');
    expect(record.tokenHash).toBe(hashKey(plaintext));
    expect(record.revokedAt).toBeNull();
  });

  it('authenticates a freshly-minted key and bumps last_used_at', () => {
    const { plaintext, record } = store.mint('alice');
    const ctx = store.authenticate(plaintext);
    expect(ctx).not.toBeNull();
    expect(ctx?.userId).toBe(String(record.id));
    expect(ctx?.label).toBe('alice');

    const [row] = store.list();
    expect(row?.lastUsedAt).not.toBeNull();
  });

  it('rejects an unknown key', () => {
    expect(store.authenticate('lucent_beta_deadbeef')).toBeNull();
  });

  it('rejects a key that does not start with the expected prefix', () => {
    expect(store.authenticate('some-random-value')).toBeNull();
  });

  it('rejects a revoked key', () => {
    const { plaintext } = store.mint('bob');
    store.revoke('bob');
    expect(store.authenticate(plaintext)).toBeNull();
  });

  it('revokes by label and by hash prefix', () => {
    const { record: r1 } = store.mint('alice');
    const { record: r2 } = store.mint('bob');

    const revokedByLabel = store.revoke('alice');
    expect(revokedByLabel?.id).toBe(r1.id);
    expect(revokedByLabel?.revokedAt).not.toBeNull();

    const revokedByPrefix = store.revoke(r2.tokenHash.slice(0, 8));
    expect(revokedByPrefix?.id).toBe(r2.id);
  });

  it('returns null when revoking an unknown label', () => {
    expect(store.revoke('nobody')).toBeNull();
  });

  it('throws when a prefix matches multiple live keys', () => {
    // Mint two keys and force a collision by truncating to a deliberately
    // short prefix that could match either hash.
    store.mint('alice');
    store.mint('bob');
    // A 1-char hex prefix is almost certain to match both live rows.
    expect(() => store.revoke('')).toThrow();
  });

  it('accepts the legacy LUCENT_API_KEY as a fallback', () => {
    process.env['LUCENT_API_KEY'] = 'legacy-secret';
    const ctx = store.authenticate('legacy-secret');
    expect(ctx?.userId).toBe('legacy');
    expect(ctx?.label).toBe('legacy');
  });

  it('ignores the legacy env var when it is unset', () => {
    delete process.env['LUCENT_API_KEY'];
    expect(store.authenticate('legacy-secret')).toBeNull();
  });
});

describe('runWithAuth', () => {
  it('exposes the active auth context to synchronous callers', () => {
    const ctx = { userId: '1', label: 'alice', keyHashPrefix: 'abcd1234' };
    const seen = runWithAuth(ctx, () => getAuthContext());
    expect(seen).toEqual(ctx);
  });

  it('returns undefined outside of a runWithAuth scope', () => {
    expect(getAuthContext()).toBeUndefined();
  });
});

#!/usr/bin/env node
import { openKeyStore, type ApiKeyRecord } from './auth.js';

/**
 * Admin CLI for minting, listing, and revoking per-user API keys.
 *
 * Usage (on Fly):
 *   fly ssh console -a lucent-mcp
 *   node dist-server/server/admin.js mint alice@example.com
 *   node dist-server/server/admin.js list
 *   node dist-server/server/admin.js revoke alice@example.com
 *
 * Locally:
 *   LUCENT_KEY_DB=./data/keys.db node dist-server/server/admin.js mint dev
 */

const DB_PATH = process.env['LUCENT_KEY_DB'] ?? './data/keys.db';

function printHelp(): void {
  process.stdout.write(
    [
      'lucent-mcp-admin — manage per-user API keys for the MCP server',
      '',
      'Commands:',
      '  mint <label>             Mint a new key. Prints plaintext once — save it.',
      '  list                     List all keys (masked). Shows active + revoked.',
      '  revoke <label|prefix>    Revoke a live key by label or token hash prefix.',
      '  help                     Show this message.',
      '',
      `Database: ${DB_PATH} (override with LUCENT_KEY_DB)`,
      '',
    ].join('\n'),
  );
}

function fmtRow(r: ApiKeyRecord): string {
  const state = r.revokedAt !== null ? `revoked ${r.revokedAt}` : 'active';
  const lastUsed = r.lastUsedAt ?? 'never';
  return [
    `  #${r.id}`,
    r.label.padEnd(24).slice(0, 24),
    r.tokenHash.slice(0, 12) + '…',
    `created ${r.createdAt}`,
    `used ${lastUsed}`,
    state,
  ].join('  ');
}

function main(): number {
  const [, , cmd, ...args] = process.argv;

  if (cmd === undefined || cmd === 'help' || cmd === '--help' || cmd === '-h') {
    printHelp();
    return 0;
  }

  const store = openKeyStore(DB_PATH);
  try {
    switch (cmd) {
      case 'mint': {
        const label = args.join(' ').trim();
        if (!label) {
          process.stderr.write('error: mint requires a label\n');
          return 2;
        }
        const { plaintext, record } = store.mint(label);
        process.stdout.write(
          [
            `Minted key for "${record.label}" (id=${record.id}).`,
            '',
            'Plaintext (save this — it will not be shown again):',
            '',
            `  ${plaintext}`,
            '',
            'Give the bearer this key for use as `Authorization: Bearer <key>`.',
            '',
          ].join('\n'),
        );
        return 0;
      }

      case 'list': {
        const rows = store.list();
        if (rows.length === 0) {
          process.stdout.write('No keys yet. Use `mint <label>` to create one.\n');
          return 0;
        }
        process.stdout.write(`${rows.length} key(s):\n`);
        for (const r of rows) process.stdout.write(fmtRow(r) + '\n');
        return 0;
      }

      case 'revoke': {
        const q = args.join(' ').trim();
        if (!q) {
          process.stderr.write('error: revoke requires a label or hash prefix\n');
          return 2;
        }
        const revoked = store.revoke(q);
        if (revoked === null) {
          process.stderr.write(`No live key matches "${q}".\n`);
          return 1;
        }
        process.stdout.write(
          `Revoked "${revoked.label}" (id=${revoked.id}) at ${revoked.revokedAt}.\n`,
        );
        return 0;
      }

      default:
        process.stderr.write(`error: unknown command "${cmd}"\n\n`);
        printHelp();
        return 2;
    }
  } catch (err) {
    process.stderr.write(
      `error: ${err instanceof Error ? err.message : String(err)}\n`,
    );
    return 1;
  } finally {
    store.close();
  }
}

process.exit(main());

# MCP server hosting

The Lucent MCP HTTP server (`lucent-mcp-http`, source in [`server/http.ts`](../server/http.ts)) is deployed to [Fly.io](https://fly.io) so `https://mcp.lucentui.ai/mcp` is reachable 24/7 without a developer machine in the loop.

This doc covers:

1. Why Fly, and the shape of the deploy
2. First-time deploy
3. Per-user API keys (mint, list, revoke, rotate)
4. Custom domain setup
5. Local development

## Why Fly

The server is a stateless Node HTTP process — each `/mcp` request builds a fresh `McpServer`, handles the JSON-RPC call, and tears it down. No DB, no queue, no cross-request state. Fly's small-VM model with auto-suspend fits that cleanly:

- Dockerfile-based deploy, no host-specific SDK to learn.
- Shared-CPU 256MB VM is plenty; registry lookups return in ms.
- Auto-suspend on idle + fast resume keeps cost near zero for beta traffic.
- `iad` region close to most users; easy to add more if needed.

Railway, Vercel (via `@vercel/mcp-adapter`), and Cloudflare Workers were considered — see issue #138 for the comparison.

## Deploy files

| File | Purpose |
| --- | --- |
| [`Dockerfile`](../Dockerfile) | Multi-stage build: `pnpm build:server` in a builder stage, production deps + compiled output in the runtime stage. |
| [`.dockerignore`](../.dockerignore) | Keeps dev files, tests, and `node_modules` out of the build context. |
| [`fly.toml`](../fly.toml) | Fly app manifest — port, health check, VM size, region. |

## First-time deploy

Prerequisites: [`flyctl`](https://fly.io/docs/hands-on/install-flyctl/) installed and logged in (`fly auth login`).

```bash
fly apps create lucent-mcp
fly volumes create lucent_mcp_data --app lucent-mcp --region iad --size 1
fly deploy --app lucent-mcp
```

The `lucent_mcp_data` volume holds the SQLite key database (`/data/keys.db` inside the container). A 1 GB volume is far more than needed — Fly's minimum — and survives deploys.

Verify the deploy:

```bash
# Should return {"status":"ok"}
curl https://lucent-mcp.fly.dev/health

# Should return 401 Unauthorized (no bearer token)
curl -i https://lucent-mcp.fly.dev/mcp -X POST
```

To actually call `/mcp` you need a key — mint one via the admin CLI below.

## Per-user API keys

Every `/mcp`, `/usage`, and `/usage/stream` request requires `Authorization: Bearer <key>`. Keys are stored as sha256 hashes in the SQLite DB on the Fly volume — plaintext is only shown once at mint time. (`/health` stays unauthenticated so Fly's probe works.)

### Mint a key

Keys are minted via `lucent-mcp-admin`, which is shipped in the container. Run it over `fly ssh console`:

```bash
fly ssh console --app lucent-mcp
# inside the container:
node dist-server/server/admin.js mint alice@example.com
```

The output includes the plaintext key once — save it, it will not be shown again. Hand it to the user for their MCP client's `Authorization: Bearer …` header.

### List keys

```bash
node dist-server/server/admin.js list
```

Shows label, masked hash, created/last-used timestamps, and revoked state for every key.

### Revoke a key

```bash
node dist-server/server/admin.js revoke alice@example.com
# or by hash prefix:
node dist-server/server/admin.js revoke a1b2c3d4
```

Revocation is a soft delete (sets `revoked_at`) — the row stays for audit purposes, but the key stops authenticating immediately.

### End-of-beta bulk revoke

To kill every active key at once (e.g. when the beta ends):

```bash
fly ssh console --app lucent-mcp
# inside the container:
sqlite3 /data/keys.db "UPDATE keys SET revoked_at = datetime('now') WHERE revoked_at IS NULL"
```

### Legacy `LUCENT_API_KEY` (transition only)

Before per-user keys landed, auth was a single shared `LUCENT_API_KEY` secret. The server still accepts that value if the secret is set, as a fallback during cutover. Once the first DB key is minted and confirmed working, remove the legacy secret:

```bash
fly secrets unset LUCENT_API_KEY --app lucent-mcp
```

After that, only DB keys authenticate.

## Custom domain

Production hostname is `mcp.lucentui.ai`, pointed at the Fly app via Cloudflare DNS. To attach a new custom hostname (or re-point an existing one):

1. Attach the hostname to the Fly app — this also triggers Let's Encrypt cert issuance:
   ```bash
   fly certs create mcp.lucentui.ai --app lucent-mcp
   ```
2. Fly prints DNS records to set. For this app it's A + AAAA (shared IPv4/IPv6), not a CNAME.
3. In Cloudflare, on the `lucentui.ai` zone, add the two records exactly as Fly printed them. **Set both to "DNS only" (grey cloud) — if left proxied, Cloudflare terminates TLS and Fly's cert challenge fails.**
4. Watch cert validation:
   ```bash
   fly certs check mcp.lucentui.ai --app lucent-mcp
   ```
   Usually reports `Status = Issued` within 1–2 min once DNS resolves to the Fly IPs.
5. Smoke-test:
   ```bash
   curl https://mcp.lucentui.ai/health
   ```

## Local development

The managed Fly app is the source of truth, but you can run `lucent-mcp-http` locally for quick iteration. The local server uses the same admin CLI against a local SQLite file.

```bash
pnpm build:server

# Mint a dev key (first run creates ./data/keys.db)
node dist-server/server/admin.js mint dev

# Start the server
HOST=127.0.0.1 PORT=3000 node dist-server/server/http.js
```

Point your MCP client at `http://127.0.0.1:3000/mcp` with the minted key as the bearer token. Do not use the production DNS (`mcp.lucentui.ai`) for local work — it lives with Fly.

To expose the local server to remote clients, pair it with a Cloudflare Tunnel (`cloudflared tunnel run …`). Not needed for most iteration.

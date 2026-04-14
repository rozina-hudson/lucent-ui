# MCP server hosting

The Lucent MCP HTTP server (`lucent-mcp-http`, source in [`server/http.ts`](../server/http.ts)) is deployed to [Fly.io](https://fly.io) so `https://mcp.lucentui.ai/mcp` is reachable 24/7 without a developer machine in the loop.

This doc covers:

1. Why Fly, and the shape of the deploy
2. First-time deploy
3. Setting and rotating `LUCENT_API_KEY`
4. DNS cutover
5. Local fallback via `cloudflared`

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
# From the repo root. Creates the app on first run, deploys a new revision on later runs.
fly deploy
```

The app name (`lucent-mcp`) and region (`iad`) come from `fly.toml`. Change them there if you need a different region or want a throwaway staging app.

Verify the deploy:

```bash
# Should return {"status":"ok"}
curl https://lucent-mcp.fly.dev/health

# Should return 401 Unauthorized (no bearer token)
curl -i https://lucent-mcp.fly.dev/mcp -X POST

# Should return a JSON-RPC response listing tools
curl -s https://lucent-mcp.fly.dev/mcp \
  -X POST \
  -H "Authorization: Bearer $LUCENT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

## Setting and rotating `LUCENT_API_KEY`

The server requires a bearer token for `/mcp`, `/usage`, and `/usage/stream`. `/health` is intentionally unauthenticated so Fly's health check can probe it.

**Set the secret** (only needed once, or when rotating):

```bash
# Generate a strong random key and push it to Fly's secret store.
# `fly secrets set` triggers a rolling restart, so the new key takes effect immediately.
fly secrets set LUCENT_API_KEY="$(openssl rand -hex 32)"
```

**Rotate**:

1. Generate the new key: `NEW_KEY=$(openssl rand -hex 32)`
2. Distribute to beta users through your usual channel *before* cutting over (they'll need to update their MCP client config).
3. `fly secrets set LUCENT_API_KEY="$NEW_KEY"` — rolling restart happens automatically.
4. Old key stops working as soon as the new machine comes up.

Until issue #151 lands (per-user API keys), this is a single shared secret — rotation affects every beta user at once.

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

## Local fallback via `cloudflared`

The managed Fly app is the source of truth, but you can still run `lucent-mcp-http` locally and expose it via Cloudflare Tunnel for quick iteration — useful when testing a change before pushing to Fly.

```bash
# In one shell, run the server locally.
pnpm build:server
LUCENT_API_KEY=dev-only HOST=127.0.0.1 PORT=3000 node dist-server/server/http.js

# In another shell, expose it through the named tunnel.
cloudflared tunnel run lucent-mcp
```

Point your MCP client at `http://127.0.0.1:3000/mcp` for pure-local dev, or at the named-tunnel hostname for remote clients. Do not use the production DNS (`mcp.lucentui.ai`) for local work — it lives with Fly now.

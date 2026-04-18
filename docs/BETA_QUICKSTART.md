# Lucent UI beta quickstart

Welcome to the Lucent UI private beta. This page takes you from zero to "my AI assistant knows about Lucent components" in under 10 minutes.

**What you get as a beta user:** a personal API key for the Lucent MCP server at `https://mcp.lucentui.ai/mcp`. Your AI assistant (Claude Desktop, Cursor, or any MCP-compatible client) connects to it and gains tools for looking up component manifests, design presets, and composition patterns — so it writes Lucent UI code that actually matches the library, instead of hallucinating props.

---

## 1. Request your key

Beta keys are issued by hand. DM us (Slack / email / wherever you normally reach us) with:

- Your name
- The project you're planning to use Lucent UI in (one sentence is fine)

We'll reply with a single-view [onetimesecret.com](https://onetimesecret.com) link that contains your key. The link self-destructs after you open it — save the key to your password manager immediately, because we can't re-show it.

Your key looks like `lucent_beta_` followed by 32 hex characters.

---

## 2. Configure your MCP client

Pick whichever client you already use. The config is the same shape in all of them: a bearer token against our HTTPS endpoint.

> **Heads up:** this is a **remote HTTP MCP** server. Cursor ≥ 0.44 talks to it natively. Claude Desktop currently needs a tiny `npx mcp-remote` bridge (Node required) because its config validator strips remote HTTP entries on launch — the recipe below handles that for you.

### Claude Desktop

Claude Desktop's config validator currently strips remote HTTP MCP entries on launch, and its in-app "Add custom connector" dialog only accepts OAuth — not bearer tokens. The working path is a local `mcp-remote` bridge that pipes our HTTPS endpoint through a stdio command.

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "lucent-ui": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote@latest",
        "https://mcp.lucentui.ai/mcp",
        "--header",
        "Authorization: Bearer lucent_beta_your_key_here"
      ]
    }
  }
}
```

Requires Node.js on your machine (for `npx`). Fully quit and reopen Claude Desktop. The Lucent tools should show up in the tools picker in the chat UI.

### Cursor

Edit `.cursor/mcp.json` at your project root (or `~/.cursor/mcp.json` for all projects):

```json
{
  "mcpServers": {
    "lucent-ui": {
      "url": "https://mcp.lucentui.ai/mcp",
      "headers": {
        "Authorization": "Bearer lucent_beta_your_key_here"
      }
    }
  }
}
```

Restart Cursor, then open Settings → MCP and confirm `lucent-ui` shows a green status.

### Other clients

Any MCP client that supports the [Streamable HTTP transport](https://modelcontextprotocol.io/docs/concepts/transports#streamable-http) will work — URL + bearer token are all you need. If your client has its own config format, replicate the same two fields (`url`, `Authorization: Bearer …`).

---

## 3. Make your first call

In your AI assistant, ask something like:

> Using lucent-ui, give me a Button component with a loading spinner. Use the real prop names.

Behind the scenes the assistant will call the Lucent tool `get_component_manifest("Button")`, read the actual prop list, and write code that matches. You can also try:

- "What composition patterns does Lucent UI have for dashboards?" → `search_components` / `get_composition_pattern`
- "Generate a LucentProvider config for a modern emerald theme." → `get_preset_config`
- "What spacing rules does Lucent UI use?" → `get_design_rules`

If the assistant's code uses props that are actually in the manifest, you're good.

---

## 4. Troubleshooting

**`401 Unauthorized`** — The bearer token is missing, wrong, or revoked. Double-check the `Authorization` header matches the key you got verbatim (including the `lucent_beta_` prefix). If you think it was revoked by mistake, ping us.

**`404 Not Found` or "connection refused"** — You're probably hitting the wrong URL. The path is `/mcp` (not `/` or `/v1/mcp`), and the hostname is `mcp.lucentui.ai` (not `.com`).

**Client says "MCP server not supported" or only accepts a `command`/`args` config** — Your client is on an older version that only speaks stdio. Update it. If you can't, tell us and we'll look at a bridge as a followup.

**Claude Desktop deletes the `lucent-ui` block on launch** — Recent Claude Desktop builds (≥ `1.2773.0`) reject remote HTTP MCP entries in the JSON config and silently strip them. Use the `npx mcp-remote` command form shown above — it satisfies the stdio-only validator while piping the remote HTTPS tools through. The in-app "Add custom connector" dialog won't work either: it only accepts OAuth, not bearer tokens.

**Tools show up but every call errors** — Usually a stale config. Fully quit and relaunch the client (not just close the window). On macOS, `⌘Q` the app, then reopen.

---

## 5. Feedback

This is a beta — we actively want rough edges in writing.

- **Bugs or broken tools:** [open an issue](https://github.com/rozina-hudson/lucent-ui/issues/new?labels=beta) and apply the `beta` label.
- **Feature requests / missing components:** same issue tracker, or reply on whatever channel we used to send you the key.
- **"This crashed / hung / timed out":** include the tool name, the parameters you passed, and (if you have it) the `fly-request-id` from the response headers.

We watch `last_used_at` on every key, so we can tell who's actually exercising the server — if something breaks and you fall silent, we'll reach out.

Thank you for beta-testing.

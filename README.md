# Lucent UI

> An AI-first React component library. Every component ships with a machine-readable manifest so AI coding assistants generate correct, on-brand UI the first time.

---

## Status

🚧 Under active development — see the [project board](https://github.com/users/rozinashopify/projects/3) for progress.

---

## Quick start

```bash
# Install
pnpm add lucent-ui
```

```tsx
import { LucentProvider } from 'lucent-ui';
import 'lucent-ui/styles';

function App() {
  return (
    <LucentProvider>
      {/* your app */}
    </LucentProvider>
  );
}
```

---

## What is a COMPONENT_MANIFEST?

Every component exports a machine-readable manifest describing its props, usage examples, composition graph, and design intent. This lets AI tools like Claude and Cursor generate correct, on-brand code without guessing.

```ts
import { Button, ButtonManifest } from 'lucent-ui';

console.log(ButtonManifest);
// {
//   id: 'button',
//   name: 'Button',
//   tier: 'atom',
//   props: [...],
//   usageExamples: [...],
//   designIntent: '...',
// }
```

---

## MCP Server

Connect Lucent UI's manifest layer to your AI coding tool. The server exposes three tools:

- **`list_components`** — all component names + tiers
- **`get_component_manifest(componentName)`** — full manifest JSON for a component
- **`search_components(query)`** — components matching a description

### Cursor

```json
// .cursor/mcp.json
{
  "mcpServers": {
    "lucent-ui": {
      "command": "npx",
      "args": ["lucent-mcp"],
      "env": { "LUCENT_API_KEY": "your-key" }
    }
  }
}
```

### Claude Desktop

```json
// ~/Library/Application Support/Claude/claude_desktop_config.json
{
  "mcpServers": {
    "lucent-ui": {
      "command": "npx",
      "args": ["lucent-mcp"],
      "env": { "LUCENT_API_KEY": "your-key" }
    }
  }
}
```

### Run locally

```bash
node dist-server/server/index.js
```

---

## License

MIT

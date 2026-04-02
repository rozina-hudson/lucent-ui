# Lucent UI

[![CI](https://github.com/rozina-hudson/lucent-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/rozina-hudson/lucent-ui/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/lucent-ui)](https://www.npmjs.com/package/lucent-ui)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

**[Documentation & component playground → lucentui.dev](https://lucentui.dev)**

> **The React component library built for AI coding assistants.**
> Every component ships with a machine-readable manifest — so Claude, Cursor, and Copilot generate correct, on-brand UI the first time, every time.

---

## Why Lucent UI?

AI tools generate UI from natural language. Without structure, they guess at prop names, invent variants that don't exist, and ignore design intent.

Lucent UI solves this with `COMPONENT_MANIFEST` — a structured descriptor attached to every component and exposed via an **MCP server**. Your AI assistant calls `get_component_manifest("Button")` and gets back the full prop API, usage examples, and design intent. No more hallucinated props.

---

## Quick start

```bash
pnpm add lucent-ui
```

```tsx
import { LucentProvider, Button, Badge } from 'lucent-ui';
import 'lucent-ui/styles';

export default function App() {
  return (
    <LucentProvider>
      <Button variant="primary">Get started</Button>
      <Badge variant="success">Live</Badge>
    </LucentProvider>
  );
}
```

---

## Components

### Atoms (19)
| Component | Description |
|-----------|-------------|
| `Button` | Clickable control with `primary`, `secondary`, `ghost`, `danger` variants |
| `Badge` | Inline status label |
| `Avatar` | User avatar with image, initials, and icon fallback |
| `Input` | Text input with label, helper text, and error state |
| `Textarea` | Multi-line text input |
| `Checkbox` | Controlled checkbox with spring animation |
| `Radio` / `RadioGroup` | Radio button with group context |
| `Toggle` | On/off switch |
| `Select` | Native select with styled appearance |
| `Slider` | Range input with token-driven track and thumb |
| `Tag` | Removable or static tag/chip |
| `Tooltip` | Hover tooltip with placement options |
| `Icon` | SVG icon wrapper (Lucide-compatible) |
| `Text` | Polymorphic typography primitive (`p`, `h1`–`h6`, `span`, `code`, …) |
| `Spinner` | Loading indicator |
| `Divider` | Horizontal or vertical rule |
| `NavLink` | Navigation link with active state and accent highlight |
| `Table` | Structural table primitive (`Table`, `Head`, `Body`, `Row`, `Cell`) |
| `CodeBlock` | Syntax-highlighted code with tab support and prompt variant |

### Molecules (17)
| Component | Description |
|-----------|-------------|
| `FormField` | Label + input + helper/error text composition |
| `SearchInput` | Input with built-in search icon and clear button |
| `Card` | Surface container with header, body, and footer slots |
| `Alert` | Inline feedback banner (`info`, `success`, `warning`, `danger`) |
| `EmptyState` | Zero-data placeholder with icon, title, and action |
| `Skeleton` | Loading placeholder for content areas |
| `Breadcrumb` | Navigational breadcrumb trail |
| `Tabs` | Tabbed content switcher with sliding indicator |
| `Collapsible` | Expandable/collapsible section with animated height |
| `PageLayout` | App shell with sidebar, header, right panel, and footer slots |
| `DataTable` | Sortable, paginated, filterable data table |
| `CommandPalette` | Keyboard-driven command launcher |
| `MultiSelect` | Multi-value select with search and tag display |
| `DatePicker` | Single-date calendar picker |
| `DateRangePicker` | Date range calendar picker |
| `FileUpload` | Drag-and-drop file upload with preview |
| `Timeline` | Vertical event/activity timeline |

---

## What is a COMPONENT_MANIFEST?

Every component exports a typed manifest describing its full API:

```ts
import { ButtonManifest } from 'lucent-ui';

console.log(ButtonManifest);
// {
//   id: 'button',
//   name: 'Button',
//   tier: 'atom',
//   description: 'A clickable control that triggers an action.',
//   props: [
//     { name: 'variant', type: 'enum', enumValues: ['primary','secondary','ghost','danger'], ... },
//     { name: 'size',    type: 'enum', enumValues: ['sm','md','lg'], ... },
//     ...
//   ],
//   usageExamples: [...],
//   designIntent: 'Use "primary" for the single most important action...',
//   compositionGraph: [],
//   specVersion: '0.1',
// }
```

See [`docs/COMPONENT_MANIFEST_SPEC.md`](docs/COMPONENT_MANIFEST_SPEC.md) for the full specification.

---

## MCP Server

Connect Lucent UI's manifest layer to your AI coding tool. The server exposes three tools:

| Tool | Description |
|------|-------------|
| `list_components` | All component names and tiers |
| `get_component_manifest(name)` | Full manifest JSON for a component |
| `search_components(query)` | Components matching a natural-language description |

### Cursor

```json
// .cursor/mcp.json
{
  "mcpServers": {
    "lucent-ui": {
      "command": "npx",
      "args": ["lucent-mcp"]
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
      "args": ["lucent-mcp"]
    }
  }
}
```

### Run locally (dev)

```bash
node dist-server/server/index.js
```

---

## Theming

Lucent UI uses CSS custom properties — no CSS-in-JS, no runtime overhead.

```tsx
import { LucentProvider, brandTokens, createTheme } from 'lucent-ui';

// Default neutral theme
<LucentProvider>...</LucentProvider>

// Built-in gold accent preset
<LucentProvider tokens={brandTokens}>...</LucentProvider>

// Generate a full light/dark theme from a single accent color
const theme = createTheme({ accent: '#6366f1' });
<LucentProvider tokens={theme.light} darkTokens={theme.dark}>...</LucentProvider>

// Fully custom token overrides
<LucentProvider tokens={{ accentDefault: '#6366f1', accentHover: '#4f46e5' }}>
  ...
</LucentProvider>
```

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## License

MIT

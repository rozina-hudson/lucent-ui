# COMPONENT_MANIFEST Spec v0.1

> A machine-readable description of a UI component, designed to give AI coding assistants the context they need to generate correct, on-brand code.

---

## Motivation

AI tools like Claude, Cursor, and Copilot generate UI code from natural language. Without structured context, they guess at prop names, invent variants that don't exist, and ignore design intent. `COMPONENT_MANIFEST` solves this by attaching a rich, structured descriptor to every component — consumed directly by an MCP server.

---

## Structure

```ts
interface ComponentManifest {
  id:               string;               // kebab-case unique identifier
  name:             string;               // display name
  tier:             ComponentTier;        // atom | molecule | block | flow | overlay
  domain:           string;               // "neutral" or product domain
  description:      string;               // one-sentence summary
  props:            PropDescriptor[];     // full prop API
  usageExamples:    UsageExample[];       // copy-paste code snippets
  compositionGraph: CompositionNode[];    // sub-components (empty for atoms)
  designIntent:     string;               // the "why" behind visual/interaction decisions
  accessibility?:   AccessibilityDescriptor;
  specVersion:      string;               // "MAJOR.MINOR"
}
```

---

## Fields

### `id`
Kebab-case unique identifier. Used by the MCP server for lookups.
```
"button" | "form-field" | "data-table"
```

### `name`
Display name shown in documentation and tooling.

### `tier`
The level of the component in the design system hierarchy:

| Tier | Description | Examples |
|---|---|---|
| `atom` | Indivisible primitive | Button, Input, Badge |
| `molecule` | Composed from atoms | FormField, Card, Alert |
| `block` | Page-section level | PageHeader, SidebarNav |
| `flow` | Multi-step / stateful | Wizard, Onboarding |
| `overlay` | Layers above content | Modal, Drawer, Tooltip |

### `domain`
Use `"neutral"` for general-purpose components. Set to a product area (e.g. `"billing"`, `"auth"`) for domain-specific components.

### `description`
One sentence. Written for an AI audience — precise, not marketing copy.

### `props`
Full prop API. Each `PropDescriptor`:

```ts
interface PropDescriptor {
  name:        string;
  type:        PropType;       // "string" | "boolean" | "enum" | "ReactNode" | …
  required:    boolean;
  default?:    string;         // string representation of default value
  description: string;
  enumValues?: string[];       // for type: "enum"
}
```

### `usageExamples`
Code strings an AI can use directly. At minimum: one default usage + one edge case.

```ts
interface UsageExample {
  title:        string;
  code:         string;        // JSX / TSX
  description?: string;
}
```

### `compositionGraph`
For molecules and above — the sub-components this component uses:

```ts
interface CompositionNode {
  componentId:   string;
  componentName: string;
  role:          string;   // how it's used
  required:      boolean;
}
```

Atoms always have an empty `compositionGraph: []`.

### `designIntent`
**The most important field for AI-legibility.** Explain:
- When to use each variant
- What the component is optimised for
- What it should *not* be used for
- Any constraints or pairing rules

Example:
> "Use 'primary' for the single most important action in a view. Use 'danger' exclusively for destructive or irreversible operations — never for warnings."

### `accessibility`
Optional but recommended:

```ts
interface AccessibilityDescriptor {
  role?:                 string;
  ariaAttributes?:       string[];
  keyboardInteractions?: string[];
  notes?:                string;
}
```

### `specVersion`
`"MAJOR.MINOR"` — currently `"0.1"`. Consumers should check this field when parsing manifests.

---

## Validation

```ts
import { validateManifest, assertManifest } from 'lucent-ui';

// Returns { valid: boolean, errors: ValidationError[] }
const result = validateManifest(MyManifest);

// Throws if invalid — use in tests
assertManifest(MyManifest);
```

---

## Example: Button manifest

```ts
import type { ComponentManifest } from 'lucent-ui';

export const ButtonManifest: ComponentManifest = {
  id: 'button',
  name: 'Button',
  tier: 'atom',
  domain: 'neutral',
  specVersion: '0.1',
  description: 'A clickable control that triggers an action.',
  designIntent:
    'Use "primary" for the single most important action. Use "danger" exclusively ' +
    'for destructive operations. Reserve "ghost" for low-emphasis actions in dense UIs.',
  props: [
    {
      name: 'variant',
      type: 'enum',
      required: false,
      default: 'primary',
      description: 'Visual style conveying action hierarchy.',
      enumValues: ['primary', 'secondary', 'ghost', 'danger'],
    },
    // …
  ],
  usageExamples: [
    {
      title: 'Primary action',
      code: `<Button variant="primary" onClick={handleSave}>Save changes</Button>`,
    },
  ],
  compositionGraph: [],
};
```

---

## Adopting this spec in your own library

1. Install the types: `pnpm add -D lucent-ui` (types only — tree-shake the rest)
2. Add a `COMPONENT_MANIFEST` export alongside each component
3. Use `validateManifest()` in your test suite to enforce spec compliance
4. Optionally: run your own MCP server pointing at your manifests

See [lucentui.ai/spec](https://lucentui.ai/spec) for the full versioned specification.

---

## Versioning

| Version | Status | Notes |
|---|---|---|
| 0.1 | Current | Initial spec — may change before 1.0 |
| 1.0 | Planned | Stable, JSON Schema published |

Breaking changes will increment the major version. Additive changes increment minor.

# COMPONENT_MANIFEST Spec v1.0

> **COMPONENT_MANIFEST_SPEC@1.0.0** — A machine-readable description of a UI component, designed to give AI coding assistants the context they need to generate correct, on-brand code.

**Status:** Stable
**JSON Schema:** [component-manifest.schema.json](./component-manifest.schema.json) · published at `https://lucentui.ai/spec/component-manifest.schema.json`
**Migration guide:** [COMPONENT_MANIFEST_MIGRATION.md](./COMPONENT_MANIFEST_MIGRATION.md)

---

## Motivation

AI tools like Claude, Cursor, and Copilot generate UI code from natural language. Without structured context, they guess at prop names, invent variants that don't exist, and ignore design intent. `COMPONENT_MANIFEST` solves this by attaching a rich, structured descriptor to every component — consumed directly by an MCP server or any compatible tooling.

The spec is library-agnostic. Any component library — shadcn/ui, MUI, Radix, your in-house system — can export manifests conforming to this standard.

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
  usageExamples:    UsageExample[];       // copy-paste code snippets (≥1 required)
  compositionGraph: CompositionNode[];    // sub-components (empty [] for atoms)
  designIntent:     string;               // the "why" behind visual/interaction decisions
  accessibility?:   AccessibilityDescriptor;
  specVersion:      string;               // "MAJOR.MINOR" — currently "1.0"
}
```

---

## Fields

### `id`
Kebab-case unique identifier. Used by the MCP server and tooling for lookups.
```
"button" | "form-field" | "data-table"
```

Pattern: `^[a-z][a-z0-9-]*$`

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
  name:         string;
  type:         PropType;       // "string" | "boolean" | "enum" | "ReactNode" | …
  required:     boolean;
  default?:     string;         // string representation of default value
  description:  string;
  enumValues?:  string[];       // required when type is "enum"
}
```

**`PropType` well-known values:** `"string"`, `"number"`, `"boolean"`, `"ReactNode"`, `"function"`, `"enum"`, `"object"`, `"array"`, `"ref"`. Custom type names (e.g. `"ButtonVariant"`) are also valid.

### `usageExamples`
Code strings an AI can use directly. **At minimum: one default usage + one edge case.**

```ts
interface UsageExample {
  title:        string;
  code:         string;        // JSX / TSX
  description?: string;
}
```

### `compositionGraph`
For molecules and above — the sub-components this component uses. Atoms always set `compositionGraph: []`.

```ts
interface CompositionNode {
  componentId:   string;   // kebab-case id of the sub-component
  componentName: string;
  role:          string;   // how it's used in this composition
  required:      boolean;
}
```

### `designIntent`
**The most important field for AI-legibility.** Explain:
- When to use each variant
- What the component is optimised for
- What it should *not* be used for
- Any constraints or pairing rules

Example:
> "Use 'primary' for the single most important action in a view. Use 'danger' exclusively for destructive or irreversible operations — never for warnings."

### `accessibility`
Optional but strongly recommended:

```ts
interface AccessibilityDescriptor {
  role?:                 string;
  ariaAttributes?:       string[];
  keyboardInteractions?: string[];
  notes?:                string;
}
```

### `specVersion`
`"MAJOR.MINOR"` — currently `"1.0"`. Consumers must check this field when parsing manifests. Manifests with a `0.x` version should be treated as pre-stable.

---

## JSON Schema validation

A JSON Schema (draft-07) is published alongside this spec. Use it to validate any manifest:

```bash
# Install a JSON Schema validator
npm install -g ajv-cli

# Validate your manifest
ajv validate -s docs/component-manifest.schema.json -d my-manifest.json
```

Or programmatically via the Lucent UI runtime validator:

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
  specVersion: '1.0',
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
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      description: 'Button label or content.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      default: 'false',
      description: 'Prevents interaction and applies disabled styling.',
    },
  ],
  usageExamples: [
    {
      title: 'Primary action',
      code: `<Button variant="primary" onClick={handleSave}>Save changes</Button>`,
    },
    {
      title: 'Destructive action',
      code: `<Button variant="danger" onClick={handleDelete}>Delete account</Button>`,
    },
  ],
  compositionGraph: [],
  accessibility: {
    role: 'button',
    ariaAttributes: ['aria-disabled', 'aria-busy'],
    keyboardInteractions: ['Enter — activates the button', 'Space — activates the button'],
  },
};
```

---

## Adopting this spec in your own library

See the full [Migration Guide](./COMPONENT_MANIFEST_MIGRATION.md) for step-by-step instructions for shadcn/ui, MUI, Radix, and other libraries.

Quick start:
1. Install the types: `npm add -D lucent-ui` (types only — tree-shake the rest)
2. Add a `COMPONENT_MANIFEST` export alongside each component
3. Use `validateManifest()` in your test suite to enforce spec compliance
4. Optionally: run your own MCP server pointing at your manifests

---

## Versioning

| Version | Status | Notes |
|---|---|---|
| 0.1 | Superseded | Initial draft — pre-stable |
| 1.0 | **Current (stable)** | Stable API, JSON Schema published, migration guide available |

Breaking changes increment the major version. Additive changes increment minor. Manifests must set `specVersion` to the version of this spec they conform to.

### What changed from 0.1 → 1.0

- `specVersion` field bumped from `"0.1"` to `"1.0"`
- JSON Schema published alongside spec (draft-07, `$id` points to `lucentui.ai/spec`)
- `usageExamples` minimum count of 1 is now enforced in schema (was previously documented-only)
- `compositionGraph[].componentId` now enforces kebab-case pattern in schema
- `PropDescriptor.enumValues` minimum of 1 item enforced when present
- All `additionalProperties: false` — unknown keys now fail schema validation
- Migration guide added for shadcn/ui, MUI, and Radix

### Migration from 0.1 → 1.0

No TypeScript interface changes. The only required code change is:

```diff
- specVersion: '0.1',
+ specVersion: '1.0',
```

---

*Maintained by [Lucent UI](https://github.com/rozina-hudson/lucent-ui). Issues and feedback welcome.*

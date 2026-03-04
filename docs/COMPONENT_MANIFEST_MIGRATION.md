# COMPONENT_MANIFEST Migration Guide

> How to add `COMPONENT_MANIFEST` exports to an existing component library — shadcn/ui, MUI, Radix, or your own system.

This guide targets library authors and design system maintainers. By the end, every component in your library will export a typed, machine-readable manifest that AI tools can consume directly.

**Spec reference:** [COMPONENT_MANIFEST_SPEC.md](./COMPONENT_MANIFEST_SPEC.md)
**JSON Schema:** [component-manifest.schema.json](./component-manifest.schema.json)

---

## Why bother?

AI coding assistants (Claude, Cursor, Copilot) generate UI code without knowing your component API. They invent prop names, use variants that don't exist, and ignore your design intent. A `COMPONENT_MANIFEST` gives them structured, trustworthy context — the same way OpenAPI does for REST APIs.

Once your manifests are in place, you can:
- Point an MCP server at them so Claude knows your component API by default
- Generate documentation automatically
- Lint AI-generated code against your actual API
- Validate manifests in CI

---

## Step 1 — Install the types

The manifest types are published as part of `lucent-ui`. Install it as a dev dependency — you only need the types, the runtime components are tree-shaken away:

```bash
# npm
npm add -D lucent-ui

# pnpm
pnpm add -D lucent-ui

# yarn
yarn add -D lucent-ui
```

---

## Step 2 — Create your first manifest

Co-locate a `.manifest.ts` file alongside each component:

```
src/
  components/
    Button/
      Button.tsx          ← your existing component
      Button.manifest.ts  ← new file
      index.ts
```

**`Button.manifest.ts`:**

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
    'Use "primary" for the single most important action in a view. ' +
    'Use "danger" exclusively for destructive operations. ' +
    'Reserve "ghost" for low-emphasis actions in dense UIs.',
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
      description: 'Use "danger" only for irreversible operations.',
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

Export it from your component's `index.ts`:

```ts
export { Button } from './Button';
export { ButtonManifest } from './Button.manifest';
```

---

## Step 3 — Validate in your test suite

Add a test that asserts every manifest is valid before you ship:

```ts
// Button.manifest.test.ts
import { assertManifest } from 'lucent-ui';
import { ButtonManifest } from './Button.manifest';

test('ButtonManifest is valid', () => {
  // Throws with a descriptive message if the manifest is invalid
  assertManifest(ButtonManifest);
});
```

Or use `validateManifest` when you need the error list without throwing:

```ts
import { validateManifest } from 'lucent-ui';
import { ButtonManifest } from './Button.manifest';

test('ButtonManifest is valid', () => {
  const result = validateManifest(ButtonManifest);
  expect(result.valid).toBe(true);
  expect(result.errors).toHaveLength(0);
});
```

---

## Step 4 — Validate against JSON Schema (optional, CI)

For language-agnostic validation (e.g. in a non-TypeScript repo or CI pipeline):

```bash
npm install -g ajv-cli

# Compile your manifest to JSON first, then validate
ajv validate \
  -s node_modules/lucent-ui/docs/component-manifest.schema.json \
  -d path/to/button.manifest.json
```

Or reference the schema directly in your manifest JSON via `$schema`:

```json
{
  "$schema": "https://lucentui.ai/spec/component-manifest.schema.json",
  "id": "button",
  "name": "Button",
  ...
}
```

---

## Library-specific notes

### shadcn/ui

shadcn components are copied into your project (`components/ui/`), not imported from a package. Add a `.manifest.ts` next to each copied component file.

The `tier` for most shadcn components:
- `button`, `badge`, `avatar`, `input`, `checkbox` → `"atom"`
- `card`, `alert`, `dialog`, `form` → `"molecule"`
- `navigation-menu`, `sidebar` → `"block"`
- `sheet`, `drawer`, `popover`, `tooltip` → `"overlay"`

Use `domain: "neutral"` for all shadcn primitives.

**Example structure:**

```
components/
  ui/
    button.tsx           ← shadcn component (unchanged)
    button.manifest.ts   ← your manifest
```

Because shadcn components have a fixed, documented API, you can write manifests by reading the Radix/shadcn docs — you don't need to reverse-engineer the source.

### MUI (Material UI)

MUI components are imported from `@mui/material`. You won't co-locate manifests inside `node_modules`. Instead, maintain a separate `manifests/` directory in your project:

```
src/
  manifests/
    mui-button.manifest.ts
    mui-text-field.manifest.ts
    index.ts
```

Use the MUI component's public prop API (from their docs/TypeScript types) to fill in `props`. Set `domain: "neutral"` for core MUI components, or your product domain for custom wrappers.

**Tip:** If you wrap MUI components, export manifests from the wrapper component's folder instead.

### Radix UI

Radix primitives are headless — your actual component is the styled wrapper. The manifest should describe your wrapper's API, not Radix's internal API.

For compound components (e.g. `Dialog.Root` + `Dialog.Trigger` + `Dialog.Content`), write one manifest for the composed whole, not each part:

```ts
export const DialogManifest: ComponentManifest = {
  id: 'dialog',
  name: 'Dialog',
  tier: 'overlay',
  ...
  compositionGraph: [
    { componentId: 'button', componentName: 'Button', role: 'trigger', required: false },
  ],
};
```

### Your own design system

If your library already exports TypeScript prop types, you can auto-generate the `props` array from them using a build script. The manifest's `type` field accepts any string, so mapping from your TypeScript types is straightforward.

A minimal build script pattern:

```ts
// scripts/generate-manifests.ts
import ts from 'typescript';
// ... parse your component's Props interface and emit PropDescriptor[]
```

---

## Tier reference

| Tier | Description | Examples |
|---|---|---|
| `atom` | Indivisible primitive | Button, Input, Badge, Checkbox |
| `molecule` | Composed from atoms | FormField, Card, Alert, SearchInput |
| `block` | Page-section level | PageHeader, SidebarNav, DataTable |
| `flow` | Multi-step / stateful | Wizard, Onboarding, StepForm |
| `overlay` | Layers above content | Modal, Drawer, Tooltip, Popover |

When in doubt: if a component uses other components internally, it's at least a `molecule`.

---

## designIntent — the most important field

This is what separates a useful manifest from a useless one. AI tools already know what a `variant: "primary"` prop looks like — they don't know *when* to use it.

Write `designIntent` as if explaining the component to a new engineer on their first day:

```ts
// Bad — restates the prop API
designIntent: 'The variant prop controls the visual style of the button.'

// Good — explains the design decisions
designIntent:
  'Use "primary" for the single most important action in a view — there should be ' +
  'at most one primary button per screen section. "secondary" is for supporting ' +
  'actions that appear alongside a primary. Use "ghost" in toolbars and table rows ' +
  'where a full button background would create visual noise. "danger" is reserved ' +
  'exclusively for destructive, irreversible operations — never use it for warnings.'
```

---

## Checklist

Before shipping manifests for a component:

- [ ] `id` is kebab-case and unique within your library
- [ ] `specVersion` is `"1.0"`
- [ ] `props` covers the full public API (required and commonly-used optional props)
- [ ] `usageExamples` has at least 2 examples (default + edge case)
- [ ] `designIntent` explains *when* to use each variant/option, not just what it does
- [ ] `compositionGraph` is `[]` for atoms, populated for molecules and above
- [ ] `assertManifest()` passes in your test suite

---

*Questions or feedback? Open an issue at [github.com/rozina-hudson/lucent-ui](https://github.com/rozina-hudson/lucent-ui/issues).*

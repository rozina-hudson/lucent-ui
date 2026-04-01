# Contributing to Lucent UI

Thanks for your interest in contributing! This document covers the process for adding components, fixing bugs, and improving the manifest spec.

---

## Project structure

```
src/
  components/
    atoms/<Name>/        # <Name>.tsx, <Name>.manifest.ts, index.ts
    molecules/<Name>/    # same pattern
  tokens/                # CSS custom property token system
  provider/              # LucentProvider
  index.ts               # root barrel export
server/                  # MCP server
docs/                    # spec and benchmarks
```

---

## Getting started

```bash
# Fork and clone the repo
git clone https://github.com/<your-username>/lucent-ui.git
cd lucent-ui

# Install dependencies (requires pnpm)
pnpm install

# Start the dev server
pnpm dev
```

---

## Adding a new component

Every component must include three files:

### 1. `<Name>.tsx`

- Use inline styles + CSS custom properties only — no CSS-in-JS, no Tailwind
- Source token values from `src/tokens/`; never hardcode colors or spacing
- Use the `Text` atom for any text rendering
- Disabled states use `bgMuted` / `textDisabled` / `transparent` border — no `opacity` hacks
- Animated states use the spring easing: `cubic-bezier(0.34, 1.56, 0.64, 1)`

### 2. `<Name>.manifest.ts`

Every manifest must conform to `ComponentManifest` from `src/types/manifest.ts`.

Required fields: `id`, `name`, `tier`, `domain`, `description`, `props`, `usageExamples`, `compositionGraph`, `designIntent`, `specVersion`.

Key rules:
- `id` is kebab-case, matches the export name in lowercase
- `designIntent` is the most important field — explain when to use each variant, when *not* to use it, and any pairing constraints
- `compositionGraph` is `[]` for atoms; molecules must list every atom they compose
- `usageExamples` must include at minimum one default and one edge-case example

See [`docs/COMPONENT_MANIFEST_SPEC.md`](docs/COMPONENT_MANIFEST_SPEC.md) for the full spec.

### 3. `index.ts`

```ts
export { MyComponent } from './MyComponent';
export { MyComponentManifest } from './MyComponent.manifest';
```

Then add both exports to `src/components/atoms/index.ts` (or `molecules/index.ts`).

---

## TypeScript

The project uses `"exactOptionalPropertyTypes": true`. When forwarding optional props, use conditional spread:

```ts
// ✅ correct
{...(prop !== undefined && { prop })}

// ❌ wrong — fails with exactOptionalPropertyTypes
{ prop }
```

---

## Branch and PR conventions

- Branch name: `issue/<number>-<short-slug>` (e.g. `issue/42-add-modal`)
- One component or feature per PR
- PR description should reference the issue: `closes #42`
- CI must pass (type check + build + test) before merge

---

## Commit style

Plain imperative sentences. Reference the issue where relevant.

```
feat: add Modal component (closes #42)
fix: correct focus ring on Input in Firefox
chore: update token for border-strong
```

---

## Reporting issues

Use the issue templates in `.github/ISSUE_TEMPLATE/`:
- **Bug report** — something broken
- **Component request** — new component proposal
- **Manifest feedback** — incorrect or incomplete manifest

---

## Questions?

Open a [GitHub Discussion](https://github.com/rozina-hudson/lucent-ui/discussions) or file an issue.
